# QA Checklist - UI API Refactor

## Quick Verification Steps

### ✅ 1. Basic Upload Flow (Complaints)

**Steps:**
1. Navigate to `/upload` page
2. Click on "Complaints" tab
3. Click "Select Files" and choose a complaints Excel file
4. Click "Upload" button
5. Wait for upload progress

**Expected Results:**
- ✅ File uploads successfully
- ✅ Progress bar shows 100% completion
- ✅ Success indicator appears (green checkmark)
- ✅ Stored counts update (e.g., "X complaints stored")
- ✅ No error messages

**What to Check:**
- [ ] Upload button works
- [ ] Progress indicator shows
- [ ] Success state appears
- [ ] Counts update correctly
- [ ] No console errors

---

### ✅ 2. API Mode (Postgres Backend)

**Prerequisites:**
- Set `DATA_BACKEND=postgres` in `.env.local`
- Set `DATABASE_URL` to valid Postgres connection
- Run migration: `pnpm db:migrate`

**Steps:**
1. Navigate to `/upload` page
2. Upload a complaints file
3. Open Prisma Studio: `pnpm db:studio`
4. Check `complaints` table

**Expected Results:**
- ✅ Complaints saved to database
- ✅ Data visible in Prisma Studio
- ✅ User ID set correctly (from `x-demo-user` header)
- ✅ All fields populated correctly

**What to Check:**
- [ ] Data appears in database
- [ ] userId field is set
- [ ] All complaint fields are correct
- [ ] No duplicate entries

---

### ✅ 3. Local Mode Fallback (IndexedDB)

**Prerequisites:**
- Set `DATA_BACKEND=local` in `.env.local` (or remove `DATABASE_URL`)

**Steps:**
1. Navigate to `/upload` page
2. Upload a complaints file
3. Open browser DevTools → Application → IndexedDB
4. Check `qos-et-datasets` database → `complaints` store

**Expected Results:**
- ✅ Complaints saved to IndexedDB
- ✅ Data visible in browser storage
- ✅ Counts update correctly
- ✅ No error messages (or warning about local mode)

**What to Check:**
- [ ] Data appears in IndexedDB
- [ ] Counts update
- [ ] No errors in console
- [ ] UI works normally

---

### ✅ 4. API Error Handling (Fallback)

**Prerequisites:**
- Set `DATA_BACKEND=postgres` but use invalid `DATABASE_URL`
- OR stop the Next.js server temporarily

**Steps:**
1. Navigate to `/upload` page
2. Upload a complaints file
3. Observe error handling

**Expected Results:**
- ✅ API call fails gracefully
- ✅ Automatic fallback to IndexedDB
- ✅ Error message shown: "Saved to local storage (API unavailable)"
- ✅ Data still saved successfully
- ✅ No crash or blocking error

**What to Check:**
- [ ] Error message appears
- [ ] Fallback works automatically
- [ ] Data saved to IndexedDB
- [ ] User can continue working
- [ ] No console errors (or only expected warnings)

---

### ✅ 5. KPI Calculation with API

**Prerequisites:**
- Upload both complaints AND deliveries files
- Use API mode (`DATA_BACKEND=postgres`)

**Steps:**
1. Upload complaints file (wait for success)
2. Upload deliveries file (wait for success)
3. Click "Calculate KPIs" button
4. Wait for calculation to complete

**Expected Results:**
- ✅ KPIs calculated successfully
- ✅ Data loaded from API (not IndexedDB)
- ✅ Results displayed correctly
- ✅ KPIs saved to localStorage (for dashboard)

**What to Check:**
- [ ] Calculation completes
- [ ] KPIs displayed correctly
- [ ] No errors in console
- [ ] Data source is API (check network tab)

---

### ✅ 6. KPI Calculation with Local Fallback

**Prerequisites:**
- Use local mode (`DATA_BACKEND=local`)
- Upload both complaints AND deliveries files

**Steps:**
1. Upload complaints file
2. Upload deliveries file
3. Click "Calculate KPIs" button
4. Wait for calculation

