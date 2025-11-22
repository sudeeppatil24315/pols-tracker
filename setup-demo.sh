#!/bin/bash

echo "🐔 Los Pollos Tracker - Demo Setup"
echo "=================================="
echo ""

# Check if MongoDB is running
echo "📊 Checking MongoDB..."
if mongosh --eval "db.version()" > /dev/null 2>&1; then
    echo "✅ MongoDB is running"
else
    echo "❌ MongoDB is not running"
    echo "   Please start MongoDB first:"
    echo "   - macOS: brew services start mongodb-community"
    echo "   - Linux: sudo systemctl start mongod"
    echo "   - Windows: net start MongoDB"
    exit 1
fi

echo ""
echo "🌱 Seeding database with demo data..."
npm run seed

if [ $? -eq 0 ]; then
    echo ""
    echo "✨ Setup complete!"
    echo ""
    echo "🚀 Next steps:"
    echo "   1. Start the backend:  npm run server:dev"
    echo "   2. Start the frontend: npm run dev"
    echo "   3. Open http://localhost:5173"
    echo "   4. Login as admin@lospollos.com / admin123"
    echo ""
    echo "📍 You should see 12 trucks moving on the map!"
else
    echo ""
    echo "❌ Seed failed. Please check the error above."
    exit 1
fi
