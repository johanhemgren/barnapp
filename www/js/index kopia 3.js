/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
 
var debug = false;

var appPage = function(id) {
	this.obj =  document.getElementById(id);
	this.isCurrent = false;
	this.video = null;
	this.poster = null;
	this.backgroundSound = null;
	this.isLoaded = false;
	this.playState = 'init'; // init | start | resume | paused | ended
	this.pauseState = {
		loop: false,
		start: 2.35,
		end: 3.35
	};
	this.startTime = 0;
	this.elapsedTime = 0;
	this.timer = null;
	
	this.console = null;
};

appPage.prototype.init = function() {
	this.console = document.getElementById('console');
	
  this.video = this.obj.querySelector('.video');
  this.poster = this.obj.querySelector('.video-poster');
  this.backgroundSound = this.obj.querySelector('.background-sound');
  
  if ( this.video !== null ) {
	  this.obj.addEventListener('touchend', this.onTouchEnd.bind(this), false);
		
		this.video.addEventListener('play', this.onVideoPlay.bind(this), false);
		this.video.addEventListener('ended', this.onVideoEnded.bind(this), false);
		this.video.addEventListener('loadeddata', this.onVideoLoaded.bind(this), false);
		// this.video.addEventListener("timeupdate", this.onTimeUpdate.bind(this), false);
  }
};

appPage.prototype.onTouchEnd = function(){
	if ( this.playState == 'paused' ) {
		this.resume();
	} else if (this.playState == 'ended') {
		this.start();
	}
}

appPage.prototype.onVideoEnded = function() {
	this.playState = 'ended'
	if (this.pauseState.loop) this.loop();
}

appPage.prototype.onVideoLoaded = function() {
	this.isLoaded = true;
}

/*
appPage.prototype.onTimeUpdate = function() {
	var time =  new Date().getTime() - this.lastTime;
	time = Math.floor( time / 10 ) / 100;
	
	this.lastTime = new Date().getTime();
	
	this.console.innerHTML = time;
}
*/

/*
appPage.prototype.onTimeUpdate = function() {
	if (this.pauseState.loop) {
		this.loop();
	} else {
		this.pause();
	}
}
*/

appPage.prototype.hidePoster = function(hide) {
	hide = typeof hide !== 'undefined' ? hide : true;
	if ( hide ) {
		var ths = this;
		setTimeout(function(){
			ths.poster.className = ths.poster.className + ' hidden';
		}, 100);
	} else {
		this.poster.className = 'video-poster';
	}
};

appPage.prototype.start = function() {
  this.video.currentTime = 0;
  this.video.play(); 
  
  if ( this.backgroundSound !== null ) {
	  this.backgroundSound.currentTime = 0;
	  this.backgroundSound.play();
  }
  
  this.hidePoster(true);
  this.playState = 'start';
};

appPage.prototype.resume = function() {
  this.video.play();
  this.playState = 'resume';
};

appPage.prototype.reset = function() {
	this.hidePoster(false);
	this.video.pause();
	this.video.currentTime = 0;
	this.playState = 'init';
	
	if ( this.backgroundSound !== null ) {
		this.backgroundSound.pause();
	  this.backgroundSound.currentTime = 0;
  }
};

appPage.prototype.pause = function() {
	//if (this.video.currentTime >= this.pauseState.start && this.video.currentTime < this.pauseState.start+0.2)  {
		console.log( "pause" );
		this.video.pause();
	  this.playState = 'paused';
	//}
};

appPage.prototype.loop = function(start,end) {
	//if (this.playState != 'resume'  && this.video.currentTime >= this.pauseState.end) {
		this.video.currentTime = this.pauseState.start;
		this.video.play();
		this.playState = 'paused';
	//}
};

appPage.prototype.onVideoPlay = function() {
	var _this = this;
	this.startTime = new Date().getTime();
	this.timer = window.setInterval(function() {
		if (_this.playState != 'paused' && _this.playState != 'ended') {
			var time = new Date().getTime() - _this.startTime;
	    _this.elapsedTime = Math.floor( time / 10 ) / 100;
	    
	    if ( _this.pauseState.loop ) {
		    if (_this.playState != 'resume' && _this.elapsedTime >= _this.pauseState.end) _this.loop();
	    } else {
		    if ( _this.elapsedTime >= _this.pauseState.start && _this.elapsedTime <= _this.pauseState.start+0.1 ) _this.pause();
	    }
	    
		} else {
			//clearInterval( _this.timer );
			//var time = new Date().getTime() - _this.startTime;
			//_this.elapsedTime = Math.floor( time / 10 ) / 100;
		}
		
		_this.console.innerHTML = _this.elapsedTime;
	}, 10);
}

