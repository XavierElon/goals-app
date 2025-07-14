#!/bin/bash

# Goals App Server Startup Script
# Usage: ./start-server.sh [PORT]

PORT=${1:-10820}
HOST="0.0.0.0"

echo "Starting Goals App on port $PORT..."

# Check if we're in production or development mode
if [ "$NODE_ENV" = "production" ]; then
    echo "Starting in PRODUCTION mode..."
    npm run build
    PORT=$PORT HOST=$HOST npm start
else
    echo "Starting in DEVELOPMENT mode..."
    PORT=$PORT HOST=$HOST npm run dev
fi 