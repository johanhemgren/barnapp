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

/*
var createObj = function(id) {
	this.obj = document.getElementById(id),
	this.func = function() {
		console.log( this.obj );
	},
}

var testObj = new createObj('console');
testObj.func();
*/

var appPage = {
	init: function(id) {
		_this: this,
		obj =  document.getElementById(id),
		isCurrent = false,
		video = null,
		poster = null,
		backgroundSound = null,
		isLoaded = false,
		playState = 'init', // init | start | resume | paused | ended
		pauseState = {
			loop: false,
			start: 1.8,
			end: 2.0
		},
		
	  _this.video = _this.obj.querySelector('.video');
	  _this.poster = _this.obj.querySelector('.video-poster');
	  _this.backgroundSound = _this.obj.querySelector('.background-sound');
	  
	  if ( _this.video !== null ) {
		  _this.obj.addEventListener('touchend', _this.onTouchEnd, false);
			_this.video.addEventListener('ended', _this.onVideoEnded, false);
			_this.video.addEventListener('loadeddata', _this.onVideoLoaded, false);
			_this.video.addEventListener("timeupdate", _this.onTimeUpdate, false);
	  }
	},
	
	onTouchEnd: function(e){
		
		if ( ths.playState == 'paused' || ths.playState == 'paused' ) {
			_this.resume();
		}
	},
	
	onVideoEnded: function() {
		_this.playState == 'ended'
	},
	
	onVideoLoaded: function() {
		_this.isLoaded = true;
	},
	
	onTimeUpdate: function() {
		if (_this.pauseState.loop == true) {
			if (_this.playState != 'resume'  && _this.video.currentTime >= _this.pauseState.end) {
				_this.loop();
			}
		} else {
			if (_this.video.currentTime >= _this.pauseState.start && _this.video.currentTime < _this.pauseState.start+0.2) {
				_this.pause();
			}
		}
	},
	
	hidePoster: function(hide) {
		hide = typeof hide !== 'undefined' ? hide : true;
		if ( hide ) {
			var ths = this;
			setTimeout(function(){
				ths.poster.className = ths.poster.className + ' hidden';
			}, 100);
		} else {
			_this.poster.className = 'video-poster';
		}
	},
	
	start: = function() {
	  _this.video.currentTime = 0;
	  _this.video.play(); 
	  
	  if ( _this.backgroundSound !== null ) {
		  _this.backgroundSound.currentTime = 0;
		  _this.backgroundSound.play();
	  }
	  
	  _this.hidePoster(true);
	  _this.playState = 'start';
	},
	
	resume: function() {
	  _this.video.play();
	  _this.playState = 'resume';
	},
	
	reset: function() {
		_this.hidePoster(false);
		_this.video.pause();
		_this.video.currentTime = 0;
		_this.playState = 'init';
	},
	
	pause: function() {  
	  _this.video.pause();
	  _this.playState = 'paused';
	},
	
	loop: function(start,end) {
		_this.video.currentTime = _this.pauseState.start;
		_this.playState = 'paused';
	},
};

	/*
	_this.rewind(speed) = function() {   
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
					_self.pages[i] = new appPage();
					_self.pages[i].init('page0'+i);
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