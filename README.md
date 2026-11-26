# Cat-JPG-Menu

Custom Garry's Mod menu with cat.jpg-themed visuals, menu styling, loading screen assets, and more than 30 wallpapers.

[Русская версия](README_RU.md)

## About

Cat-JPG-Menu is a customizable menu addon for Garry's Mod.

The original project was developed by **twenty two** and **babzoid1**. This repository preserves the original codebase and continues maintenance for modern Garry's Mod versions.

## Features

* Custom Garry's Mod main menu
* Cat.jpg-themed background collection
* 30+ included wallpapers
* Custom loading screen
* Menu, server browser, and new game page styling
* Included game materials and UI assets
* Animations: page transitions, staggered menu entries, hover effects, popups, loading screen
* "Next wallpaper" button in the navigation bar
* Settings popup (paw button): accent colour (6 presets), animations on/off, seasonal effects, cat wallpapers in every gamemode. Saved to `garrysmod/data/catjpg_menu.txt`
* Snow in winter and falling leaves on Halloween
* Cat wallpapers in every gamemode that has no wallpapers of its own
* Loading screen: random cat background, status line, download progress bar, current file, rotating tips (English / Russian)
* English and Russian interface strings
* Colour grading: vignette and accent tint over the wallpaper, adjustable strength (0-100%) in the settings
* Full dark theme for every page: main menu, new game, servers, addons, dupes, saves, demos, dialogs, search boxes
* Loading indicators in the accent colour: spinner on workshop pages, bar at the top while the server list refreshes
* Cat animations: floating / wiggling logo, Ken Burns slideshow of cats with crossfade on the loading screen
* Loading screen uses the accent colour and grading chosen in the main menu
* Respects the system "reduce motion" setting

## Installation

1. Download the latest release or clone this repository.
2. Place the project folder into your Garry's Mod `garrysmod` directory.
3. Launch Garry's Mod.

Example path:

```text
steamapps/common/GarrysMod/garrysmod/
```

## Updating from an older version

Older versions shipped full copies of the stock menu files (`Menu.css`, `NavBar.css`, templates, `loading.css`, …) and PNG wallpapers. The current version only adds its own files on top of the stock ones, so Garry's Mod updates no longer break the menu.

1. Delete the old `*.png` files from `garrysmod/gamemodes/sandbox/backgrounds/` (the wallpapers are now `.jpg`, 6x smaller).
2. In Steam: Garry's Mod → Properties → Installed Files → **Verify integrity of game files** to restore the stock menu files.
3. Copy the new version into `garrysmod` again.

> After a Garry's Mod update Steam may restore the stock `html/menu.html` and `html/loading.html`. If the cat theme disappears, copy the addon in again.

## How it works

| File | Purpose |
| --- | --- |
| `html/menu.html` | Stock menu page + `catjpg.css`, `catjpg.js` and the wallpaper button |
| `html/css/menu/catjpg.css` | Theme colours and animations, loaded after the stock stylesheets |
| `html/js/menu/catjpg.js` | Wraps the stock `MenuController`: settings popup, accent colours, seasonal effects, wallpaper button; patches `pnlMainMenu:UpdateBackgroundImages()` from Lua so cats show in every gamemode |
| `html/loading.html` | Stock loading screen + `catjpg-loading.css` and `js/catjpg-loading.js` |
| `html/js/catjpg-loading.js` | Random cat background, status, progress bar, current file, tips (wraps the stock `GameDetails`, `SetFilesTotal`, `SetFilesNeeded`, `DownloadingFile`, `SetStatusChanged`) |
| `html/catjpg-loading.css` | Loading screen theme and animations |
| `gamemodes/sandbox/backgrounds/*.jpg` | Main menu wallpapers (picked up by `lua/menu/mainmenu.lua`) |

## Screenshots

![Main menu](https://i.imgur.com/KQ4cs45.png)
![New game](https://i.imgur.com/tRvPOaa.png)
![Servers](https://i.imgur.com/ca96hA7.png)
![Server list](https://i.imgur.com/1FmVkst.png)
![Loading screen](https://i.imgur.com/NWyrgHO.png)
![Spawn menu](https://i.imgur.com/cvByF2n.png)

## Contributing

Issues, suggestions, and pull requests are welcome.

## Credits

Original code and concept by **twenty two** and **babzoid1**.
