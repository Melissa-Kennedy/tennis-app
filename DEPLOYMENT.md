# Deployment Guide

This guide covers deploying the Tennis Map Toronto app to various platforms.

## Vercel Deployment (Recommended)

### Option 1: Vercel CLI

1. **Install Vercel CLI**:
```bash
npm install -g vercel
```

2. **Login to Vercel**:
```bash
vercel login
# Follow prompts to authenticate
```

3. **Deploy**:
```bash
vercel --prod
```

The app will be automatically deployed and you'll get a production URL.

### Option 2: Vercel Dashboard

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "Add New Project"
3. Import your Git repository
4. Vercel will automatically detect it's a React app
5. Click "Deploy"

**Build Settings:**
- Framework Preset: `Create React App`
- Build Command: `npm run build`
- Output Directory: `build`
- Install Command: `npm install`

## Alternative Deployment Options

### Netlify

1. Build the project:
```bash
npm run build
```

2. **Option A**: Drag & drop `build` folder to [netlify.com/drop](https://netlify.com/drop)

3. **Option B**: Connect Git repository:
   - Go to [netlify.com](https://netlify.com)
   - Click "Add new site" > "Import an existing project"
   - Connect your Git provider
   - Build settings:
     - Build command: `npm run build`
     - Publish directory: `build`

### GitHub Pages

1. **Install gh-pages**:
```bash
npm install --save-dev gh-pages
```

2. **Add to package.json scripts**:
```json
{
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d build"
  },
  "homepage": "https://yourusername.github.io/tennis-map"
}
```

3. **Deploy**:
```bash
npm run deploy
```

### AWS S3 + CloudFront

1. **Build the project**:
```bash
npm run build
```

2. **Create S3 bucket**:
   - Enable static website hosting
   - Set index document to `index.html`
   - Set error document to `index.html` (for SPA routing)

3. **Upload build files** to S3 bucket

4. **Set up CloudFront distribution** (optional but recommended):
   - Origin: Your S3 bucket
   - Default root object: `index.html`
   - Error pages: 404 → `/index.html` (200 response)

## Environment Variables

If you need environment variables in production:

1. **Create `.env.production`**:
```env
REACT_APP_API_URL=https://your-api-url.com
REACT_APP_ANALYTICS_ID=your-analytics-id
```

2. **For Vercel**: Add environment variables in the dashboard
3. **For Netlify**: Add in Site Settings > Environment Variables

## Custom Domain Setup

### Vercel
1. Go to your project dashboard
2. Click "Domains"
3. Add your custom domain
4. Update DNS records as instructed

### Netlify
1. Go to Site Settings > Domain Management
2. Add custom domain
3. Update DNS records

## Performance Optimization

The app includes several optimizations:

- **Static assets caching**: 1 year cache for static files
- **Gzip compression**: Enabled automatically
- **Bundle optimization**: Tree-shaking and minification
- **Security headers**: X-Frame-Options, CSP, etc.

## Monitoring

Consider adding:

- **Google Analytics**: Add tracking ID to environment variables
- **Sentry**: For error tracking
- **Vercel Analytics**: Built-in performance monitoring

## Troubleshooting

### Build Issues
- Ensure Node.js version >= 16
- Delete `node_modules` and `package-lock.json`, then `npm install`
- Check for TypeScript errors: `npm run build`

### Routing Issues (404 on page refresh)
- Ensure `vercel.json` includes SPA routing rules
- For other platforms, configure rewrites to `index.html`

### Map Not Loading
- Check console for HTTPS mixed content warnings
- Verify Leaflet CSS is included

## Success Indicators

✅ Build completes without errors  
✅ App loads at production URL  
✅ Map displays with pins  
✅ Navigation between pages works  
✅ Responsive design functions on mobile  
✅ All 108 tennis courts load correctly  

## Support

- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
- **React Deployment**: [create-react-app.dev/docs/deployment](https://create-react-app.dev/docs/deployment)
- **Leaflet Docs**: [leafletjs.com](https://leafletjs.com)