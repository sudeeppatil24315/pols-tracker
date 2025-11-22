#!/bin/bash

# Los Pollos Tracker - Mapbox Setup Script

echo "🐔 Los Pollos Tracker - Mapbox Setup"
echo "===================================="
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "❌ .env file not found!"
    echo "Creating .env file..."
    cp .env.example .env 2>/dev/null || touch .env
fi

echo "📝 Please follow these steps:"
echo ""
echo "1. Go to: https://account.mapbox.com/auth/signup/"
echo "2. Sign up for a free account"
echo "3. Go to: https://account.mapbox.com/access-tokens/"
echo "4. Copy your 'Default public token'"
echo ""
echo "5. Paste your token below:"
echo ""

read -p "Enter your Mapbox token (starts with pk.): " token

if [[ $token == pk.* ]]; then
    # Update .env file
    if grep -q "VITE_MAPBOX_TOKEN" .env; then
        # Replace existing token
        sed -i.bak "s|VITE_MAPBOX_TOKEN=.*|VITE_MAPBOX_TOKEN=$token|" .env
        rm .env.bak 2>/dev/null
    else
        # Add new token
        echo "" >> .env
        echo "# Mapbox Configuration" >> .env
        echo "VITE_MAPBOX_TOKEN=$token" >> .env
    fi
    
    echo ""
    echo "✅ Mapbox token saved to .env file!"
    echo ""
    echo "🚀 Next steps:"
    echo "1. Restart your development server (Ctrl+C, then npm run dev)"
    echo "2. Open http://localhost:5174"
    echo "3. Login and create a new delivery task"
    echo "4. Watch vehicles follow roads with real-time traffic!"
    echo ""
    echo "📚 For more info, see MAPBOX_SETUP.md"
else
    echo ""
    echo "❌ Invalid token format!"
    echo "Token should start with 'pk.'"
    echo "Please try again."
    exit 1
fi
