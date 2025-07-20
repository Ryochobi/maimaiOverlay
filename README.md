# How to use
This repository contains 4 branches that are all different from each other.

**Branches**
- overlay-master: This is the Web Application that is loaded into OBS Browser Source. It's currently configured to receive messages. **This needs to be ran under localhost:3000 so please run this first**
- control-master: This is where you change values for the Overlay. It is configured to send WebSocket messages that will alter the state of the overlay-master application. **This needs to be ran under localhost:3001 so please run this after overlay-master**
- websocket: Serves as the backend for both web applications. You can run this in any order
- zetarakuSongExtract: Just a node code that scrapes the songData from zetaraku's website

# What you need to make these run
- Node
- NPM
- VS Code
- Git

# Using your custom design
- OBS Overlays are always set to 1920x1080, provide your custom PNG
- Ex: You want to change the background of "PlayerView", you need to replace **"/public/overlay/PlayerView.png"** with your own file and play with the .scss file to realign where the labels that will dynamically change from the control

# Roadmap
## Control
- Better implementation for song search
- Better UI
- Tournament bracket
- Support for better fields
- Better field filtering

## Overlay
- Song Information View
- Animated transitions for player names
- Total score with player names if necessary
