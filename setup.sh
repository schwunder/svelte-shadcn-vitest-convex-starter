#!/usr/bin/env bash

# Enable strict mode
set -euo pipefail
IFS=$'\n\t'

# Debug mode (enable with DEBUG=true bash setup.sh)
DEBUG=${DEBUG:-false}

# Script constants
readonly SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
readonly LOG_FILE="setup.log"
readonly CSS_FILE="src/app.css"
readonly THEME_URL="https://next.shadcn-svelte.com/themes"
readonly MOCK_OPENAI_KEY="sk-mock-12345-your-test-key"
readonly TOTAL_STEPS=8

# Progress tracking
current_step=0

# Color constants for better readability
readonly RED='\033[0;31m'
readonly GREEN='\033[0;32m'
readonly YELLOW='\033[1;33m'
readonly BLUE='\033[0;34m'
readonly NC='\033[0m' # No Color

# Logging functions
log() { echo -e "${GREEN}[INFO]${NC} $*" | tee -a "$LOG_FILE"; }
warn() { echo -e "${YELLOW}[WARN]${NC} $*" | tee -a "$LOG_FILE"; }
error() {
    echo -e "${RED}[ERROR]${NC} $*" >&2 | tee -a "$LOG_FILE"
    exit 1
}
debug_log() { if [ "$DEBUG" = true ]; then echo -e "${BLUE}[DEBUG]${NC} $*" | tee -a "$LOG_FILE"; fi; }

# Progress tracking function
show_progress() {
    current_step=$((current_step + 1))
    log "Progress: [$current_step/$TOTAL_STEPS] $1"
}

# Helper function for user confirmation
confirm() {
    local prompt="$1"
    while true; do
        read -rp "$prompt [y/n]: " yn
        case "$yn" in
        [Yy]*) return 0 ;;
        [Nn]*) return 1 ;;
        *) warn "Please answer yes (y) or no (n)." ;;
        esac
    done
}

# Cleanup function with error recovery
cleanup() {
    debug_log "Starting cleanup process"
    local files=(".env" ".env.local" "setup.log" "package-lock.json" "bun.lockb" "yarn.lock" "sampleData.jsonl")
    local dirs=(".convex" "node_modules" "dist" "build")

    for file in "${files[@]}"; do
        debug_log "Removing file: $file"
        rm -f "$file" 2>/dev/null || true
    done
    for dir in "${dirs[@]}"; do
        debug_log "Removing directory: $dir"
        rm -rf "$dir" 2>/dev/null || true
    done
    log "Cleanup complete."
}

# Trap for cleanup on script interruption
cleanup_on_exit() {
    log "Cleaning up and exiting..."
    debug_log "Running exit cleanup"
    exit
}
trap 'cleanup_on_exit' EXIT INT TERM

# Check prerequisites
check_prerequisites() {
    show_progress "Checking prerequisites..."
    debug_log "Checking required commands"
    local required_cmds=("bun" "awk" "pbpaste")

    for cmd in "${required_cmds[@]}"; do
        debug_log "Checking for command: $cmd"
        if ! command -v "$cmd" >/dev/null 2>&1; then
            error "$cmd is required but not installed"
        fi
    done

    if [ ! -f "package.json" ]; then
        error "This script must be run from the project root directory where 'package.json' exists."
    fi
}

# Setup environment
setup_environment() {
    show_progress "Setting up environment..."
    exec > >(tee -a "$LOG_FILE") 2>&1
    debug_log "Environment setup complete"
    log "Script log saved to $LOG_FILE"
}

# Install dependencies
install_dependencies() {
    show_progress "Installing dependencies..."
    debug_log "Running bun install"
    bun install || error "Failed to install dependencies"
}

# Start Convex development server
start_convex_server() {
    local terminal_script="cd '$PWD' && bun x convex dev"
    show_progress "Starting Convex server..."
    debug_log "Terminal script: $terminal_script"

    log "The Convex development server needs to run in a separate terminal window."
    log "This window must remain open for the duration of your development session."
    if ! confirm "Ready to open Convex server in a new terminal window?"; then
        error "Convex server is required for development. Cannot proceed without it."
    fi

    case "${TERM_PROGRAM:-}" in
    "vscode")
        debug_log "Detected VS Code terminal"
        log "Opening Apple Terminal for Convex..."
        osascript -e "tell application \"Terminal\" to do script \"$terminal_script\""
        ;;
    "Apple_Terminal")
        debug_log "Detected Apple Terminal"
        log "Opening new Terminal tab for Convex..."
        osascript -e "tell application \"Terminal\" to do script \"$terminal_script\" in front window"
        ;;
    "iTerm.app")
        debug_log "Detected iTerm2"
        log "Opening new iTerm2 tab for Convex..."
        osascript <<EOF
tell application "iTerm"
    tell current window
        create tab with default profile
        tell current session of current tab to write text "$terminal_script"
    end tell
end tell
EOF
        ;;
    *)
        debug_log "Unknown terminal, using fallback"
        log "Opening Apple Terminal as fallback..."
        osascript -e "tell application \"Terminal\" to do script \"$terminal_script\""
        ;;
    esac

    log "Convex development server started in new terminal window"
    log "IMPORTANT: Please keep the new terminal window open"
    log "In the new window, you'll need to:"
    log "1. Create or select a Convex project when prompted"
    log "2. Wait for the 'Convex functions ready!' message"
    log "3. Leave the window open during development"
}

