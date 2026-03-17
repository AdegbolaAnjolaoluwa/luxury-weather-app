# Push to GitHub Instructions

## Step 1: Create Repository on GitHub

1. Go to https://github.com/new
2. Enter repository name: `luxury-weather-app`
3. Add description (optional)
4. Choose Public or Private
5. Click **Create repository**

## Step 2: Add Remote and Push

After creating the repo, run these commands in your terminal:

```bash
# Replace USERNAME with your GitHub username
# Replace REPO_NAME with your repository name

# Add remote
 git remote add origin https://github.com/USERNAME/luxury-weather-app.git

# Push to main branch
 git push -u origin main
```

## Step 3: Verify

Go to `https://github.com/USERNAME/luxury-weather-app` to see your code!

## Alternative: Using GitHub CLI

If you have GitHub CLI installed:

```bash
# Create repo and push in one command
gh repo create luxury-weather-app --public --source=. --push
```
