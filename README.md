# KMRL Document Management System

A fully functional, static web application for Kerala Metro Rail Limited's document management with AI-powered processing, multi-language support, and intelligent routing.

## Features

### Core Functionality
- **AI-Powered OCR**: Extract text from documents using Tesseract.js
- **Smart Document Analysis**: Automatic department detection, criticality assessment, and summarization
- **Multi-Department Routing**: Automatically route documents to all relevant departments
- **WhatsApp Alerts**: Send critical document notifications via WhatsApp outside working hours
- **Smart Search**: Advanced search across document content, tags, and metadata
- **Multi-Language**: Full support for English and Malayalam

### No Backend Required
- All data stored in browser localStorage
- Completely client-side application
- No server setup needed
- Deploy anywhere static files are supported

## Quick Start

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```
Access at: http://localhost:5173

### Production Build
```bash
npm run build
```

## Usage Guide

### 1. Upload Documents
1. Navigate to "Document Upload"
2. Drag and drop files (PDF, images, text files)
3. Fill in metadata (title, department, type, language)
4. Click "Process Document"

**AI Processing:**
- Extracts text via OCR (for images)
- Analyzes content for departments mentioned
- Detects critical keywords
- Generates summary and key points
- Routes to relevant departments automatically

### 2. Search Documents
1. Navigate to "Search & Filter"
2. Type search query (works in English and Malayalam)
3. Use filters for department, type, language, status
4. Results update in real-time

**Smart Search Capabilities:**
- Searches across title, tags, summary, and extracted text
- Multi-language support
- Filter by multiple criteria
- AI-powered relevance

### 3. WhatsApp Notifications
For critical documents uploaded outside working hours (9 AM - 6 PM, Mon-Fri):
- System automatically detects criticality
- Opens WhatsApp with pre-filled message
- Includes document summary and dashboard link
- Tracks notification history

### 4. Language Toggle
- Click the globe icon in navbar
- Select English or മലയാളം
- Entire UI translates instantly
- Preference saved automatically

### 5. View Dashboard
- See total documents, pending reviews
- Recent alerts and documents
- Quick actions for common tasks
- Real-time statistics

## Technical Details

### Stack
- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **OCR**: Tesseract.js
- **Storage**: localStorage

### Architecture
```
src/
├── components/          # UI components
│   ├── Dashboard/       # Dashboard widgets
│   ├── Documents/       # Document cards
│   ├── Layout/          # Navbar, Sidebar
│   ├── pages/           # Page components
│   ├── Search/          # Search filters
│   └── Upload/          # File upload
├── services/            # Business logic
│   ├── aiProcessor.ts   # AI analysis
│   ├── documentStorage.ts # localStorage wrapper
│   └── whatsappService.ts # WhatsApp integration
├── context/             # React Context
│   └── LanguageContext.tsx
├── i18n/                # Translations
│   └── translations.ts
├── types/               # TypeScript types
└── data/                # Mock data
```

### Data Storage
All data is stored in browser localStorage:
- `kmrl_documents` - Document files and metadata
- `kmrl_alerts` - System alerts
- `kmrl_compliance` - Compliance tracking
- `kmrl_language` - Language preference
- `whatsapp_alerts` - WhatsApp notification history

### File Storage
Files are converted to base64 and stored in localStorage with metadata:
```typescript
{
  file: {
    name: string,
    size: number,
    type: string,
    base64: string
  },
  extractedText: string,
  aiAnalysis: {...}
}
```

## Deployment

### GitHub Pages
```bash
# Update vite.config.ts with base path
# Then:
npm run build
npx gh-pages -d dist
```

### Netlify / Vercel
```bash
npm run build
# Drag dist/ folder or connect GitHub repo
```

### Docker
```bash
npm run build
docker build -t kmrl-dms .
docker run -p 8080:80 kmrl-dms
```

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions.

## Features Documentation

See [FEATURES.md](FEATURES.md) for complete feature list and technical details.

## Browser Support
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Opera 76+

## Data Privacy
- All data stored locally in browser
- No external server communication (except OCR worker)
- User maintains full control
- Can export/backup localStorage data

## Customization

### Update WhatsApp Number
Edit `src/services/whatsappService.ts`:
```typescript
const phoneNumber = '+919876543210'; // Change this
```

### Add Translations
Edit `src/i18n/translations.ts`:
```typescript
export const translations = {
  en: { /* English */ },
  ml: { /* Malayalam */ }
};
```

### Modify Departments
Edit `src/services/aiProcessor.ts`:
```typescript
const DEPARTMENT_KEYWORDS: Record<string, string[]> = {
  'Operations': ['station', 'operation', ...],
  // Add more departments
};
```

## Limitations

### Storage
- localStorage limit: ~5-10 MB (varies by browser)
- Approximately 50-200 documents depending on file sizes
- Base64 encoding increases file size by ~33%

### Processing
- OCR runs in browser (may be slower on mobile)
- Large files (>10 MB) may cause performance issues
- Recommended file size: <5 MB per document

## Future Enhancements

If backend is added later:
- Cloud storage integration
- Real-time collaboration
- Email notifications
- Advanced analytics
- User authentication
- Document versioning

## Troubleshooting

### OCR Not Working
- Check browser console for errors
- Ensure file is valid image format
- Try smaller file size
- Check internet connection (worker loads from CDN)

### Storage Full
- Clear old documents
- Export data as backup
- Clear browser cache
- Use smaller file sizes

### Search Not Working
- Check language setting
- Verify documents have been processed
- Refresh page to reload data

## License

MIT License - See LICENSE file for details

## Support

For issues or questions:
1. Check browser console for errors
2. Verify browser compatibility
3. Clear localStorage and retry
4. Check file format and size

## Credits

Developed for Kerala Metro Rail Limited (KMRL)
- UI Framework: React + Tailwind CSS
- OCR: Tesseract.js
- Icons: Lucide React
