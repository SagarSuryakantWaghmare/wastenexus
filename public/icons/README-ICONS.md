# PWA Icons for WasteNexus

## Required Icons

You need to create the following icon sizes. Use your existing logo `/public/assets/logo/recycle-symbol.png` as the base.

### Standard Icons (Required)
- icon-72x72.png
- icon-96x96.png
- icon-128x128.png
- icon-144x144.png
- icon-152x152.png
- **icon-192x192.png** (Android)
- icon-384x384.png
- **icon-512x512.png** (Android)

### Maskable Icons (Adaptive Icons for Android)
- icon-192x192-maskable.png
- icon-512x512-maskable.png

### Shortcut Icons (Optional but recommended)
- shortcut-report.png (96x96)
- shortcut-dashboard.png (96x96)
- shortcut-marketplace.png (96x96)

### Apple Touch Icons
- apple-touch-icon.png (180x180)

---

## Quick Ways to Generate Icons

### Option 1: Online Tools (Easiest)
1. **PWA Asset Generator**: https://www.pwabuilder.com/imageGenerator
   - Upload your logo
   - Downloads all sizes automatically
   
2. **RealFaviconGenerator**: https://realfavicongenerator.net/
   - Upload logo
   - Generate all PWA icons

### Option 2: Using ImageMagick (Command Line)
```bash
# Install ImageMagick first
# Then run:

convert recycle-symbol.png -resize 72x72 icon-72x72.png
convert recycle-symbol.png -resize 96x96 icon-96x96.png
convert recycle-symbol.png -resize 128x128 icon-128x128.png
convert recycle-symbol.png -resize 144x144 icon-144x144.png
convert recycle-symbol.png -resize 152x152 icon-152x152.png
convert recycle-symbol.png -resize 192x192 icon-192x192.png
convert recycle-symbol.png -resize 384x384 icon-384x384.png
convert recycle-symbol.png -resize 512x512 icon-512x512.png
convert recycle-symbol.png -resize 180x180 apple-touch-icon.png
```

### Option 3: Photoshop/Figma
1. Open your logo
2. Image → Image Size
3. Resize to each dimension (maintain aspect ratio)
4. Export as PNG

---

## Icon Guidelines

### Standard Icons
- Use transparent background
- Keep logo centered
- Ensure 10-15% padding around edges

### Maskable Icons
- Add 40% safe zone padding
- Background color: #10b981 (emerald-500)
- Logo in center, smaller size

### Design Tips
- Logo should be recognizable at small sizes
- Use high contrast colors
- Test on both light and dark backgrounds

---

## Temporary Icons (For Testing)

For now, you can:
1. Copy your existing `recycle-symbol.png` 
2. Rename it to each required size
3. PWA will still work (just not optimized)

Example:
```bash
cd public/icons
cp ../assets/logo/recycle-symbol.png icon-192x192.png
cp ../assets/logo/recycle-symbol.png icon-512x512.png
cp ../assets/logo/recycle-symbol.png apple-touch-icon.png
```

---

## After Generating Icons

Place all icons in: `public/icons/`

Your structure should look like:
```
public/
├── icons/
│   ├── icon-72x72.png
│   ├── icon-96x96.png
│   ├── icon-128x128.png
│   ├── icon-144x144.png
│   ├── icon-152x152.png
│   ├── icon-192x192.png ⭐ Required
│   ├── icon-384x384.png
│   ├── icon-512x512.png ⭐ Required
│   ├── icon-192x192-maskable.png
│   ├── icon-512x512-maskable.png
│   ├── apple-touch-icon.png ⭐ Required
│   ├── shortcut-report.png
│   ├── shortcut-dashboard.png
│   └── shortcut-marketplace.png
└── manifest.json
```

---

## Testing Your Icons

After adding icons:
1. Build: `npm run build`
2. Start: `npm run start`
3. Open Chrome DevTools → Application → Manifest
4. Check if all icons load correctly
