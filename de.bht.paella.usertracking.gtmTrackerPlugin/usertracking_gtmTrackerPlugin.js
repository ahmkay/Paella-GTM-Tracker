paella.addPlugin(function () {
  return class GTMTracker extends paella.userTracking.SaverPlugIn {
    getName() {
      return 'es.upv.paella.usertracking.gtmTrackerPlugin';
    }

    checkEnabled(onSuccess) {
      var containerID = this.config.containerID;
      this._containerID = this.config.containerID;
      if (containerID) {
        window.dataLayer = window.dataLayer || [];
        console.log('CONTAINER: ' + containerID);
        (function (w, d, s, l, i) {
          w[l] = w[l] || [];
          w[l].push({
            'gtm.start': new Date().getTime(),
            event: 'gtm.js',
          });
          var f = d.getElementsByTagName(s)[0],
            j = d.createElement(s),
            dl = l != 'dataLayer' ? '&l=' + l : '';
          j.async = true;
          j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
          f.parentNode.insertBefore(j, f);
        })(window, document, 'script', 'dataLayer', containerID);
        onSuccess(true);
      } else if(containerID && !containerID.startsWith("GTM-")){
        base.log.debug('GTM Container ID is wrong. Please fill in correct ID!');
        onSuccess(false);
      } else {
        base.log.debug('No GTM Container ID found in config file. Setting up Standalone-Mode');
        onSuccess(true);
      }
    }

    setup() {
      var segments = 100;
      var segmentsArray = [];
      paella.events.bind(paella.events.timeUpdate, function (event, params) {
        var bool = true;
        for (var i = 0; i < segments; i++) {
          if (bool) {
            if (params.currentTime >= (params.duration / segments) * i) {
            } else {
              bool = false;
              if (segmentsArray.indexOf(i) != -1) {
              } else {
                segmentsArray.push(i);
                var myNumber = i;
                var formattedNumber = ('0' + myNumber).slice(-2);

                if(window.dataLayer){
                  window.dataLayer.push({ event: 'ui_newSegment', 'pp-segment': formattedNumber, });
                } else {
                  window.parent.postMessage({ event: 'ui_newSegment', 'pp-segment': formattedNumber, }, '*');
                }
              }
            }
          }
        }
      });
    }

    sendEvent(msg) {
      if(this.config.containerID.length){
        window.dataLayer.push(msg);
      } else {
        window.parent.postMessage(msg, '*');
      }
    };

    log(event, params) {
      switch (event) {
        case paella.events.play:
          this.sendEvent({ event: 'ui_play' });
          break;
        case paella.events.pause:
          this.sendEvent({ event: 'ui_pause' });
          break;
        case paella.events.endVideo:
          this.sendEvent({ event: 'ui_videoEnd' });
          break;
        case paella.events.enterFullscreen:
          this.sendEvent({ event: 'ui_fullscreenEnter' });
          break;
        case paella.events.exitFullscreen:
          this.sendEvent({ event: 'ui_fullscreenExit' });
          break;
        case paella.events.setVolume:
          if (params.master) {
            this.sendEvent({ event: 'ui_setVolume', 'pp-volume': Number(params.master), });
          }
          break;
        case paella.events.setProfile:
          if (params) {
            this.sendEvent({ event: 'ui_setProfile', 'pp-profile': params, });
          }
          break;
        case paella.events.resize:
          if (params) {
            this.sendEvent({ event: 'ui_resize', 'pp-width': Number(params.width), 'pp-height': Number(params.height), });
          }
          break;
        case paella.events.qualityChanged:
          var This = this;
          paella.player.videoContainer.getCurrentQuality().then(function (quality) {
              if (quality) {
                This.sendEvent({ event: 'ui_setQuality', 'pp-quality': quality.shortLabel(), });
              }
            });           
          break;
      }
    }
  };
});