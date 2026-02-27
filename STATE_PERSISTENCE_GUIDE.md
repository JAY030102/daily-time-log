# State Persistence Guide - Daily Time Log

## Overview

The Daily Time Log app now features a **stateless architecture** with comprehensive state persistence. This means:

- **Form data persists** across page navigation without losing your input
- **Auto-save enabled** - your data is saved automatically every 500ms as you type
- **Survives reloads** - refresh the page and your draft is still there
- **Database persistence** - submitted records are stored in SQLite (mobile) or localStorage (web)

## Architecture

### Two-Layer State Management

The app uses a two-layer persistence strategy:

#### 1. **Draft State (In-Memory + localStorage)**
- **What**: Form data you're currently editing
- **Where**: React Context (in-memory) + localStorage (persistence)
- **When**: Auto-saved every 500ms as you type
- **Survives**: Page navigation, browser reload, app restart
- **Cleared**: Only when you click "Clear" button

#### 2. **Submitted Records (SQLite/localStorage)**
- **What**: Completed time records you've saved
- **Where**: SQLite database (mobile) or localStorage (web)
- **When**: Saved explicitly when you click "Save Record"
- **Survives**: Device restart (mobile), browser cache clear
- **Cleared**: Only when you delete individual records

## How It Works

### Flow Diagram

```
User Input
    ↓
Form Context (in-memory)
    ↓ (every keystroke)
localStorage (debounced 500ms)
    ↓ (explicit save click)
SQLite (mobile) / localStorage (web)
    ↓
History View (loads from database)
```

### Step-by-Step Example

1. **User opens Record Page**
   ```
   App loads → FormContext initializes → localStorage loads saved draft → Form displays draft data
   ```

2. **User types "09:00" in Morning In field**
   ```
   Input onChange → FormContext updates → localStorage debounce timer starts
   (After 500ms of no changes) → localStorage auto-saves "09:00"
   ```

3. **User navigates to History page**
   ```
   Navigation change → Form data stays in FormContext → HistoryPage loads records from SQLite
   (Navigate back to Record Page) → Form data still there from Context
   ```

4. **User clicks "Save Record"**
   ```
   onClick → Validates form → Saves to both localStorage (legacy) and SQLite
   → Toast confirmation → Form data remains for editing next record
   ```

5. **Page reload (or app restart)**
   ```
   App initializes → localStorage loads draft → Form is restored exactly as before
   → User can continue editing
   ```

## Components

### `useLocalStorage` Hook
**File**: `src/hooks/useLocalStorage.ts`

Custom React hook that manages a single key-value pair in localStorage with debouncing.

```typescript
// Usage
const [value, setValue, clearValue] = useLocalStorage('my-key', defaultValue);

// Auto-saves after 500ms of inactivity
setValue(newValue);

// Clears both state and localStorage
clearValue();
```

**Features**:
- Debounced saves (500ms)
- Automatic loading from localStorage on mount
- Error handling for quota exceeded
- Cleanup on unmount

### `FormContext` & `useForm` Hook
**File**: `src/contexts/FormContext.tsx`

Global context for managing the entire form state across pages.

```typescript
const { formData, setFormData, updateField, clearForm } = useForm();

// Update single field
updateField('morningIn', '09:00');

// Update entire form
setFormData({ date, morningIn, lunchOut, afternoonIn, eveningOut });

// Clear draft (only resets form, keeps submitted records)
clearForm();
```

**Data Structure**:
```typescript
interface FormState {
  date: string;           // YYYY-MM-DD
  morningIn: string;      // HH:mm
  lunchOut: string;       // HH:mm
  afternoonIn: string;    // HH:mm
  eveningOut: string;     // HH:mm
}
```

### `sqlite-db.ts` Database Layer
**File**: `src/lib/sqlite-db.ts`

Abstraction layer for database operations that switches between Capacitor SQLite (mobile) and localStorage (web).

```typescript
// Initialize on app startup
initializeDatabase();

// Save a record
await saveRecord(timeRecord);

// Load all records
const records = await getAllRecords();

// Delete a record
await deleteRecordById(recordId);
```

**Platform Detection**:
- Automatically detects if running in Capacitor environment
- Uses SQLite on mobile, localStorage fallback on web
- Transparent to the rest of the app

## Usage Examples

### Example 1: Simple Form Input
```tsx
import { useForm } from '@/contexts/FormContext';

function TimeInput() {
  const { formData, updateField } = useForm();
  
  return (
    <input
      value={formData.morningIn}
      onChange={(e) => updateField('morningIn', e.target.value)}
      placeholder="09:00"
    />
  );
  // Data auto-saves after 500ms, persists on reload
}
```

