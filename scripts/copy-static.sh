#!/bin/bash

# Clean and recreate the target directory
rm -rf out/tools/digit-in-noise-test
mkdir -p out/tools/digit-in-noise-test

# Copy files from public directory
echo "Copying files from public directory..."
cp -r public/tools/digit-in-noise-test/{*.html,*.js,css,js,audio} out/tools/digit-in-noise-test/ 2>/dev/null || true

# Ensure correct permissions
chmod -R 755 out/tools/digit-in-noise-test

# Create a .nojekyll file to ensure proper static file serving
touch out/tools/digit-in-noise-test/.nojekyll

# Report status
echo "Static files copied successfully to out/tools/digit-in-noise-test/"
ls -la out/tools/digit-in-noise-test/