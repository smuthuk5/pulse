# Pulse Service Masters — Static site

## Quick start (local)
1. Place files in a folder and open `index.html` in browser to preview.
2. To run a local server:
   - Python 3: `python3 -m http.server 8000` and visit `http://localhost:8000`.

## Deploy to GitHub Pages
1. Create a new GitHub repo (e.g. `pulse-service-masters`).
2. Commit and push all files to `main` branch.
3. In GitHub repo => Settings => Pages:
   - Source: `main` branch, folder: `/ (root)`.
   - Save. GitHub will publish at `https://<your-github-username>.github.io/pulse-service-masters/`.
4. (Optional) Add a custom domain in Pages settings and update DNS.

### Git commands (example)
```bash
git init
git add .
git commit -m "Initial Pulse Service Masters site"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/pulse-service-masters.git
git push -u origin main
