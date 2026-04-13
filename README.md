# NIKITO Proxy — Déploiement Render.com

## Déploiement en 5 minutes

### 1. Créer un compte GitHub
Va sur github.com et crée un compte si tu n'en as pas.

### 2. Créer un nouveau repo
- Clique "New repository"
- Nom : `nikito-proxy`
- Public
- Clique "Create repository"

### 3. Uploader les fichiers
- Clique "uploading an existing file"
- Glisse server.js et package.json
- Clique "Commit changes"

### 4. Déployer sur Render.com
- Va sur render.com → "New" → "Web Service"
- Connecte ton GitHub
- Sélectionne le repo `nikito-proxy`
- Settings :
  - Name: nikito-proxy
  - Runtime: Node
  - Build Command: npm install
  - Start Command: npm start
- Environment Variables :
  - PROXY_SECRET = nikito2026
- Clique "Create Web Service"

### 5. URL de ton proxy
Render te donnera une URL comme :
https://nikito-proxy.onrender.com

## Utilisation dans Power Automate

### Token Roller (remplace les appels Token_*)
POST https://nikito-proxy.onrender.com/roller/token
Headers: x-proxy-secret: nikito2026
Body: client_id=XXX&client_secret=YYY

### Revenues Roller (remplace les appels Revenue_*)
GET https://nikito-proxy.onrender.com/roller/revenues?startDate=2026-04-12&endDate=2026-04-12
Headers: 
  x-proxy-secret: nikito2026
  x-roller-token: [access_token du step Token]
