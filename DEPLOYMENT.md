# Deployment Guide

## Quick Start

### Local Development
```bash
npm install
npm run dev
```
Access at: http://localhost:5173

### Production Build
```bash
npm run build
```
Output: `dist/` folder

## Deployment Options

### 1. GitHub Pages (Recommended)

#### Step 1: Update vite.config.ts
Add base path:
```typescript
export default defineConfig({
  plugins: [react()],
  base: '/your-repo-name/'  // Add this line
})
```

#### Step 2: Build
```bash
npm run build
```

#### Step 3: Deploy
```bash
# Install gh-pages (one time)
npm install -D gh-pages

# Add to package.json scripts:
"deploy": "gh-pages -d dist"

# Deploy
npm run deploy
```

#### Step 4: Configure GitHub
1. Go to repository Settings
2. Navigate to Pages
3. Select `gh-pages` branch
4. Save

Site will be live at: `https://yourusername.github.io/your-repo-name/`

### 2. Netlify

#### Option A: Drag & Drop
1. Go to https://app.netlify.com/drop
2. Drag the `dist/` folder
3. Done! Site is live

#### Option B: GitHub Integration
1. Connect GitHub repository
2. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
3. Deploy

### 3. Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

Or connect via GitHub:
1. Import project on vercel.com
2. Framework preset: Vite
3. Deploy

### 4. AWS S3 + CloudFront

```bash
# Build
npm run build

# Install AWS CLI
aws configure

# Create S3 bucket
aws s3 mb s3://your-bucket-name

# Upload
aws s3 sync dist/ s3://your-bucket-name

# Enable static hosting
aws s3 website s3://your-bucket-name --index-document index.html

# Setup CloudFront (optional, for HTTPS)
```

### 5. Docker (Optional)

#### Dockerfile
```dockerfile
FROM nginx:alpine
COPY dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### Build & Run
```bash
npm run build
docker build -t kmrl-dms .
docker run -p 8080:80 kmrl-dms
```

## Environment Configuration

### No Environment Variables Required
This application runs entirely client-side with no backend dependencies.

### Optional Customization
If you want to customize URLs or settings, edit:
- `src/services/whatsappService.ts` - WhatsApp phone number
- `src/i18n/translations.ts` - UI text translations

## Performance Optimization

### Already Implemented
- Code splitting with Vite
- Tree shaking
- Minification
- CSS optimization
- Asset compression

### Additional Optimizations
```bash
# Install compression plugins (optional)
npm install -D vite-plugin-compression

# Add to vite.config.ts
import viteCompression from 'vite-plugin-compression'

plugins: [
  react(),
  viteCompression()
]
```

## Browser Cache Configuration

### Nginx
```nginx
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

### Apache
```apache
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType image/* "access plus 1 year"
</IfModule>
```

## Troubleshooting

### Build Errors
```bash
# Clear cache and reinstall
rm -rf node_modules dist
npm install
npm run build
```

### Routing Issues on Static Hosts
Add `_redirects` file for Netlify:
```
/*    /index.html   200
```

Add `vercel.json` for Vercel:
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

### Large Bundle Size
- Already optimized with code splitting
- Tesseract.js loads on demand
- Consider lazy loading routes if needed

## Monitoring

### Google Analytics (Optional)
Add to `index.html`:
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

## Security

### Content Security Policy
Add to server config:
```
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'
```

### HTTPS
Always use HTTPS in production:
- GitHub Pages: Automatic
- Netlify: Automatic
- Vercel: Automatic
- AWS: Use CloudFront

## Backup & Data Export

### User Data
All data is stored in browser localStorage. Users can:
1. Open browser DevTools (F12)
2. Go to Application → Local Storage
3. Copy `kmrl_documents`, `kmrl_alerts`, `kmrl_compliance` keys
4. Save as backup

### Automated Backup (Optional Feature)
Add export functionality to allow users to download their data as JSON.

## Support

### Browser Requirements
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Opera 76+

### Device Requirements
- Desktop: Any modern browser
- Tablet: iPad Pro or equivalent
- Mobile: Responsive design works on all screen sizes

## Scaling

### Current Capacity
- localStorage limit: ~5-10 MB (varies by browser)
- Handles hundreds of documents
- All processing client-side

### If Scaling Needed
Consider adding backend with:
- Supabase (database already configured in env)
- Edge functions for processing
- Cloud storage for files