**Expected Results:**
- ✅ KPIs calculated successfully
- ✅ Data loaded from IndexedDB
- ✅ Results displayed correctly
- ✅ KPIs saved to localStorage

**What to Check:**
- [ ] Calculation completes
- [ ] KPIs displayed correctly
- [ ] No errors
- [ ] Data source is IndexedDB

---

### ✅ 7. Multiple File Upload

**Steps:**
1. Navigate to `/upload` page
2. Select multiple complaints files
3. Click "Upload"
4. Wait for all files to process

**Expected Results:**
- ✅ All files processed
- ✅ All complaints saved
- ✅ Counts reflect total from all files
- ✅ No duplicate errors

**What to Check:**
- [ ] All files upload
- [ ] Total count is correct
- [ ] No duplicates
- [ ] Success indicators show

---

### ✅ 8. Large File Upload

**Steps:**
1. Upload a large complaints file (1000+ rows)
2. Wait for processing

**Expected Results:**
- ✅ File processes successfully
- ✅ All complaints saved
- ✅ No quota errors
- ✅ Performance acceptable (< 30 seconds for 1000 rows)

**What to Check:**
- [ ] Large file uploads
- [ ] No timeout errors
- [ ] All data saved
- [ ] Performance acceptable

---

### ✅ 9. Network Error Simulation

**Steps:**
1. Open browser DevTools → Network tab
2. Set network throttling to "Offline"
3. Try to upload a complaints file
4. Restore network
5. Try again

**Expected Results:**
- ✅ First attempt fails gracefully
- ✅ Error message shown
- ✅ After network restored, upload succeeds
- ✅ No data loss

**What to Check:**
- [ ] Error handling works
- [ ] Retry works after network restored
- [ ] No crashes

---

### ✅ 10. Browser Refresh Persistence

**Steps:**
1. Upload complaints file
2. Refresh browser page
3. Check stored counts

**Expected Results:**
- ✅ Data persists after refresh
- ✅ Counts still show correct values
- ✅ No data loss

**What to Check:**
- [ ] Data persists (API mode: in database, Local mode: in IndexedDB)
- [ ] Counts correct after refresh
- [ ] No errors on reload

---

## Critical Paths to Test

### 🔴 Must Work (Blocking Issues)

1. **Upload complaints file** → Must save successfully
2. **Calculate KPIs** → Must work with uploaded data
3. **API fallback** → Must work when API unavailable
4. **No data loss** → Data must persist after refresh

### 🟡 Should Work (Nice to Have)

1. **Error messages** → Clear and helpful
2. **Loading states** → Show progress
3. **Performance** → Acceptable for large files
4. **Multiple files** → Handle batch uploads

---

## Known Limitations

1. **Deliveries not migrated** → Still use IndexedDB only
2. **No optimistic updates** → Data saved synchronously
3. **No retry UI** → Manual refresh needed if API fails
4. **Count updates** → Updated after save (not optimistic)

---

## Quick Test Script

```bash
# 1. Start dev server
pnpm dev

# 2. In another terminal, check API health
curl -X GET "http://localhost:3005/api/complaints" \
  -H "x-demo-user: test-user"

# 3. Upload a file via UI
# Navigate to http://localhost:3005/upload
# Select complaints file and upload

# 4. Verify in database (if using Postgres)
pnpm db:studio
# Check complaints table

# 5. Verify in IndexedDB (if using local)
# Open DevTools → Application → IndexedDB → qos-et-datasets
```

---

## Success Criteria

✅ **All critical paths work**
✅ **No data loss**
✅ **Graceful error handling**
✅ **Backward compatibility maintained**
✅ **Type safety preserved**

---

## Reporting Issues

If you find issues, note:
1. **Steps to reproduce**
2. **Expected vs actual behavior**
3. **Console errors** (if any)
4. **Network tab** (for API calls)
5. **Backend mode** (API or Local)
6. **Browser/OS** information
