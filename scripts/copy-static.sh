#!/bin/bash
set -euo pipefail

# Clean and recreate the target directory
rm -rf out/tools/digit-in-noise-test
mkdir -p out/tools/digit-in-noise-test
rm -rf out/tools/single-digit-in-noise-test
mkdir -p out/tools/single-digit-in-noise-test

# Copy files from public directory
echo "Copying files from public directory..."
cp -R public/tools/digit-in-noise-test/*.html \
  public/tools/digit-in-noise-test/*.js \
  public/tools/digit-in-noise-test/css \
  public/tools/digit-in-noise-test/js \
  public/tools/digit-in-noise-test/audio \
  out/tools/digit-in-noise-test/
cp -R public/tools/single-digit-in-noise-test/. out/tools/single-digit-in-noise-test/

# Ensure correct permissions
chmod -R 755 out/tools/digit-in-noise-test
chmod -R 755 out/tools/single-digit-in-noise-test

# Create a .nojekyll file to ensure proper static file serving
touch out/tools/digit-in-noise-test/.nojekyll
touch out/tools/single-digit-in-noise-test/.nojekyll

# Report status
echo "Static files copied successfully to out/tools/digit-in-noise-test/"
ls -la out/tools/digit-in-noise-test/
echo "Static files copied successfully to out/tools/single-digit-in-noise-test/"
ls -la out/tools/single-digit-in-noise-test/
