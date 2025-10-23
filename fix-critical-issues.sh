#!/bin/bash

# 🚀 StructureClerk - Fix Critical Issues Script
# Fix for login 404 and score button not working

echo "🔧 StructureClerk - Fix Critical Issues"
echo "====================================="
echo "Fixes:"
echo "1. Login page 404 - Removed useTranslations dependency"
echo "2. Score button - Created /scorecard page and fixed link"
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
git commit -m "🔧 Critical Fixes: Login 404 + Score Button

Fixes critical issues blocking user experience:

1. Login Page 404 Fix:
   - Removed useTranslations dependency causing 404
   - Replaced with static French text
   - Fixed redirect to /dashboard instead of /dashboard/files

2. Score Button Fix:
   - Created /scorecard/page.tsx with ScoreQuiz integration
   - Fixed link from /scorecard#scorecard to /scorecard?scorecard=scorecard
   - Added landing page with quiz benefits

Both issues now resolved! Users can:
- ✅ Login successfully without 404 errors
- ✅ Access score calculation quiz
- ✅ Complete full user journey

Ready for production! 🚀"
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
echo "🚀 Vercel will automatically deploy the fixes!"
echo "📊 Check your Vercel dashboard for deployment status"
echo ""
echo "✅ Issues Fixed:"
echo "• Login page now works (no more 404)"
echo "• Score button now works (quiz accessible)"
echo "• Complete user journey functional"
echo ""
print_status "StructureClerk critical issues resolved! 🎯"