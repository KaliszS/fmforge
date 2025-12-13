# Football Manager Forge

<p align="center">
  <img src="static/icon.png" width="128" height="128" alt="FM Forge Icon"/>
</p>

<p align="center">
  <b>A powerful editor for Football Manager .edt files, designed for managing regens for custom databases.</b>
</p>

<p align="center">
  <img src="static/showcase.png" width="1000" alt="Editor Showcase"/>
</p>

---

**Football Manager Forge** is a modern, cross-platform tool built to simplify the process of editing `.edt` files for the Football Manager series. These files are used to configure **regens** (newly generated players) before starting a new game.

### ❓ What are Regens?
Regens are players who are not yet born or are too young (under 15/16) to be legally included in the game database at the start. Instead, they are programmed to appear in the game world at a later date. FM Forge allows you to define these future stars, setting their potential, attributes, and personal details so they emerge exactly as you planned.

> **Note**: `.edt` files are loaded by the game only when starting a new career. Changes made here will not affect existing save games.

## 🚀 Features

### 🔍 Scout & Search
- **Advanced Filtering**: Search players by Current Ability (CA), Potential Ability (PA), Nationality, Club, Age, Preferred Foot, and more.
- **Smart Querying**: Find players instantly by name (including wildcard `*` usage and ignoring special letters)
- **Pagination**: Efficiently browse through thousands of player records.
- **View Modes**: Switch between `Scout` (list view) and `Analyst` (dashboard view).

### ✏️ Player Editing
- **Full edit**: Click red "edit"" icon on the right to switch player row into edit mode.
- **Quick Edit**: Double-click any field to instantly modify only clicked player details.
- **Mass Edit**: Select multiple players to apply changes in bulk.
- **Full Attribute Control**: Modify CA, PA, Height, Weight, and more (up to 19 fields).
- **Commit System**: Changes are tracked visually (color-coded for modified, added, or deleted) and are only permanent when saved to the file (you always have visual indicator how many influenced by your modifications players waiting to get saved).

### 📊 Analyst Dashboard
A comprehensive suite of tools to visualize your database balance:
- **Overview**: Summary cards showing top nationalities, clubs, and key attribute averages.
- **Geography**: Interactive breakdown of player nationalities with sorting options (Count vs. A-Z).
- **Clubs**: Analysis of club representation in your database.
- **Positional**: Distribution of players across different field positions.
- **Physical**: Analysis of height and weight trends.
- **Abilities**: CA and PA distribution charts.
- **Temporal**: Birth year analysis to ensure a steady stream of talent.

### 💾 File Management
- **Multi-File Loading**: Load multiple `.edt` files simultaneously to merge or cross-reference databases.
- **Retro Database Support**: Built-in tools to convert birth dates between "Real Life" years and "In-Game" years for retro scenarios.
- **Flexible Saving**: Choose to save the entire database or only the currently filtered/selected players.
- **Validation**: Automatic detection of invalid rows or data inconsistencies.

### 🎨 Modern UI/UX
- **Dark & Light Themes**: Toggle between themes to suit your environment.
- **Responsive Design**: Clean, grid-based layout for efficient data entry.
- **Cross-Platform**: Built with Tauri and Svelte for native performance on macOS, Windows, and Linux.

## 🛠️ Tech Stack
- **Frontend**: Svelte 5, TypeScript, Vite
- **Backend**: Rust (Tauri)