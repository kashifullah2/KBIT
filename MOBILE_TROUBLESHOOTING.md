# Mobile Troubleshooting Guide

## Common Issues & Solutions

### ⚠️ "Something went wrong. Please try again." Error

#### Root Causes
1. **API URL Not Configured** - Backend endpoint not accessible
2. **Network Timeout** - Connection taking too long (>30s)
3. **CORS Issues** - Browser blocking cross-origin requests
4. **Session Expired** - Authentication token invalid
5. **Backend Down** - Server not responding

#### Solutions

**Step 1: Check Your Network**
```bash
# Open browser console (F12 on mobile browser)
# Run the diagnostic:
# Press F12 → Console tab → Paste this:
await import('/src/lib/diagnostics.ts').then(d => d.initializeDiagnostics(true))
```

**Step 2: Configure API URL**
- Ensure `VITE_API_URL` environment variable is set
- For production: Set it to your actual backend domain
- For development: Should be `http://localhost:8000` or your dev server

```bash
# .env or .env.production
VITE_API_URL=https://api.brainhalf.com
```

**Step 3: Verify Backend is Running**
```bash
# Check backend health
curl -X GET https://api.brainhalf.com/ocr/engines

# Should return:
# {"engines": ["tesseract", "paddle", ...]}
```

**Step 4: Check CORS Headers**
Backend should have proper CORS headers. Example (already implemented):
```python
# backend/main.py
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # or specify frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### 📱 Mobile Layout Issues

#### Chat Not Displaying Correctly
- Clear browser cache: Settings → Clear browsing data
- Disable any ad blockers or privacy extensions
- Try landscape orientation for wider view

#### Text Too Small/Large
- Pinch to zoom or use browser zoom settings
- Text should auto-scale for different devices
- If not working, check viewport meta tag in `index.html`

#### Input Box Overlapping Messages
- Make sure virtual keyboard doesn't push content off screen
- Supported automatically on recent iOS/Android
- If issue persists, check device zoom level

### 🔄 Service Worker Issues

#### "Offline - Resource not available"
- Updated app but seeing old version?
- **Solution**: Unregister old service worker
  1. Open DevTools (F12)
  2. Application → Service Workers
  3. Click "Unregister"
  4. Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)

#### Cache Not Clearing
```javascript
// Run in console to clear all caches:
await (await caches.keys()).forEach(async name => await caches.delete(name))
```

### 🚀 Performance Issues

#### Slow Chat Response Time
1. Check network connectivity (4G vs 3G)
2. Monitor backend response time in DevTools Network tab
3. Look for timeout errors (>30 seconds)
4. Check if backend has adequate database connection pool

#### High Battery/Data Usage
- Service Worker caching reduces network requests
- If using lots of data, check for large image uploads
- Disable auto-play of any videos/animations

### 🔐 Authentication Issues

#### Session Keeps Expiring
- Token expires after 30 minutes (configurable)
- **Solution**: Intercept 401 errors and prompt re-login
- Automatic in latest version

#### "Session expired" Error
1. Log out completely
2. Clear all local storage:
   ```javascript
   // Run in console:
   localStorage.clear()
   ```
3. Log back in

### 🌐 Network Detection

#### "Network error. Check your connection"
- App detected you're offline
- Check WiFi/Mobile data is enabled
- Try toggling airplane mode off/on
- Check if you're in a WiFi dead zone

### 📊 Debugging with DevTools

**Mobile Chrome:**
1. Connect phone via USB
2. Open `chrome://inspect` on desktop
3. Click "inspect" on your device
4. Open Console tab
5. See real-time console logs

**Network Tab:**
- Shows all API requests and responses
- Check for failed requests (red lines)
- Look at response headers for CORS errors
- Monitor response times

**Application Tab:**
- Service Workers: Check registration status
- Cache: See what's cached
- Local Storage: Verify token and chat history

### 📋 Diagnostic Checklist

Before reporting an issue, check:
- [ ] Backend API is running
- [ ] `VITE_API_URL` is correctly configured
- [ ] Internet connection is active
- [ ] Browser supports Service Workers (iOS 14.3+, Android 5.0+)
- [ ] No ad blockers blocking API calls
- [ ] Cache has been cleared
- [ ] Token hasn't expired (>30 mins)
- [ ] Browser console shows no errors (F12)

### 🐛 Reporting Issues

When reporting an issue, include:
1. Device (iPhone 12, Galaxy S20, etc.)
2. OS and version (iOS 15.2, Android 11, etc.)
3. Browser and version
4. Steps to reproduce
5. Console error messages
6. Network tab screenshot showing failed requests
7. Output of diagnostic check

### 📝 Environment Variables

**Development:**
```bash
VITE_API_URL=http://localhost:8000
```

**Production:**
```bash
VITE_API_URL=https://api.brainhalf.com
```

**Staging:**
```bash
VITE_API_URL=https://staging-api.brainhalf.com
```

### 📞 Support

For additional help:
1. Check [OPTIMIZATION_GUIDE.md](./OPTIMIZATION_GUIDE.md) for performance tips
2. Review backend logs for API errors
3. Check browser DevTools Network tab for failed requests
4. Open an issue on GitHub with diagnostic information

---

## Quick Fixes

```bash
# Clear everything and start fresh
# 1. Unregister service worker
await (await caches.keys()).forEach(async name => await caches.delete(name))

# 2. Clear local storage
localStorage.clear()

# 3. Hard refresh
# Ctrl+Shift+R (Windows/Linux)
# Cmd+Shift+R (Mac)

# 4. Close and reopen browser
```

---

Last updated: March 14, 2026
