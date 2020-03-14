paella.addPlugin(function () {
	return class GTMTracker extends paella.userTracking.SaverPlugIn {
		getName() { return "de.bht.paella.usertracking.gtmTrackerPlugin"; }

		checkEnabled(onSuccess) {
			var containerID = this.config.containerID;
			var enabled = true;
			this.standaloneMode = false;
			
		
			if (typeof containerID === 'string' && containerID.length >= 1) {
				this.standaloneMode = true;
				base.log.debug("GTM Container ID found. Enabling Standalone-Mode.");
				window.dataLayer = window.dataLayer || [];
				(function (w, d, s, l, i) {
					w[l] = w[l] || []; w[l].push({'gtm.start': new Date().getTime(), event: 'gtm.js'}); 
					var f = d.getElementsByTagName(s)[0],
						j = d.createElement(s), dl = l != 'dataLayer' ? '&l=' + l : ''; j.async = true; j.src =
							'https://www.googletagmanager.com/gtm.js?id=' + i + dl; f.parentNode.insertBefore(j, f);
				})(window, document, 'script', 'dataLayer', containerID);
			}
			else if (typeof containerID === 'string' && containerID.length == 0) {
				base.log.debug("No GTM Container ID found. Enabling Joined-Mode.");
				enabled = true;
			} else {
				base.log.debug("Not a valid Container ID String. Disabling Plugin.");
				enabled = false;
			}
			onSuccess(enabled);
		}

		setup() {
			var segments = 100;
			var segmentsArray = [];

			paella.events.bind(paella.events.timeUpdate, function (event, params) {
				var bool = true;
				for (var i = 0; i < segments; i++) {
					if (bool) {
						if (params.currentTime >= ((params.duration / segments) * i)) {
						} else {
							bool = false;
							if (segmentsArray.indexOf(i) != -1) {
							} else {
								segmentsArray.push(i);
								window.dataLayer.push({ 'event': 'ui_newSegment', 'pp-segment': i });
							}
						}
					}
				}
			});
		}

		pushEvent(params) {
			if(this.standaloneMode){
				window.dataLayer.push(params);
			} else {
				parent.dataLayer.push(params);
			}
		}

		log(event, params) {
			switch (event) {
				case paella.events.play:
						this.pushEvent({ 'event': 'ui_play' });
					break;
				case paella.events.pause:
					this.pushEvent({ 'event': 'ui_pause' });
					break;
				case paella.events.endVideo:
						this.pushEvent({ 'event': 'ui_videoEnd' });
					break;
				case paella.events.enterFullscreen:
						this.pushEvent({ 'event': 'ui_fullscreenEnter' });
					break;
				case paella.events.exitFullscreen:
						this.pushEvent({ 'event': 'ui_fullscreenExit' });
					break;
				case paella.events.setVolume:
					if (params.master) {
						this.pushEvent({ 'event': 'ui_setVolume', 'pp-volume': Number(params.master) });
					}
					break;
				case paella.events.setProfile:
					if(params){
						this.pushEvent({ 'event': 'ui_setProfile', 'pp-profile': params });
					}	
					break;
				case paella.events.resize:
					if(params){
						this.pushEvent({ 'event': 'ui_resize', 'pp-width': Number(params.width), 'pp-height': Number(params.height) });
					}
					break;
				case paella.events.qualityChanged:
					var qualityCurrent;
					paella.player.videoContainer.getCurrentQuality().then(function(quality) {
						if(quality){
							qualityCurrent = quality.shortLabel()
						}
					  }) 
					  this.pushEvent({ 'event': 'ui_setQuality', 'pp-quality': qualityCurrent });
					break;				
			}
		}
	}
});