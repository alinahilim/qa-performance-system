# 📊 QA Performance Monitoring System

Professional quality assurance evaluation system for logistics dispatchers and agents.

## 🌐 Live Demo

Your site will be live at: `https://YOUR-USERNAME.github.io/qa-performance-system/`

---

## ✨ Features

### 🎯 Core Functionality
- **Multi-user authentication** with role-based access (Admin/Evaluator)
- **Agent management** - add manually or import from Google Sheets
- **Performance evaluation** - structured scorecard with weighted criteria
- **N/A logic** - criteria marked as N/A are excluded from calculations
- **Category scoring** - individual percentage for each evaluation category
- **Historical comparison** - compare current scores with previous evaluations
- **Evaluation history** - track all assessments over time

### 📈 Scoring System
- **Call Introduction** (100%)
- **Negotiation with Driver** (2 criteria, 50% each)
- **Negotiation with Broker** (5 criteria, weighted)
- **Overall Impression** (2 criteria, 33%/67%)
- **Call Closure** (2 criteria, 62%/38%)
- **Extras** (100%)

### 🔄 N/A Functionality
When a criterion is marked as N/A:
- ✅ Excluded from calculation completely
- ✅ Weight redistributed to other criteria
- ✅ Category percentage recalculated automatically
- ✅ Works exactly like Excel logic

### 📊 Previous Score Comparison
- Select from dropdown of past evaluations
- Or manually enter previous score
- Visual delta indicator (↑ +5% / ↓ -3%)
- Real-time comparison while evaluating

---

## 🚀 Quick Start Guide

### Step 1: Create GitHub Repository

1. Go to https://github.com
2. Sign up or log in
3. Click **"New"** (green button) or **"+"** → **"New repository"**
4. Name: `qa-performance-system`
5. Set to **Public** ✅
6. Check **"Add a README file"** ✅
7. Click **"Create repository"**

### Step 2: Upload Files

1. In your repository, click **"Add file"** → **"Upload files"**
2. Drag and drop these files:
   - `index.html`
   - `google_apps_script.js`
   - `README.md` (this file)
3. Click **"Commit changes"**

### Step 3: Enable GitHub Pages

1. Click **"Settings"** (top right)
2. Scroll down to **"Pages"** (left sidebar)
3. Under **"Source"**:
   - Branch: **main**
   - Folder: **/ (root)**
4. Click **"Save"**
5. Wait 1-2 minutes

### Step 4: Get Your Link

Your site will be live at:
```
https://YOUR-USERNAME.github.io/qa-performance-system/
```

---

## 🔧 Configuration

### Connect to Google Sheets

#### 1. Create Google Sheets Database

1. Create a new Google Sheet named "QA System Database"
2. Open **Extensions** → **Apps Script**
3. Delete the default code
4. Copy all code from `google_apps_script.js`
5. Paste into Apps Script editor
6. Click **"Save"** (💾)

#### 2. Initialize Database

1. In Apps Script, select function: `initializeSheets`
2. Click **"Run"** (▶️)
3. Grant permissions when asked
4. Check your Google Sheet - should now have 4 tabs:
   - Users
   - Dispatchers
   - Evaluations
   - ActivityLog

#### 3. Deploy as Web App

1. Click **"Deploy"** → **"New deployment"**
2. Type: **"Web app"**
3. Execute as: **"Me"**
4. Who has access: **"Anyone"**
5. Click **"Deploy"**
6. Copy the **Web app URL** (looks like: `https://script.google.com/macros/s/...`)

#### 4. Connect HTML to Google Sheets

1. In GitHub, open `index.html`
2. Click **✏️ Edit**
3. Find line **1341** (CONFIG section)
4. Replace:
   ```javascript
   GOOGLE_SHEETS_URL: 'YOUR_URL_HERE',
   USE_MOCK_DATA: true
   ```
   With:
   ```javascript
   GOOGLE_SHEETS_URL: 'YOUR_COPIED_WEB_APP_URL',
   USE_MOCK_DATA: false
   ```
