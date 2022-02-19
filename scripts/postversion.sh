#!/bin/sh

# Exit on any non-zero return codes
set -e

# Get top-level package version (without quotes)
npm_package_version=$(npm pkg get version | sed s/\"//g)

# Re-version all workspace packages
npm --workspaces version $npm_package_version

# Update the global lock file
npm i

# Commit all updates to version control
git add -A
git commit -m "Release v$npm_package_version"
git push

git tag -a "v$npm_package_version" HEAD -m \"$(git log $(git describe --tags --abbrev=0)..HEAD --pretty=format:'%h %s')\"
git push origin v$npm_package_version
