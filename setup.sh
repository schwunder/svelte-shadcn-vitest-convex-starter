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
SHOW_DBG=${SHOW_DBG:-false}

# Script constants
if [ -n "$BASH_VERSION" ]; then
    readonly DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
else
    readonly DIR="$(cd "$(dirname "$0")" && pwd)"
fi
readonly LOG="setup.log"
readonly CSS="src/app.css"
readonly THEME_URL="https://next.shadcn-svelte.com/themes"
readonly MOCK_KEY="sk-mock-12345-your-test-key"

# Colors
readonly RED='\033[0;31m'
readonly GREEN='\033[0;32m'
readonly YELLOW='\033[1;33m'
readonly BLUE='\033[0;34m'
readonly NC='\033[0m'

# Logging
log() { echo -e "${GREEN}[INFO]${NC} $*" | tee -a "$LOG"; }
warn() { echo -e "${YELLOW}[WARN]${NC} ⚠️ $*" | tee -a "$LOG"; }
err() {
    echo -e "${RED}[ERROR]${NC} ❌ $*" >&2 | tee -a "$LOG"
    exit 1
}
dbg() {
    if [ "$DEBUG" = true ]; then
        echo -e "${BLUE}[DEBUG]${NC} $*" >>"$LOG"
        if [ "$SHOW_DBG" = true ]; then
            echo -e "${BLUE}•${NC} $*"
        fi
    fi
}

# Progress
prog() { log "$1"; }

# User confirmation
ask() {
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

# Box display
box() {
    local txt="$1"
    local width=80
    local border=$(printf '%*s' "$width" | tr ' ' '-')
    echo
    echo "$border"
    echo "$txt" | fold -w $((width - 4)) | sed 's/^/  /'
    echo "$border"
    echo
}

# Debug setup
setup_dbg() {
    prog "🔧 Setting up debug mode..."
    if ask "Enable debug mode?"; then
        DEBUG=true
        : >"$LOG"
        if ask "Show debug output in terminal?"; then
            SHOW_DBG=true
        else
            SHOW_DBG=false
        fi
        dbg "Environment setup complete"
        log "📝 Script log saved to $LOG"
    fi
}

# Cleanup
clean() {
    prog "🧹 Checking for cleanup..."
    if ask "Clean up previous files and deps?"; then
        dbg "Starting cleanup"
        local files=(".env" ".env.local" "setup.log" "package-lock.json" "bun.lockb" "yarn.lock" "sampleData.jsonl")
        local dirs=(".convex" "node_modules" "dist" "build")
        for file in "${files[@]}"; do
            dbg "Removing: $file"
            rm -f "$file" 2>/dev/null || true
        done
        for dir in "${dirs[@]}"; do
            dbg "Removing: $dir"
            rm -rf "$dir" 2>/dev/null || true
        done
        log "✨ Cleanup complete"
    fi
}

# Check prereqs
check() {
    prog "🔍 Checking prerequisites..."
    dbg "Checking commands"
    local cmds=("bun" "awk" "pbpaste")
    for cmd in "${cmds[@]}"; do
        dbg "Checking: $cmd"
        if ! command -v "$cmd" >/dev/null 2>&1; then
            err "$cmd is required but not installed"
        fi
    done

    if [ ! -f "package.json" ]; then
        err "Run from project root with package.json"
    fi

    dbg "Checking .env"
    if [ ! -f ".env" ]; then
        dbg "Creating .env"
        touch .env
        log "📄 Created .env file"
    fi
}

# Install deps
deps() {
    prog "📦 Installing dependencies..."
    if ask "Run 'bun install'?"; then
        dbg "Running bun install"
        bun install || err "Failed to install dependencies"
    fi
}

# Setup OpenAI
setup_ai() {
    prog "🤖 Setting up OpenAI..."
    if grep -q "OPENAI_API_KEY" .env; then
        dbg "API key exists"
        return
    fi

    dbg "No API key found"
    log "🔑 OpenAI API key required (use your own or mock key)"
    read -rp "Enter OpenAI API key (Enter for mock): " key
    key=${key:-$MOCK_KEY}
    echo "OPENAI_API_KEY=$key" >>.env
    log "🔐 API key added to .env"
}

# Check theme
check_theme() {
    local content="$1"
    if [[ ! "$content" =~ "@layer base {" ]] ||
        [[ ! "$content" =~ ":root {" ]] ||
        [[ ! "$content" =~ ".dark {" ]] ||
        [[ ! "$content" =~ "--background:" ]] ||
        [[ ! "$content" =~ "--foreground:" ]] ||
        [[ ! "$content" =~ "--radius:" ]]; then
        log "❌ Invalid theme content"
        log "💡 Need @layer base, :root, .dark sections with CSS vars"
        return 1
    fi
    return 0
}

# Setup theme
theme() {
    prog "🎨 Setting up theme..."
    if [ ! -f "$CSS" ]; then
        err "$CSS not found"
    fi

    if ask "Open theme page in browser?"; then
        dbg "Opening theme page"
        open "$THEME_URL" 2>/dev/null || log "🌐 Visit: $THEME_URL"
    else
        log "🌐 Visit: $THEME_URL when ready"
    fi

    if ask "Skip theme customization?"; then
        log "🎯 Keeping default theme"
        return
    fi

    log "✂️ Copy the @layer base theme content"
    read -rp "Press Enter when ready..."

    log "🔍 Checking clipboard..."
    local theme
    theme=$(pbpaste)
    dbg "Validating theme"

    if ! check_theme "$theme"; then
        return
    fi

    box "$theme"
    if ! ask "Use this theme?"; then
        log "🚫 Theme cancelled"
        return
    fi

    local bak="${CSS}.bak"
    local tmp="${CSS}.tmp"
    dbg "Backup: $bak"
    dbg "Temp: $tmp"
    trap 'rm -f "$tmp"' EXIT

    dbg "Creating backup"
    cp "$CSS" "$bak" || err "Backup failed"

    dbg "Applying theme"
    {
        echo -e "@tailwind base;\n@tailwind components;\n@tailwind utilities;\n"
        echo "$theme"
        echo -e "\n@layer base {\n  * {\n    @apply border-border;\n  }\n  body {\n    @apply bg-background text-foreground;\n  }\n}"
    } >"$tmp"

    mv "$tmp" "$CSS" || err "Theme update failed"
    log "✨ Theme applied (backup: $bak)"
}

# Start Convex
convex() {
    local cmd="cd '$PWD' && bun x convex dev"
    prog "🚀 Starting Convex..."

    dbg "Command: $cmd"
    log "💻 Convex needs a separate terminal window"
    log "✨ Server starts immediately if Convex is setup"
    log "🔄 CLI guides through setup if needed"
    log "⚠️ Keep window open during development"

    if ! ask "Open Convex in new terminal?"; then
        log "💡 Run 'bun x convex dev' manually when ready"
        return
    fi

    if grep -q "PUBLIC_CONVEX_URL=" .env; then
        dbg "URL exists"
        return
    fi

    case "${TERM_PROGRAM:-}" in
    "vscode")
        dbg "VS Code detected"
        log "🖥️ Opening Terminal..."
        osascript -e "tell application \"Terminal\" to do script \"$cmd\""
        ;;
    "Apple_Terminal")
        dbg "Terminal detected"
        log "🖥️ Opening new tab..."
        osascript -e "tell application \"Terminal\" to do script \"$cmd\" in front window"
        ;;
    "iTerm.app")
        dbg "iTerm2 detected"
        log "🖥️ Opening new tab..."
        osascript <<EOF