5. Click **"Commit changes"**
6. Wait 30 seconds for site to update

#### 5. Grant Access to Work load Sheet

1. Open your Work load Google Sheet
2. Click **"Share"**
3. Add the Apps Script execution account email
4. Give **"Viewer"** access

---

## 👤 Default Login

**Admin Account:**
- Email: `alina@rpmdispatch.com`
- Password: `admin123`

**Note:** Change password after first login via Admin panel

---

## ✏️ How to Edit Your Site

### Method 1: Edit in Browser (Easiest)

1. Go to your GitHub repository
2. Click on `index.html`
3. Click **✏️ "Edit"** (pencil icon)
4. Make your changes
5. Scroll down
6. Click **"Commit changes"**
7. Wait 30 seconds → changes live!

### Method 2: VS Code in Browser

1. In your GitHub repository, press **`.`** (period key)
2. VS Code opens in browser!
3. Edit with syntax highlighting
4. Commit and push changes

### Method 3: Download & Upload

1. Click **"Code"** → **"Download ZIP"**
2. Extract and edit files locally
3. Go back to GitHub
4. **"Upload files"** → drag edited file
5. **"Commit changes"**

---

## 🔄 Version Control

### View History
1. Click on any file
2. Click **"History"**
3. See all changes ever made

### Revert Changes
1. Go to **"History"**
2. Find the version you want
3. Click **"..."** → **"Revert"**
4. Done! Rolled back

### Create Backup Branch
1. Click **"main"** dropdown
2. Type new name: `backup-2026-05-22`
3. Press Enter
4. Now you have a backup copy!

---

## 📱 Features Guide

### Import from Work load

1. Click **"My Agents"** tab
2. Click **"📥 Import from Work load"**
3. System imports all positions:
   - Dispatchers
   - Account Managers
   - Sales representatives
   - Any other positions in your Work load sheet

### Evaluate with Comparison

1. **Select agent** from "My Agents"
2. **Choose comparison method:**
   - Select previous evaluation from dropdown
   - OR enter score manually
3. **Rate each criterion** (1-5 or N/A)
4. **Watch:**
   - Individual criterion scores update
   - Category percentages calculate
   - Total score reflects N/A exclusions
   - Comparison delta shows improvement/decline
5. **Add comments**
6. **Save evaluation**

### Generate PDF Report

Click **"📄 Generate PDF Report"** to create professional report with:
- Agent details
- Total score and comparison
- Category breakdowns
- Individual criteria scores
- Comments and notes

---

## 🎨 Customization

### Change Colors

Edit `index.html` around lines **20-30**:
```css
/* Main brand color */
background: linear-gradient(135deg, #8B1538 0%, #6B1028 100%);

/* Change to your colors */
background: linear-gradient(135deg, #YOUR_COLOR_1 0%, #YOUR_COLOR_2 100%);
```

### Add/Remove Criteria

Edit scoring configuration around line **1350**:
```javascript
const weights = {
    intro_1: 100,
    driver_1: 50,
    // Add your criteria here
};
```

### Change Evaluation Categories

Edit around line **1340**:
```javascript
const categories = {
    intro: { name: 'Call Introduction', criteria: ['intro_1'] },
    // Add your categories
};
```

---

## 🛡️ Security Notes

### Password Management
- Default password: `admin123`
- Change via Admin panel after first login
- For production: consider implementing password hashing

### Data Privacy
- All evaluation data stored in your Google Sheets
- Only you have access to the database
- GitHub Pages site is public (HTML only)
- No sensitive data stored in HTML file

---

## 📊 Database Structure

### Users Sheet
| Email | Name | Role | Password |
|-------|------|------|----------|
| alina@rpmdispatch.com | Alina H. | admin | admin123 |

### Dispatchers Sheet
| ID | Name | Position | Email | Agent Name | Added By | Date Added |
|----|------|----------|-------|------------|----------|------------|

