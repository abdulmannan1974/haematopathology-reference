#!/bin/bash

# Haematopathology Reference - GitHub Setup Script
# Run this script to push your project to GitHub

echo "============================================"
echo "Haematopathology Reference - GitHub Setup"
echo "============================================"
echo ""

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "Initializing git repository..."
    git init
    git branch -m main
fi

# Configure git if needed
if [ -z "$(git config user.email)" ]; then
    echo ""
    echo "Git user not configured. Please enter your details:"
    read -p "Your email: " email
    read -p "Your name: " name
    git config user.email "$email"
    git config user.name "$name"
fi

# Add all files
echo ""
echo "Adding files to git..."
git add -A

# Commit
echo ""
echo "Creating initial commit..."
git commit -m "Initial commit: Haematopathology Reference App

Features:
- Comprehensive database of 60+ haematological entities
- Categories: AML, MDS, MPN, B-cell, T-cell, Other
- Search, Favorites, Compare mode
- Export options: JSON, Text, PDF, Clipboard
- Mobile-responsive design
- Based on AMP Guidelines (Revised July 2025)

Created by Dr Abdul Mannan (Blood Doctor)"

echo ""
echo "============================================"
echo "NEXT STEPS:"
echo "============================================"
echo ""
echo "1. Create a new repository on GitHub:"
echo "   https://github.com/new"
echo ""
echo "   Repository name: haematopathology-reference"
echo "   Description: Interactive Molecular & Cytogenetic Guide for haematological malignancies"
echo "   Visibility: Public (or Private)"
echo "   DO NOT initialize with README, .gitignore, or license"
echo ""
echo "2. Then run these commands:"
echo ""
echo "   git remote add origin https://github.com/YOUR_USERNAME/haematopathology-reference.git"
echo "   git push -u origin main"
echo ""
echo "3. (Optional) To deploy to GitHub Pages:"
echo "   - Go to repository Settings > Pages"
echo "   - Select 'GitHub Actions' as source"
echo "   - Or use Vercel/Netlify for instant deployment"
echo ""
echo "============================================"
