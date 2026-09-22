#!/usr/bin/env bash
# exit on error
set -o errexit

# Wait for node/npm to be available (Render's Python environments don't always have Node installed by default)
# So we install nvm and node locally for the build
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm install 20
nvm use 20

echo "Installing frontend dependencies..."
cd frontend/frontend-app
npm install

echo "Building frontend..."
npm run build
cd ../..

echo "Installing backend Python dependencies..."
cd backend
pip install --upgrade pip
pip install -r requirements.txt
cd ..

echo "Build complete."