### Evaluations Sheet
| ID | Agent ID | Evaluator | Date | Total Score | Category Scores | Ratings | Comments |
|----|----------|-----------|------|-------------|-----------------|---------|----------|

### Activity Log
| Date | User | Action | Details |
|------|------|--------|---------|

---

## 🆘 Troubleshooting

### Site Not Loading
- Wait 2-3 minutes after enabling Pages
- Check Settings → Pages shows green checkmark
- Try hard refresh: Ctrl+Shift+R (Windows) / Cmd+Shift+R (Mac)

### Login Not Working
- If using mock data: ensure `USE_MOCK_DATA: true` (line 1341)
- If using Google Sheets:
  - Check `USE_MOCK_DATA: false`
  - Verify Google Sheets URL is correct
  - Run `initializeSheets()` in Apps Script
  - Check Users sheet has admin row

### Import Not Working
- Verify Work load sheet ID is correct (line 17 in Apps Script)
- Check you granted access to Apps Script execution account
- Ensure your email is in the user mapping (line 264-273 in Apps Script)

### Changes Not Appearing
- Wait 30-60 seconds after commit
- Clear browser cache
- Try incognito/private window

---

## 🔗 Important Links

- **GitHub Pages:** https://pages.github.com/
- **Apps Script:** https://script.google.com/
- **Google Sheets:** https://sheets.google.com/

---

## 📞 User Email Mapping

Current evaluators (configured in Apps Script):

| Name | Email |
|------|-------|
| Ivan B. | i.buneev@qlab-university.com |
| Alina H. | alina@rpmdispatch.com |
| Anatoliy | anatoliy@carolinalogisticsinc.com |
| Yevhenii | y.semenov@qlab-university.com |
| Kate | kate.ef@rpmdispatch.com |
| Alina S. | a.shportko@qlab-university.com |
| Valentyna | v.muzykant@qlab-university.com |
| Ann | a.lukianenko@qlab-university.com |

---

## 📝 Version History

### v1.0 - Initial Release
- Multi-user authentication
- Agent management
- Performance evaluation
- Basic reporting

### v1.1 - Enhanced Scoring
- N/A logic implementation
- Category percentage display
- Previous score comparison
- Import all positions from Work load

---

## 💡 Tips

### For Best Performance
- Use Chrome or Firefox
- Enable JavaScript
- Clear cache if experiencing issues
- Keep Google Sheets API under rate limits

### For Team Use
- Add all evaluators to Users sheet
- Grant appropriate permissions
- Use consistent naming conventions
- Regular backups recommended

### For Development
- Test changes in separate branch first
- Use mock data for testing (USE_MOCK_DATA: true)
- Keep backup of working version
- Document major changes

---

## 🎓 Learning Resources

### GitHub
- [GitHub Docs](https://docs.github.com/)
- [GitHub Pages Guide](https://docs.github.com/en/pages)

### Google Apps Script
- [Apps Script Documentation](https://developers.google.com/apps-script)
- [Spreadsheet Service](https://developers.google.com/apps-script/reference/spreadsheet)

### HTML/CSS/JavaScript
- [MDN Web Docs](https://developer.mozilla.org/)
- [W3Schools](https://www.w3schools.com/)

---

## ✅ Checklist

- [ ] Created GitHub repository
- [ ] Uploaded all files
- [ ] Enabled GitHub Pages
- [ ] Verified site is live
- [ ] Created Google Sheets database
- [ ] Copied Apps Script code
- [ ] Ran initializeSheets()
- [ ] Deployed as Web App
- [ ] Updated HTML with Apps Script URL
- [ ] Changed USE_MOCK_DATA to false
- [ ] Granted access to Work load sheet
- [ ] Tested login
- [ ] Tested import
- [ ] Tested evaluation
- [ ] Changed default password

---

## 🎉 You're All Set!

Your QA Performance Monitoring System is now live and ready to use!

**Remember:** You can edit anytime, rollback changes, and never lose data!

---

**Created by:** Alina
**Last Updated:** May 22, 2026
**Version:** 1.1
