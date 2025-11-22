#!/bin/bash

# Los Pollos Tracker - Development Startup Script

echo "🐔 Starting Los Pollos Tracker..."
echo ""

# Check if MongoDB is running
if ! pgrep -x "mongod" > /dev/null; then
    echo "⚠️  MongoDB is not running!"
    echo "Starting MongoDB..."
    brew services start mongodb-community 2>/dev/null || sudo systemctl start mongodb 2>/dev/null
    sleep 2
fi

echo "✅ MongoDB is running"
echo ""

# Start backend server in background
echo "🚀 Starting backend server on port 5000..."
npm run server &
BACKEND_PID=$!

# Wait for backend to start
sleep 3

# Start frontend
echo "🎨 Starting frontend on port 5173..."
npm run dev

# Cleanup on exit
trap "kill $BACKEND_PID 2>/dev/null" EXIT
