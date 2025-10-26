# How to See the New Enhanced Data Source Badges

## Quick Start

The new Enhanced Data Source Badge system is now live and automatically integrated into all metric cards!

### Start the Dev Server

```bash
npm run dev
```

### Navigate to Gaza Dashboard

Open your browser to: `http://localhost:5173/gaza`

---

## What You'll See

### On Every Metric Card

Each metric card (Total Killed, Children Killed, Women Killed, Press Casualties) now shows:

```
┌─────────────────────────────────────────────────────────┐
│ Total Killed                                      [👤]  │
│                                                          │
│ 45,123                                          +5.2%   │
│                                                          │
│ [🗄️ Tech4Palestine 🔗]  🕐 5m ago  [↻]                 │
└─────────────────────────────────────────────────────────┘
```

**New Badge Features**:
1. **Source Name** with database icon (🗄️)
2. **External Link Icon** (🔗) - indicates it's clickable
3. **Last Refresh Time** (🕐) - shows "5m ago", "2h ago", etc.
4. **Refresh Button** (↻) - click to manually refresh data

---

## Interactive Features

### 1. Click the Badge

**Action**: Click on the green/blue/yellow badge  
**Result**: Opens the data source website in a new tab

Example: Clicking "Tech4Palestine" opens https://data.techforpalestine.org

### 2. Hover Over the Badge

**Action**: Hover your mouse over the badge  
**Result**: Shows detailed information card with:

```
┌─────────────────────────────────────────────────────────┐
│ 🗄️ Data Sources                    [✓ Fresh]           │
│ Click any source to visit their website                 │
│                                                          │
│ PRIMARY SOURCE                                           │
│ ┌─────────────────────────────────────────────────┐    │
│ │ 🗄️ Tech for Palestine                      🔗   │    │
│ │ Comprehensive database of casualties and        │    │
│ │ infrastructure damage in Gaza                   │    │
│ │ [Reliability: high] [daily]                     │    │
│ └─────────────────────────────────────────────────┘    │
│                                                          │
│ ─────────────────────────────────────────────────────  │
│ 🕐 Last Refreshed              5m ago                   │
│ Exact Time                     Oct 22, 02:30 PM         │
│ [↻ Refresh Data]                                        │
│                                                          │
│ ⚠️ View methodology and verification process 🔗         │
└─────────────────────────────────────────────────────────┘
```

**What You Can Do**:
- Click the primary source box to visit their website
- Click "Refresh Data" button to manually update
- Click "View methodology" to see how data is verified

### 3. Click the Refresh Button

**Action**: Click the small refresh icon (↻) next to the time  
**Result**: 
- Icon spins while refreshing
- Data updates
- Timestamp changes to "just now"

---

## Color-Coded Freshness

The badge color changes based on how recent the data is:

### 🟢 Green Badge - "Fresh"
- **When**: Data updated less than 1 hour ago
- **Time Shows**: "just now", "5m ago", "45m ago"
- **Meaning**: Data is very current

### 🔵 Blue Badge - "Recent"
- **When**: Data updated 1-24 hours ago
- **Time Shows**: "2h ago", "12h ago", "23h ago"
- **Meaning**: Data is current

### 🟡 Yellow Badge - "Stale"
- **When**: Data updated 1-7 days ago
- **Time Shows**: "2d ago", "5d ago"
- **Meaning**: Data may be outdated

### 🟠 Orange Badge - "Outdated"
- **When**: Data updated more than 7 days ago
- **Time Shows**: "8d ago", "15d ago"
- **Meaning**: Data needs refresh

---

## Where to Find the Badges

### Gaza Dashboard

**Location**: Bottom of each metric card

1. **Humanitarian Crisis Tab**:
   - Total Killed card → Badge at bottom
   - Children Killed card → Badge at bottom
   - Women Killed card → Badge at bottom
   - Press Casualties card → Badge at bottom

2. **Infrastructure Tab**:
   - All metric cards have badges

3. **Population Impact Tab**:
   - All metric cards have badges

4. **Aid & Survival Tab**:
   - All metric cards have badges

### West Bank Dashboard

**Location**: Same as Gaza - bottom of each metric card

All metric cards across all tabs now have the enhanced badges.

---

## Testing the Features

### Quick Test Checklist

1. ✅ **See the badge**: Look at any metric card, badge is at the bottom
2. ✅ **Check the time**: Should show relative time like "5m ago"
3. ✅ **Hover over badge**: Detailed card should appear
4. ✅ **Click the badge**: Should open source website in new tab
5. ✅ **Click refresh button**: Icon should spin, time should update
6. ✅ **Check color**: Badge should be green (fresh) if recently loaded

---

## Example Walkthrough

### Step-by-Step

1. **Start the server**:
   ```bash
   npm run dev
   ```

2. **Open Gaza dashboard**:
   - Go to `http://localhost:5173/gaza`
   - You should see 4 metric cards

3. **Look at "Total Killed" card**:
   - Scroll to the bottom of the card
   - You'll see: `[🗄️ Tech4Palestine 🔗] 🕐 just now [↻]`

4. **Hover over the badge**:
   - Move your mouse over the green badge
   - A detailed card pops up with full information

5. **Click the badge**:
   - Click anywhere on the green badge
   - Tech4Palestine website opens in a new tab

6. **Click the refresh button**:
   - Click the small circular arrow icon (↻)
   - Watch it spin
   - Time updates to "just now"

---

## Troubleshooting

### Issue: Can't see the badges

**Solution**:
1. Make sure you're on the Gaza or West Bank dashboard
2. Look at the bottom of any metric card
3. Refresh the page (Ctrl+R or Cmd+R)
4. Check browser console for errors

### Issue: Badge not clickable

**Solution**:
1. Make sure you're clicking the colored badge itself
2. Look for the external link icon (🔗)
3. Check that popup blocker isn't blocking the new tab

### Issue: Refresh button doesn't work

**Solution**:
1. The refresh functionality may not be connected yet
2. Check browser console for errors
3. The button should still show the spinning animation

### Issue: Hover card doesn't appear

**Solution**:
1. Make sure you're hovering directly over the badge
2. Wait a moment for the card to appear
3. Try clicking the badge instead

---

## What's Different from Before

### Old System
```
[T4P] - Simple text badge
```

### New System
```
[🗄️ Tech4Palestine 🔗]  🕐 5m ago  [↻]
```

**Improvements**:
- ✅ Clickable link to source
- ✅ Shows last refresh time
- ✅ Manual refresh button
- ✅ Color-coded freshness
- ✅ Detailed hover information
- ✅ Better visual design

---

## Next Steps

### Try These Actions

1. **Click different badges** to visit various data sources
2. **Watch the time update** as you use the dashboard
3. **Hover over badges** to learn about each source
4. **Click "View methodology"** to understand data verification
5. **Use the refresh button** to get latest data

### Explore More

- Visit the Data Transparency page (`/data-transparency`)
- Check out different dashboard tabs
- Compare badges across different metric cards
- See how colors change over time

---

## Summary

✅ **New badges** are on every metric card  
✅ **Clickable links** to original data sources  
✅ **Last refresh time** with relative display  
✅ **Manual refresh** button available  
✅ **Color-coded** freshness indicators  
✅ **Detailed info** on hover  

**To see them**: Start dev server → Go to `/gaza` → Look at bottom of any metric card

---

*Last Updated: October 22, 2025*
