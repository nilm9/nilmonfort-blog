#!/bin/bash

# Material for MkDocs Blog Boilerplate Setup Script
# This script sets up the development environment and initializes the blog

echo "🚀 Setting up Material for MkDocs Blog Boilerplate..."

# Check if Python 3.10+ is available
python_version=$(python3 --version 2>&1 | cut -d' ' -f2 | cut -d'.' -f1,2)
required_version="3.10"

if [ "$(printf '%s\n' "$required_version" "$python_version" | sort -V | head -n1)" != "$required_version" ]; then
    echo "❌ Python 3.10+ is required. Current version: $python_version"
    exit 1
fi

echo "✅ Python version check passed: $python_version"

# Create virtual environment
echo "📦 Creating virtual environment..."
python3 -m venv .venv

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source .venv/bin/activate

# Install dependencies
echo "📚 Installing dependencies..."
pip install -r requirements.txt

# Initialize git if not already initialized
if [ ! -d ".git" ]; then
    echo "🔧 Initializing git repository..."
    git init
    git branch -M main
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Activate the virtual environment: source .venv/bin/activate"
echo "2. Start the development server: mkdocs serve"
echo "3. Visit http://127.0.0.1:8000 to see your blog"
echo "4. Customize mkdocs.yml with your site details"
echo "5. Replace docs/assets/images/logo.png with your logo"
echo "6. Update authors.yml with your information"
echo ""
echo "Happy blogging! 🎊"
