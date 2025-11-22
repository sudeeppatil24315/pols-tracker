# Los Pollos Tracker - Backend Setup

## Prerequisites

1. **Node.js** (v18 or higher)
2. **MongoDB** (v6 or higher)

## MongoDB Installation

### Option 1: Local MongoDB (Recommended for Development)

#### macOS (using Homebrew):
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

#### Ubuntu/Debian:
```bash
sudo apt-get install -y mongodb
sudo systemctl start mongodb
sudo systemctl enable mongodb
```

#### Windows:
Download and install from: https://www.mongodb.com/try/download/community

### Option 2: MongoDB Atlas (Cloud)

1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account
3. Create a new cluster
4. Get your connection string
5. Update `.env` file with your connection string:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/los-pollos-tracker
   ```

## Running the Application

### Terminal 1 - Start Backend Server:
```bash
npm run server
```
Server will run on http://localhost:5001

### Terminal 2 - Start Frontend:
```bash
npm run dev
```
Frontend will run on http://localhost:5173

## API Endpoints

### Drivers
- `GET /api/drivers` - Get all drivers
- `GET /api/drivers/available` - Get available drivers
- `POST /api/drivers` - Register new driver
- `PATCH /api/drivers/:id/status` - Update driver status
- `DELETE /api/drivers/:id` - Delete driver

### Health Check
- `GET /api/health` - Check if API is running

## Environment Variables

Create a `.env` file in the root directory:

```env
MONGODB_URI=mongodb://localhost:27017/los-pollos-tracker
PORT=5001
```

> **Note**: We use port 5001 instead of 5000 because macOS AirPlay Receiver uses port 5000 by default.

## Features

1. **Driver Registration**: Admin can register new drivers with name, email, phone, and license number
2. **Driver Management**: Drivers are stored in MongoDB and can be selected when creating tasks
3. **Status Tracking**: Driver status automatically updates to "on-duty" when assigned to a task
4. **Available Drivers**: Only available drivers appear in the task creation dropdown

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running: `brew services list` (macOS) or `sudo systemctl status mongodb` (Linux)
- Check if port 27017 is available
- Verify connection string in `.env` file

### Port Already in Use
- Change PORT in `.env` file
- Kill process using the port: `lsof -ti:5001 | xargs kill -9`
- On macOS, disable AirPlay Receiver in System Settings > General > AirDrop & Handoff if you want to use port 5000

### CORS Issues
- Backend is configured to allow all origins in development
- For production, update CORS settings in `server/index.ts`
