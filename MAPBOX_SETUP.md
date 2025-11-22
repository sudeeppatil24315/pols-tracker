# Mapbox Setup Guide - Los Pollos Tracker

## 🎯 Step-by-Step Setup

### Step 1: Create Mapbox Account (2 minutes)

1. **Go to Mapbox:**
   - Visit: https://account.mapbox.com/auth/signup/
   
2. **Sign Up:**
   - Enter your email
   - Create a password
   - Click "Get started"
   
3. **Verify Email:**
   - Check your email inbox
   - Click the verification link

4. **Complete Profile:**
   - Answer a few questions (optional)
   - Click "Continue"

---

### Step 2: Get Your Access Token (1 minute)

1. **Go to Tokens Page:**
   - Visit: https://account.mapbox.com/access-tokens/
   - Or click your profile → "Access tokens"

2. **Copy Default Token:**
   - You'll see a "Default public token"
   - Click the copy icon
   - It looks like: `pk.eyJ1IjoieW91cm5hbWUiLCJhIjoiY2x...`

3. **Or Create New Token:**
   - Click "Create a token"
   - Name it: "Los Pollos Tracker"
   - Select scopes:
     - ✅ Directions API
     - ✅ Navigation API
     - ✅ Traffic API
   - Click "Create token"
   - Copy the token

---

### Step 3: Add Token to Your Project (30 seconds)

1. **Open `.env` file** in `los-pollos-tracker/`

2. **Add this line:**
   ```env
   VITE_MAPBOX_TOKEN=pk.your_actual_token_here
   ```

3. **Replace** `pk.your_actual_token_here` with your copied token

4. **Save the file**

---

### Step 4: Restart Development Server (30 seconds)

1. **Stop the current server:**
   - Press `Ctrl+C` in the terminal running `npm run dev`

2. **Start it again:**
   ```bash
   npm run dev
   ```

3. **Done!** Mapbox is now active

---

## ✅ Verify Setup

### Test 1: Check Token Loading
Open browser console (F12) and look for:
```
✅ Mapbox token loaded
```

### Test 2: Create a New Task
1. Login as admin
2. Click "New Task"
3. Create a delivery
4. Watch the vehicle follow roads with traffic data!

### Test 3: Check Traffic Overlay
- Look for "Live Traffic" panel on the map
- Should show traffic incidents

---

## 🎨 What You Get with Mapbox

### 1. Real-Time Traffic
- Live traffic conditions
- Congestion levels
- Traffic incidents
- Accurate ETAs

### 2. Road-Based Routing
- Vehicles follow actual roads
- Turn-by-turn navigation
- Alternative routes
- Avoid traffic

### 3. Traffic Visualization
- Color-coded routes
- Incident markers
- Delay estimates
- Congestion alerts

---

## 📊 Usage Limits

### Free Tier (More than enough!)
- **50,000 requests/month**
- **Unlimited map loads**
- **Real-time traffic included**

### Your Usage (Estimated)
- 12 vehicles × 1 route each = 12 requests
- New tasks: ~10/day = 300/month
- **Total: ~312 requests/month** ✅

### After Free Tier
- $0.50 per 1,000 requests
- You won't hit this limit!

---

## 🔧 Configuration Options

### Current Setup (in `.env`)
```env
VITE_MAPBOX_TOKEN=pk.your_token_here
MONGODB_URI=mongodb://localhost:27017/los-pollos-tracker
PORT=5001
```

### Optional: Mapbox Styles
Add custom map styles:
```env
VITE_MAPBOX_STYLE=mapbox://styles/mapbox/dark-v11
```

Available styles:
- `streets-v12` - Default streets
- `dark-v11` - Dark theme (recommended)
- `light-v11` - Light theme
- `satellite-v9` - Satellite view
- `navigation-day-v1` - Navigation style

---

## 🚨 Troubleshooting

### Issue: "Invalid token" error
**Solution:**
1. Check token starts with `pk.`
2. No spaces before/after token
3. Token is on one line
4. Restart dev server

### Issue: Token not loading
**Solution:**
1. File must be named `.env` (with dot)
2. File must be in `los-pollos-tracker/` folder
3. Restart dev server after changes

### Issue: Still using demo token
**Solution:**
1. Check `.env` file exists
2. Token variable is `VITE_MAPBOX_TOKEN`
3. Clear browser cache
4. Hard refresh (Ctrl+Shift+R)

### Issue: Routes not showing
**Solution:**
1. Check browser console for errors
2. Verify token has Directions API scope
3. Check network tab for API calls

---

## 🎯 Next Steps After Setup

### 1. Enable Traffic Overlay
Already done! Look for the traffic panel on the map.

### 2. Test Traffic Features
- Create a new delivery task
- Watch vehicle follow roads
- See traffic delays in ETA
- Check traffic incidents

### 3. Customize Traffic Display
Edit `src/components/TrafficOverlay.tsx` to:
- Change colors
- Add more incident types
- Customize notifications

---

## 📱 Mobile App Token (Future)

For mobile apps, create a separate token:
1. Go to: https://account.mapbox.com/access-tokens/
2. Click "Create a token"
3. Name: "Los Pollos Mobile"
4. Select: Downloads:Read scope
5. Add URL restrictions for security

---

## 🔐 Security Best Practices

### ✅ DO:
- Use public tokens (pk.) for frontend
- Restrict token to specific URLs in production
- Create separate tokens for dev/prod
- Monitor usage on Mapbox dashboard

### ❌ DON'T:
- Share secret tokens (sk.)
- Commit tokens to public repos
- Use same token for all projects
- Ignore usage alerts

---

## 📈 Monitor Usage

### Check Your Usage:
1. Go to: https://account.mapbox.com/
2. Click "Statistics"
3. View:
   - API requests
   - Map loads
   - Traffic API calls

### Set Up Alerts:
1. Go to "Billing"
2. Set usage alerts
3. Get notified at 80% of free tier

---

## 🎉 You're All Set!

Your Los Pollos Tracker now has:
- ✅ Real-time traffic data
- ✅ Road-based routing
- ✅ Traffic incidents
- ✅ Accurate ETAs
- ✅ Professional visualization

**Enjoy your enhanced fleet tracking system!** 🚚🐔

---

## 📞 Support

### Mapbox Help:
- Documentation: https://docs.mapbox.com/
- Support: https://support.mapbox.com/
- Community: https://github.com/mapbox

### Los Pollos Tracker:
- Check `ROAD_ROUTING_GUIDE.md`
- Check `PROBLEM3_FEATURES.md`
- Review code comments