tell application "iTerm"
    tell current window
        create tab with default profile
        tell current session of current tab to write text "$cmd"
    end tell
end tell
EOF
        ;;
    *)
        dbg "Unknown terminal"
        log "🖥️ Opening Terminal..."
        osascript -e "tell application \"Terminal\" to do script \"$cmd\""
        ;;
    esac

    log "✅ Convex server started"
    log "⚠️ Keep new window open"
    log "📝 Next steps:"
    log "1️⃣ Create/select Convex project"
    log "2️⃣ Wait for 'functions ready'"
    log "3️⃣ Keep window open"
}

# Wait for env
wait_env() {
    log "⏳ Waiting for .env.local..."
    local timeout=300
    local start=$(date +%s)
    dbg "Timeout: $timeout seconds"

    while [ ! -f ".env.local" ]; do
        if [ $(($(date +%s) - start)) -gt $timeout ]; then
            err "Timeout waiting for .env.local"
        fi
        sleep 2
    done

    log "✅ .env.local detected"
}

# Import data
import() {
    prog "📥 Importing sample data..."
    if ask "Import sample data?"; then
        dbg "Creating data"
        log "📝 Creating samples..."
        {
            echo '{"text": "Buy groceries", "isCompleted": true}'
            echo '{"text": "Go for a swim", "isCompleted": true}'
            echo '{"text": "Integrate Convex", "isCompleted": false}'
        } >sampleData.jsonl

        dbg "Importing to Convex"
        bun x convex import --table tasks sampleData.jsonl || err "Import failed"
        rm -f sampleData.jsonl
        log "✅ Data imported"
    else
        dbg "Skipped import"
        log "⏭️ Skipping import"
    fi
}

# Start dev server
dev() {
    prog "🔥 Starting dev server..."
    if ask "Start server now?"; then
        if ask "Open in browser?"; then
            dbg "Starting with browser"
            log "🌐 Starting with browser..."
            bun dev --open
        else
            dbg "Starting headless"
            log "💻 Starting server..."
            bun dev
        fi
    else
        log "💡 Run 'bun dev' later"
    fi
    log "🎉 Setup complete!"
}

# Main
main() {
    setup_dbg
    check
    clean
    deps
    setup_ai
    theme
    convex
    wait_env
    import
    dev
    log "🙏 Thanks for using setup! Happy coding! 🚀"
}

main
