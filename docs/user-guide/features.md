# 🛠️ Core Features

## 🔍 Browsing & Filtering

FM Forge provides powerful tools to find exactly the players you are looking for.

### Filters Panel
Click the **Filters** bar to expand the advanced search options.

![Filters Panel Placeholder](../static/docs/filters_panel.png)

- **Name Search**: Type to search by First, Last, or Common name. Supports partial matches.
- **Country**: Filter by nationality.
- **Club**: Filter by current club or favourite club.
- **Position**: Select specific positions (e.g., "Goalkeeper", "Striker").
- **Attributes**: Set ranges for Current Ability (CA) and Potential Ability (PA).
- **Physical**: Filter by Preferred Foot.
- **Personal**: Filter by Birth Year or Favourite Number.

### Sorting
Click any column header to sort the table. Click again to reverse the order.
- **Sortable Columns**: Name, Nationality, Club, CA, PA, Age, Height, Weight.

---

## ✏️ Editing Players

There are three ways to edit player data in FM Forge.

### 1. Quick Edit (Inline)
Perfect for making small adjustments without leaving the list view.
- **Double-click** on any cell in the table (e.g., a player's CA or Club).
- The row will switch to **Edit Mode**.
- Modify the values directly.
- Press **Enter** or click the **Save** icon to confirm.
- Press **Escape** to cancel.

![Quick Edit Placeholder](../static/docs/quick_edit.gif)

### 2. Full Edit
For comprehensive changes to a player's profile.
- Click the **Edit (Pencil)** icon on the right side of a player row.
- All fields become editable.
- You can change:
    - **Personal**: Names, Birth Date, City.
    - **Club**: Current Club, Favourite Club.
    - **Attributes**: CA, PA, Foot, Position.
    - **Appearance**: Ethnicity, Skin Tone, Hair Color, Height, Weight.

### 3. Mass Edit
Apply changes to multiple players at once.
1.  **Select Players**: Use the checkboxes on the left to select players.
    *   *Tip: Use Shift+Click to select a range.*
2.  Click the **"Mass Edit"** button in the floating action bar.
3.  **Configure Changes**:
    *   **Set Value**: Enter a number (e.g., `150`) to set all selected players to that value.
    *   **Relative Change**: Enter `+10` or `-5` to increase/decrease values relative to each player's current stats.
4.  Click **Apply**.

![Mass Edit Placeholder](../static/docs/mass_edit.png)

---

## ➕ Adding & Deleting

### Adding a Player
- Click the **"Add Player"** button in the header.
- A new row will appear at the top of the list.
- Fill in the details and save.

### Deleting a Player
- Click the **Delete (Trash)** icon on a player row.
- The row will be marked for deletion (strikethrough style).
- **Note**: The player is not removed from the file until you **Save**. You can undo the deletion before saving.

---

## 🔄 Change Tracking

FM Forge keeps track of your changes visually:
- **Yellow**: Modified player.
- **Green**: Newly added player.
- **Red**: Player marked for deletion.

The header shows a counter of how many unsaved changes you have.
