---
description: Google Tag Manager Event Tracker for Paella Player
---

# Paella GTM Tracker

## Installataion

Add Plugin to /plugins folder and enable in config.json.
For Standalone-Mode set Google Tag Manager Tracking ID. If no Tracking ID is found, Plugin will run Integrate-Mode and send events to parent Datalayer. 

```text
"de.bht.paella.usertracking.gtmTrackerPlugin": { "enabled": true, "containerID": "GTM-XXXXX" }
```


## Google Tag Manager Setup

Receive the following custom data layer events in GTM:

ui_play  - Play Button pressed__ 
ui_pause - Pause Button pressed__ 
ui_videoEnd - End of video reached__
ui_fullscreenEnter - Enter Fullscreen mode__
ui_fullscreenExit - Exit Fullscreen Mode__
ui_setVolume - Change volume__
ui_setProfile - Change Viewmode__
ui_resize - Resize Player Dimensions__
ui_setQuality - Change video quality__ 
ui_newSegment - new video segment reached__


Custom variables:

pp-height - Player height__
pp-width - Player width__
pp-profile - Dualview Viewing Profile__
pp-quality - Video quality__
pp-segment - Video segments__
pp-volume - Set volume__