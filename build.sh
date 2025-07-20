#!/usr/bin/env bash

# Telepítse a backend szükséges csomagokat
pip install -r backend/requirements.txt

# Buildelje le a frontendet
cd frontend
npm install
npm run build

# Másolja át a frontend buildet a backendbe (ahonnan majd a FastAPI szolgálja ki)
rm -rf ../backend/static
mkdir -p ../backend/static
cp -r dist/* ../backend/static/