/*
	
appPage.prototype.interval = function(start,elapsed) {
	if ( this.playState != 'paused' && this.playState != 'ended' ) {
		var time = new Date().getTime() - start;
    elapsed = Math.floor( time / 100 ) / 10;
    this.elapsed = elapsed;
    
    this.console.innerHTML = this.elapsed;
	} else if ( this.playState == 'ended' ) {
		//clearInterval( this.timer );
		this.elapsed = 0;
	}
}

appPage.prototype.onVideoPlay = function() {
	var start = new Date().getTime();
	this.timer = window.setInterval( this.interval( start, 0 ).bind(this), 100 );
}
	
	
	
appPage.prototype.rewind(speed) = function() {   
   clearInterval(intervalRewind);
   var startSystemTime = new Date().getTime();
   var startVideoTime = video.currentTime;

   intervalRewind = setInterval(function(){
       video.playbackRate = 1.0;
       if(video.currentTime == 0){
           clearInterval(intervalRewind);
           video.pause();
       } else {
           var elapsed = new Date().getTime()-startSystemTime;
           log.textContent='Rewind Elapsed: '+elapsed.toFixed(3);
           video.currentTime = Math.max(startVideoTime - elapsed*speed/1000.0, 0);
       }
   }, 30);
}
*/



var app = {
    // Application Constructor
    initialize: function() {
    	_self = this;
    	_self.myScroll = null,
			_self.isLoaded = false,
			_self.scrollCanceled = null,
			_self.slides = null,
			_self.currentPageIndex = 0,
			_self.options = { 
				scrollX: true, 
				scrollY: false, 
				momentum: false, 
				mouseWheel: false, 
				snap: 'li',
				indicators: [{
					el: document.getElementById('parallax'),
					listenX: true,
					resize: false,
					ignoreBoundaries: true,
					speedRatioX: 1.4
				}]
			};
			_self.pages = [];
      this.bindEvents();
    },
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    onDeviceReady: function() {
	    	document.querySelector('#wrapper').setAttribute('class', 'loaded');
	    	document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
	    	window.addEventListener('resize', _self.onResize, true);
        _self.isLoaded = true;
				_self.slides = document.querySelectorAll('#scroller li');
				//_self.initVideo();
				_self.loadScroll( true );
				
				for (var i=0;i<_self.slides.length;i++) {
					_self.pages[i] = new appPage('page0'+i);
					_self.pages[i].init();
				}
				
				//startFirst();
				_self.pages[0].start();
    },
    startFirst: function() {
			var waitToLoad;
			if ( _self.pages[0].isLoaded ) {
				_self.pages[0].start();
				clearInterval(waitToLoad);
			} else {
				waitToLoad = setInterval(function(){
					startFirst();
				}, 100);
			}
    },
		loadScroll: function( first ) {
			_self.setSlideWidth(window.innerWidth);
			if ( !first ) _self.myScroll.destroy();
			_self.myScroll = new IScroll('#wrapper', _self.options);
			_self.myScroll.on('scrollEnd', _self.onScrollEnd);
			if ( !first ) {
				_self.myScroll.goToPage(_self.currentPageIndex, 0, 0);
				_self.initCurrentPage(_self.currentPageIndex);
			}
			if ( first ) navigator.splashscreen.hide();
		},
		
		setSlideWidth: function(width) {
			for (var i=0;i<_self.slides.length;i++) {
				_self.slides[i].setAttribute('style', 'width:'+width+'px');
			}
		},
		
		resetAllSlides: function() {
			for (var i=0;i<_self.slides.length;i++) {
				if (i != _self.currentPageIndex) _self.pages[i].reset();
			}
		},
		
		initCurrentPage: function(index) {
			_self.resetAllSlides();
			_self.pages[index].start();
		},
		
		onScrollEnd: function() {
			if ( _self.isLoaded ) {
				lastPageIndex = _self.currentPageIndex;
				_self.currentPageIndex = Number(_self.myScroll.currentPage.pageX);
				if ( lastPageIndex != _self.currentPageIndex ) _self.initCurrentPage(_self.currentPageIndex);
			}
		},
		
		onResize: function(event) {
		  if ( _self.isLoaded ) {
			  _self.loadScroll(false);
		  }
		},
};

function onload() {
	app.initialize();
}