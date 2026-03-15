# Luxury Weather App - Status & Testing

## API Status (All APIs are LIVE - No API Keys Required)

### Weather Data API
- **URL**: `https://api.open-meteo.com/v1/forecast`
- **Status**: ✅ Live
- **Cost**: Free
- **Rate Limit**: High (no strict limits for personal use)

### City Search API
- **URL**: `https://geocoding-api.open-meteo.com/v1/search`
- **Status**: ✅ Live
- **Cost**: Free
- **Rate Limit**: High

### Reverse Geocoding API
- **URL**: `https://nominatim.openstreetmap.org/reverse`
- **Status**: ✅ Live
- **Cost**: Free
- **Rate Limit**: 1 request per second (with proper User-Agent header)

## Testing the APIs

You can test the APIs directly in your browser:

### Test Weather for Abuja:
```
https://api.open-meteo.com/v1/forecast?latitude=9.0765&longitude=7.4983&current=temperature_2m,apparent_temperature,weathercode,windspeed_10m,winddirection_10m,relativehumidity_2m,uv_index&hourly=temperature_2m,weathercode&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_probability_max,windspeed_10m_max&timezone=Africa/Lagos&forecast_days=7
```

### Test City Search:
```
https://geocoding-api.open-meteo.com/v1/search?name=London&count=6&language=en&format=json
```

### Test Reverse Geocoding:
```
https://nominatim.openstreetmap.org/reverse?lat=9.0765&lon=7.4983&format=json
```

## Running the App

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open browser to http://localhost:5173
```

## Troubleshooting UI Issues

If the UI is not displaying well:

1. **Clear browser cache** - Sometimes Tailwind styles get cached
2. **Check console** - Open DevTools (F12) and look for errors
3. **Verify fonts loaded** - Check Network tab for font files
4. **Test API response** - Use the URLs above to verify data is loading

## Common Issues

### Issue: Fonts not loading
- Ensure you have internet connection (fonts are loaded from Google Fonts)
- Check if firewall is blocking Google Fonts

### Issue: Weather not updating
- Check if location permission is granted
- Verify APIs are accessible (use test URLs above)
- Check browser console for network errors

### Issue: Blank screen
- Check browser console for errors
- Verify `npm install` completed successfully
- Try hard refresh (Ctrl+Shift+R / Cmd+Shift+R)
