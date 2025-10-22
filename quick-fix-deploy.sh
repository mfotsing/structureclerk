#!/bin/bash

# 🚀 StructureClerk - Quick Fix Deploy Script
# Fix for build error: Replace <a> with <Link> in quotes/new/page.tsx

echo "🔧 StructureClerk - Quick Fix Deploy"
echo "=================================="
echo "Fix: Replace <a> with <Link> in quotes/new/page.tsx"
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Add all files
print_info "Adding all files to Git..."
git add .
if [ $? -ne 0 ]; then
    print_error "Failed to add files to Git"
    exit 1
fi
print_status "All files added to Git"

# Create commit
print_info "Creating commit..."
git commit -m "🔧 Quick Fix: Replace <a> with <Link> in quotes/new/page.tsx

Fixes build error:
- Replace <a href=\"/clients/new\"> with <Link href=\"/clients/new\">
- Add Link import to quotes/new/page.tsx

Ready for Vercel deployment! 🚀"
if [ $? -ne 0 ]; then
    print_error "Failed to create commit"
    exit 1
fi
print_status "Commit created successfully"

# Push to GitHub
print_info "Pushing to GitHub main branch..."
git push origin main
if [ $? -ne 0 ]; then
    print_error "Failed to push to GitHub"
    exit 1
fi

print_status "✅ Successfully pushed to GitHub!"
echo ""
echo "🚀 Vercel will automatically deploy the fix!"
echo "📊 Check your Vercel dashboard for deployment status"
echo ""
print_status "StructureClerk fix deployed successfully! 🎯"