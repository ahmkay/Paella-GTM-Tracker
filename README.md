---
description: Google Tag Manager Event Tracker for Paella Player
---

# Paella GTM Tracker

## Installataion

Add Plugin to /plugins folder, enable in config.json.
For Standalone-Mode set Google Tag Manager Tracking ID. If no Tracking ID is found, Plugin will run Integrate-Mode and send events to parent Datalayer. 

```text
"de.bht.paella.usertracking.gtmTrackerPlugin": { "enabled": true, "containerID": "GTM-XXXXX" }

```


## Google Tag Manager Setup

Receive the following custom events in GTM:

ui_play  - Play Button pressed | 
ui_pause - Pause Button pressed | 
ui_videoEnd - End of video reached | 
ui_fullscreenEnter - Enter Fullscreen mode | 
ui_fullscreenExit - Exit Fullscreen Mode | 
ui_setVolume - Change volume | 
ui_setProfile - Change Viewmode | 
ui_resize - Resize Player Dimensions | 
ui_setQuality - Change video quality | 
ui_newSegment - new video segment reached | 