#!/usr/bin/env bash
set -e

# Ensure compatibility with zsh
if [ -n "$ZSH_VERSION" ]; then
    setopt SH_WORD_SPLIT
fi

# Step 0: Check file permissions for src/app.css
if [ ! -w src/app.css ]; then
    echo "The script does not have write permissions for src/app.css."
    echo "Please grant write permissions or run this script with sudo."
    exit 1
fi

# Step 1: Install Dependencies
echo "Installing dependencies with Bun..."
if ! bun install; then
    echo "Failed to install dependencies. Ensure Bun is installed and try again."
    exit 1
fi

# Step 2: Start Convex and log in
echo
echo "Starting Convex development environment..."
echo "If prompted, log in to Convex. Once logged in and the server is running, press Ctrl+C to stop it."
echo "Press Enter to continue once you're ready..."
read -r
if ! bun x convex dev; then
    echo "Failed to start Convex. Ensure the Convex CLI is installed and try again."
    exit 1
fi

echo "Convex environment stopped as expected. Proceeding with setup..."

# Step 3: Move PUBLIC_CONVEX_URL from .env.local to .env
if [ -f .env.local ]; then
    if grep -q "^PUBLIC_CONVEX_URL=" .env.local; then
        echo "Extracting PUBLIC_CONVEX_URL from .env.local to .env..."
        grep "^PUBLIC_CONVEX_URL=" .env.local >>.env
    else
        echo "No PUBLIC_CONVEX_URL found in .env.local. Ensure Convex was set up properly."
        exit 1
    fi
else
    echo ".env.local not found. Ensure Convex has been initialized and try again."
    exit 1
fi

# Step 4: Restart Convex in the background to import sample data
echo "Restarting Convex in the background to import sample data..."
bun x convex dev &
CONVEX_PID=$!
sleep 5

# Step 5: Import Sample Data
if [ ! -f sampleData.jsonl ]; then
    echo "Creating sample data for tasks..."
    cat >sampleData.jsonl <<EOL
{"text": "Buy groceries", "isCompleted": true}
{"text": "Go for a swim", "isCompleted": true}
{"text": "Integrate Convex", "isCompleted": false}
EOL

    echo "Importing sample data into Convex..."
    if ! bun x convex import --table tasks sampleData.jsonl; then
        echo "Failed to import sample data. Ensure Convex is running properly."
        kill $CONVEX_PID
        exit 1
    fi
fi

# Step 6: Theming Setup
echo
echo "Now, please open the ShadCN theming page and copy the @layer base { ... } code snippet."
THEMING_URL="https://ui.shadcn-svelte.com/docs/theming"
if command -v open &>/dev/null; then
    echo "Opening the theming page in your default browser..."
    open "$THEMING_URL"
else
    echo "Please open this link manually: $THEMING_URL"
fi

echo "After copying the theming snippet, close the browser if you'd like, then press Enter here."
read -p "Press Enter once you've copied the theming code to your clipboard..."

# Validate clipboard content
if command -v pbpaste &>/dev/null; then
    pbpaste >theming.css
else
    echo "Clipboard access is not supported on this system. Please paste the theming code into theming.css manually."
    touch theming.css
fi

if [ ! -s theming.css ]; then
    echo "No theming code found in the clipboard."
    echo "Ensure you have copied the theming code correctly and try again."
    rm -f theming.css
    kill $CONVEX_PID
    exit 1
fi

echo "Replacing @layer base block in src/app.css with the copied theming code..."
if ! sed -i.bak '/@layer base {/,/}/d' src/app.css; then
    echo "Failed to remove existing @layer base section from src/app.css."
    rm -f theming.css
    kill $CONVEX_PID
    exit 1
fi

cat theming.css >>src/app.css
rm -f theming.css
rm -f src/app.css.bak

echo "The theming code has been successfully inserted into src/app.css."

# Step 7: Start Development Server
echo "Starting development server..."
if ! bun dev --open; then
    echo "Failed to start the development server. Ensure Bun is installed and try again."
    kill $CONVEX_PID
    exit 1
fi

# Cleanup: Stop Convex process if still running
trap "kill $CONVEX_PID" EXIT