### Example 2: Saving a Record
```tsx
import { saveRecord } from '@/lib/sqlite-db';
import { useForm } from '@/contexts/FormContext';

function SaveButton() {
  const { formData, clearForm } = useForm();
  
  const handleSave = async () => {
    try {
      await saveRecord({
        id: crypto.randomUUID(),
        ...formData,
        createdAt: new Date().toISOString(),
      });
      // Form draft persists, ready for next entry
    } catch (error) {
      console.error('Save failed:', error);
    }
  };
  
  return <button onClick={handleSave}>Save</button>;
}
```

### Example 3: Loading Records
```tsx
import { useEffect, useState } from 'react';
import { getAllRecords } from '@/lib/sqlite-db';

function History() {
  const [records, setRecords] = useState([]);
  
  useEffect(() => {
    getAllRecords().then(setRecords);
  }, []);
  
  return records.map(record => <RecordCard key={record.id} record={record} />);
}
```

## Data Storage Details

### Web Browser
```
localStorage:
├── dtr-form-draft      // Current form being edited
└── dtr-records         // Submitted records (legacy)
```

**Storage Limit**: ~5-10MB per domain
**Persistence**: Until manually cleared

### Android APK
```
SQLite Database (on device):
├── dtr_database.db
│   ├── time_logs table
│   │   ├── id (TEXT PRIMARY KEY)
│   │   ├── date (TEXT UNIQUE)
│   │   ├── morningIn, lunchOut, afternoonIn, eveningOut (TEXT)
│   │   └── createdAt (TEXT)
```

**Storage Limit**: Limited by device storage
**Persistence**: Survives app uninstall (can recover from backup)

## Performance Considerations

### Debouncing
- **500ms delay**: Balances between responsiveness and database writes
- **Prevents thrashing**: Avoids excessive localStorage writes
- **Auto-save confirmation**: Check browser logs with `[v0] Auto-saved...` messages

### Large Datasets
- **Current impl**: No pagination (suitable for 100s of records)
- **For 1000+ records**: Consider implementing pagination in HistoryPage
- **Database performance**: SQLite is optimized for local queries

## Debugging

### Enable Verbose Logging
Check your browser console for debug messages:
```
[v0] Auto-saved to localStorage: dtr-form-draft
[v0] Record saved to database: 2024-02-27
[v0] Cleared localStorage: dtr-form-draft
```

### Inspect Stored Data

**Browser localStorage**:
```javascript
// In DevTools Console
console.log(JSON.parse(localStorage.getItem('dtr-form-draft')));
console.log(JSON.parse(localStorage.getItem('dtr-records')));
```

**Mobile SQLite** (via Android Studio):
1. Open Android Studio
2. View → Tool Windows → Device File Explorer
3. Navigate to: `/data/data/com.dailytimelog.app/databases/`
4. Right-click `dtr_database.db` → Save As to inspect

## Common Issues

### Form Data Lost After Navigation
**Cause**: FormProvider not wrapping all pages
**Solution**: Ensure `<FormProvider>` wraps entire app in `src/App.tsx`

### Data Not Auto-Saving
**Check**:
1. Browser console shows `[v0] Auto-saved` messages?
2. Is localStorage enabled in browser settings?
3. Is there enough storage space (5+ MB free)?

### Different Data Between Web and APK
**Expected behavior**: Web and APK have separate databases
- Web uses browser localStorage
- APK uses device SQLite
- To sync: Manually enter data in both versions

### "Clear" Button Not Clearing
**Check**: 
1. Clears form visually on screen
2. Clears localStorage (confirmed in DevTools)
3. Doesn't clear submitted records (only draft)

## Future Enhancements

Possible improvements:
- [ ] Cloud sync (backup to server)
- [ ] Data export (CSV/JSON)
- [ ] Conflict resolution for multi-device
- [ ] Encryption for sensitive data
- [ ] Automatic backups

## Migration from Previous Version

If upgrading from old localStorage-only app:

1. **Run migration once**:
   ```bash
   npm run migrate-to-sqlite
   ```

2. **Old data location**:
   - `localStorage['dtr-records']` → `SQLite time_logs table`

3. **Clear old data** (optional):
   - After migration verified
   - `localStorage.removeItem('dtr-records')`

---

For questions or issues, check the debug logs and browser console.