# Wait for .env.local creation
wait_for_env_local() {
    log "Waiting for .env.local to be created..."
    local timeout=300 # 5 minutes
    local start_time=$(date +%s)
    debug_log "Starting wait with timeout: $timeout seconds"

    while [ ! -f ".env.local" ]; do
        if [ $(($(date +%s) - start_time)) -gt $timeout ]; then
            error "Timeout waiting for .env.local"
        fi
        sleep 2
    done

    log ".env.local file detected!"
}

# Setup OpenAI environment with options
setup_openai() {
    show_progress "Setting up OpenAI..."
    if confirm "Would you like to configure OpenAI? (Skip if you don't need AI features)"; then
        debug_log "User chose to configure OpenAI"
        log "Setting up OpenAI environment..."
        read -rp "Enter your OpenAI API key (or press Enter to use mock key): " api_key
        api_key=${api_key:-$MOCK_OPENAI_KEY}
        echo "OPENAI_API_KEY=$api_key" >>.env.local
        cp .env.local .env || error "Failed to copy .env.local to .env"
        log "OpenAI API key added to environment files"
    else
        debug_log "User skipped OpenAI configuration"
        log "Setting up mock OpenAI key..."
        echo "OPENAI_API_KEY=$MOCK_OPENAI_KEY" >>.env.local
        cp .env.local .env || error "Failed to copy .env.local to .env"
        log "Mock OpenAI API key added to environment files"
    fi
}

# Setup ShadCN theme
setup_shadcn_theme() {
    show_progress "Setting up ShadCN theme..."
    local backup_file="${CSS_FILE}.bak"
    local temp_file="${CSS_FILE}.tmp"
    debug_log "Backup file: $backup_file"
    debug_log "Temp file: $temp_file"

    trap 'rm -f "$temp_file"' EXIT

    if [ ! -f "$CSS_FILE" ]; then
        error "$CSS_FILE not found"
    fi

    if confirm "Open ShadCN theme page in browser?"; then
        debug_log "Opening theme page in browser"
        open "$THEME_URL" 2>/dev/null || log "Please visit: $THEME_URL"
    else
        log "Please visit: $THEME_URL when ready"
    fi

    log "Please copy the desired @layer base theme content."
    read -rp "Press Enter when ready..."

    log "Validating clipboard content..."
    local theme_content
    theme_content=$(pbpaste)
    debug_log "Validating theme content"
    if [[ ! "$theme_content" =~ "@layer base" ]] || [[ ! "$theme_content" =~ ":root" ]] || [[ ! "$theme_content" =~ ".dark" ]]; then
        error "Invalid theme content"
    fi

    echo "$theme_content"
    if ! confirm "Proceed with this theme?"; then
        error "Theme application cancelled"
    fi

    debug_log "Creating CSS file backup"
    cp "$CSS_FILE" "$backup_file" || error "Failed to backup CSS file"

    debug_log "Applying new theme"
    {
        echo -e "@tailwind base;\n@tailwind components;\n@tailwind utilities;\n"
        echo "$theme_content"
        echo -e "\n@layer base {\n  * {\n    @apply border-border;\n  }\n  body {\n    @apply bg-background text-foreground;\n  }\n}"
    } >"$temp_file"

    mv "$temp_file" "$CSS_FILE" || error "Failed to update CSS file"
    log "Theme applied successfully (backup saved as $backup_file)"
}

# Import sample data
import_sample_data() {
    show_progress "Importing sample data..."
    if confirm "Import sample data into Convex?"; then
        debug_log "User chose to import sample data"
        log "Importing sample data..."
        {
            echo '{"text": "Buy groceries", "isCompleted": true}'
            echo '{"text": "Go for a swim", "isCompleted": true}'
            echo '{"text": "Integrate Convex", "isCompleted": false}'
        } >sampleData.jsonl

        debug_log "Importing data to Convex"
        bun x convex import --table tasks sampleData.jsonl || error "Failed to import sample data"
        rm -f sampleData.jsonl
        log "Sample data imported successfully"
    else
        debug_log "User skipped sample data import"
        log "Skipping sample data import"
    fi
}

# Start development server
start_dev_server() {
    show_progress "Starting development server..."
    if confirm "Open development server in browser?"; then
        debug_log "Starting server with browser"
        log "Starting development server with browser..."
        bun dev --open
    else
        debug_log "Starting server without browser"
        log "Starting development server..."
        bun dev
    fi
}

# Main execution
main() {
    # Enable debug mode if set
    [[ "$DEBUG" = true ]] && set -x

    # Ask for cleanup confirmation before any other operations
    if confirm "Would you like to clean up previous setup files and dependencies?"; then
        cleanup
    fi

    debug_log "Starting setup script"
    check_prerequisites
    setup_environment
    install_dependencies
    start_convex_server
    wait_for_env_local
    setup_openai
    setup_shadcn_theme
    import_sample_data
    start_dev_server
    log "Setup complete! You can now continue development."
}

# Execute main function
main
