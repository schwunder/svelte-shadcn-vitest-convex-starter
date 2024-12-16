#!/usr/bin/env bash

# Enable strict mode (zsh compatible)
if [ -n "$BASH_VERSION" ]; then
    set -euo pipefail
    IFS=$'\n\t'
elif [ -n "$ZSH_VERSION" ]; then
    set -e
    setopt PIPE_FAIL
    setopt KSH_ARRAYS
    setopt SH_WORD_SPLIT
fi

# Debug mode (enable with DEBUG=true bash setup.sh)
DEBUG=${DEBUG:-false}
SHOW_DEBUG_TERMINAL=${SHOW_DEBUG_TERMINAL:-false}

# Script constants
if [ -n "$BASH_VERSION" ]; then
    readonly SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
else
    readonly SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
fi
readonly LOG_FILE="setup.log"
readonly CSS_FILE="src/app.css"
readonly THEME_URL="https://next.shadcn-svelte.com/themes"
readonly MOCK_OPENAI_KEY="sk-mock-12345-your-test-key"

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
debug_log() {
    if [ "$DEBUG" = true ]; then
        # Full verbose logging to file
        echo -e "${BLUE}[DEBUG]${NC} $*" >>"$LOG_FILE"
        # Simplified output to terminal if needed
        if [ "$SHOW_DEBUG_TERMINAL" = true ]; then
            echo -e "${BLUE}•${NC} $*"
        fi
    fi
}

# Progress tracking function
show_progress() {
    log "$1"
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

# Function to display content in a simple box
display_content() {
    local content="$1"
    local width=80
    local border=$(printf '%*s' "$width" | tr ' ' '-')

    echo
    echo "$border"
    echo "$content" | fold -w $((width - 4)) | sed 's/^/  /'
    echo "$border"
    echo
}

# Debug setup function
# Debug setup function
setup_debug_mode() {
    show_progress "Setting up debug mode..."
    if confirm "Enable debug mode?"; then
        DEBUG=true

        # Create/clear the log file
        : >"$LOG_FILE"

        if confirm "Show debug output in terminal? (Less verbose than log file)"; then
            SHOW_DEBUG_TERMINAL=true
        else
            SHOW_DEBUG_TERMINAL=false
        fi

        debug_log "Environment setup complete"
        log "Script log saved to $LOG_FILE"
    fi
}

# Cleanup function with error recovery
cleanup() {
    show_progress "Checking for cleanup..."
    if confirm "Would you like to clean up previous setup files and dependencies?"; then
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
    fi
}

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

    # Create .env if it doesn't exist
    debug_log "Checking .env file"
    if [ ! -f ".env" ]; then
        debug_log "Creating .env file"
        touch .env
        log "Created new .env file"
    fi
}

# Install dependencies
install_dependencies() {
    show_progress "Installing dependencies..."
    if confirm "Run 'bun install'?"; then
        debug_log "Running bun install"
        bun install || error "Failed to install dependencies"
    fi
}

# Setup OpenAI environment with options
setup_openai() {
    show_progress "Setting up OpenAI..."
    if grep -q "OPENAI_API_KEY" .env; then
        debug_log "OpenAI API key already exists in .env"
        return
    fi

    debug_log "No OpenAI API key found in .env"
    log "OpenAI API key is required. You can provide your own or use a mock key for testing."
    read -rp "Enter your OpenAI API key (or press Enter to use mock key): " api_key
    api_key=${api_key:-$MOCK_OPENAI_KEY}
    echo "OPENAI_API_KEY=$api_key" >>.env
    log "OpenAI API key added to .env file"
}

# Validate ShadCN theme content
validate_theme_content() {
    local theme_content="$1"
    if [[ ! "$theme_content" =~ "@layer base {" ]] ||
        [[ ! "$theme_content" =~ ":root {" ]] ||
        [[ ! "$theme_content" =~ ".dark {" ]] ||
        [[ ! "$theme_content" =~ "--background:" ]] ||
        [[ ! "$theme_content" =~ "--foreground:" ]] ||
        [[ ! "$theme_content" =~ "--radius:" ]]; then
        log "No valid theme content in clipboard, proceeding without copying"
        log "Theme should contain @layer base, :root and .dark sections with CSS variables"
        return 1
    fi
    return 0
}

# Setup ShadCN theme
setup_shadcn_theme() {
    show_progress "Setting up ShadCN theme..."

    if [ ! -f "$CSS_FILE" ]; then
        error "$CSS_FILE not found"
    fi

    if confirm "Open ShadCN theme page in browser?"; then
        debug_log "Opening theme page in browser"
        open "$THEME_URL" 2>/dev/null || log "Please visit: $THEME_URL"
    else
        log "Please visit: $THEME_URL when ready"
    fi

    if confirm "Skip theme customization? (Default styling will remain unchanged)"; then
        log "Keeping default theme styling"
        return
    fi

    log "Please copy the desired @layer base theme content."
    read -rp "Press Enter when ready..."

    log "Validating clipboard content..."
    local theme_content
    theme_content=$(pbpaste)
    debug_log "Validating theme content"

    if ! validate_theme_content "$theme_content"; then
        return
    fi

    display_content "$theme_content"
    if ! confirm "Proceed with this theme?"; then
        log "Theme application cancelled"
        return
    fi

    # Only create temp files and set trap if we're actually going to modify the theme
    local backup_file="${CSS_FILE}.bak"
    local temp_file="${CSS_FILE}.tmp"
    debug_log "Backup file: $backup_file"
    debug_log "Temp file: $temp_file"
    trap 'rm -f "$temp_file"' EXIT

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

# Start Convex development server
start_convex_server() {
    local terminal_script="cd '$PWD' && bun x convex dev"
    show_progress "Starting Convex server..."

    debug_log "Terminal script: $terminal_script"
    log "The Convex development server needs to run in a separate terminal window."
    log "If Convex is already set up, the development server will start immediately."
    log "If not, the CLI will guide you through a quick setup and login process first."
    log "This window must remain open for the duration of your development session."

    if ! confirm "Ready to open Convex server in a new terminal window?"; then
        log "You can manually run 'bun x convex dev' in a new terminal when ready"
        return
    fi

    if grep -q "PUBLIC_CONVEX_URL=" .env; then
        debug_log "Convex URL already exists in .env"
        return
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
    if confirm "Start development server now?"; then
        if confirm "Open in browser?"; then
            debug_log "Starting server with browser"
            log "Starting development server with browser..."
            bun dev --open
        else
            debug_log "Starting server without browser"
            log "Starting development server..."
            bun dev
        fi
    else
        log "You can start the server later with 'bun dev'"
    fi
    log "Setup complete! You can now continue development."
}

# Main execution
main() {
    setup_debug_mode
    check_prerequisites
    cleanup
    install_dependencies
    setup_openai
    setup_shadcn_theme
    start_convex_server
    wait_for_env_local
    import_sample_data
    start_dev_server
    log "Thank you for using the setup script! Happy coding!"
}

# Execute main function
main
