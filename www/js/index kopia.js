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
 
/*
var _self.myScroll = null,
		_self.isLoaded = false,
		_self.scrollCanceled = null,
		_self.slides = null,
		_self.currentPageIndex = 0,
		_self.options = { 
			scrollX: true, 
			scrollY: false, 
			momentum: false, 
			mouseWheel: false, 
			snap: 'li'
		};
*/

var _self;

var _page;

/*
var appPage = function(id) {
	init: function() {
		this.id = id;
		this.obj =  document.getElementById(id);
		this.video = null;
		this.poster = null;
		this.playingStage = 'init';
	},
	
}
*/

var appPage = function (id) {
	this.id = id;
	this.obj =  document.getElementById(id);
	this.video = null;
	this.poster = null;
	this.playingStage = 'init';
};

appPage.prototype.init = function() {
  this.video = this.obj.querySelector('.video');
  this.poster = this.obj.querySelector('.video-poster');
};

appPage.prototype.togglePoster = function() {
	if ( this.playingStage == 'init' || this.playingStage == 'stopped' ) {
		this.poster.className = this.poster.className + ' hidden';
	} else {
		this.poster.className = 'video-poster';
	}
};

appPage.prototype.start = function() {  
  this.togglePoster();
  this.playingStage = 'playing';
  this.video.play();
};

appPage.prototype.resume = function() {
  this.playingStage = 'pause';
  this.video.pause();
};
 
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
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
	    	document.querySelector('#wrapper').setAttribute('class', 'loaded');
	    	document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
	    	window.addEventListener('resize', _self.onResize, true);
        _self.isLoaded = true;
				_self.slides = document.querySelectorAll('#scroller li');
				//_self.initVideo();
				_self.loadScroll( true );
				
				for (var i=1;i<4;i++) {
					_self.pages[i] = new appPage('page0'+i);
					_self.pages[i].init();
				}
				_self.pages[2].start();
    },
    startPage: function(page) {
	    var video = page.querySelector('.video');
			var poster =  page.querySelector('.video-poster');
			
			video.play();
			video.addEventListener('loadeddata', function() {
				setTimeout(function(){
					if ( !poster.classList.contains('hidden') ) poster.className = poster.className + ' hidden';
				}, 100); 
			});
    },
		initVideo: function() {
			
			// DO THIS INIT CURRENT SLIDE INSTEAD
			
			for (var i=0;i<_self.slides.length;i++) {
				var page = _self.slides[i];

				page.addEventListener('touchend', function(e){
			    _self.startPage( e.target ); // target is <li> because all child elements have prop 'pointer-events: none'
		    }, false);
				
				/*
				page.addEventListener('ended', function(){
			    alert("video ended");
		    }, false);
		    
				
		    // PAUSE AT GIVEN TIME
		    video.addEventListener("timeupdate", function(){
				  if(this.currentTime >= 5 * 60 * 1000) {
				    this.pause();
				  }
				}
				*/
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
				var video = _self.slides[i].querySelector('.video');
				var poster =  _self.slides[i].querySelector('.video-poster');
				
				if ( !poster.classList.contains('hidden') ) poster.className = 'video-poster';
				
				video.pause();
				video.currentTime = '0';
			}
		},
		
		initCurrentPage: function(index) {
			_self.resetAllSlides();
			
/*
			var video = _self.slides[index].querySelector('.video');
			video.pause();
			video.currentTime = '0';
			video.play();
*/
			
			console.log( 'scrolled to page: ' + index );
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

/*
function rewind(rewindSpeed) {    
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
           video.currentTime = Math.max(startVideoTime - elapsed*rewindSpeed/1000.0, 0);
       }
   }, 30);
}
*/