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
 
var debug = true;

var appPage = function( page, video, poster, loop, sound, pausetime, doloop, frame, index) {
	this.elem = page;
	this.video = video;
	this.poster = poster;
	this.videoloop = loop;
	this.backgroundSound = sound;
	this.frame = frame;
	this.pauseState = {
		time: pausetime, //3.52,
		loop: doloop,
	};
	this.isLoaded = false;
	this.isCurrent = false;
	this.playState = 'init'; // init | start | resume | paused | ended
	this.hasRunned = false;
	this.index = index;

	this.console = document.getElementById('console');
};

appPage.prototype.init = function() {
	if (debug) this.console.style.display = 'block';

  if ( this.video !== null ) {
		this.elem.addEventListener('touchend', this.onTouchEnd.bind(this), false);
		this.video.addEventListener('ended', this.onVideoEnded.bind(this), false);
		this.video.addEventListener('loadeddata', this.onVideoLoaded.bind(this), false);
		this.video.addEventListener("timeupdate", this.onTimeUpdate.bind(this), false);
  }
};

appPage.prototype.onTouchEnd = function(e){
	// console.log( e.target.getAttribute('data-index') );
	// console.log( this.playState );
	if ( this.playState == 'paused' ) {
		this.resume();
	} else if ( this.playState == 'init' || this.playState == 'ended' ) {
		this.start();
	}
};

appPage.prototype.onVideoEnded = function() {
	this.playState = 'ended'
	if (this.pauseState.loop) this.start();
};

appPage.prototype.onVideoLoaded = function() {
	this.isLoaded = true;
};

appPage.prototype.onTimeUpdate = function() {
	this.console.innerHTML = this.video.currentTime;
	if ( this.video.currentTime >= this.pauseState.time && this.video.currentTime <= this.pauseState.time+0.2 ) {
		this.pause();
		if (this.pauseState.loop) this.loop();
	}
};

appPage.prototype.adjustWidth = function(width) {
	this.elem.setAttribute( 'style', 'width:'+width+'px' );
}

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
	this.video.load();
	this.video.currentTime = 0;
  this.video.play();
  
  if ( !this.hasRunned && this.backgroundSound !== null ) {
		this.backgroundSound.currentTime = 0;
		this.backgroundSound.play();
  }
  
  this.hidePoster(true);
  this.playState = 'start';
  this.hasRunned = true;
};

appPage.prototype.resume = function() {
	this.videoloop.style.opacity = 0;
	this.videoloop.pause();
	
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
	this.video.pause();
	//this.video.currentTime = this.pauseState.time;
  this.playState = 'paused';
};

appPage.prototype.loop = function() {
	this.videoloop.play();
	var _this = this;
	setTimeout(function(){
		_this.videoloop.style.opacity = 1;
	}, 100);
};

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

var pagesObj = {
	tiger: {
		poster: 'video/tiger-poster.jpg',
		video: 'video/tiger.mp4',
		pause: {
			type: 'loop',
			time: 3.45,
			loop: 'video/tiger-loop.mp4',
		},
		sound: 'audio/jungle.mp3',
		frame: 'img/border-leaves.png',
	},
	alpaca: {
		poster: 'video/alpacka-poster.jpg',
		video: 'video/alpacka.mp4',
		pause: {
			type: 'pause',
			time: 4.0,
			loop: null,
		},
		sound: null,
		frame: 'img/border-leaves.png',
	},
	giraff: {
		poster: 'video/giraff-poster.jpg',
		video: 'video/giraff.mp4',
		pause: {
			type: 'pause',
			time: 4.5,
			loop: null,
		},
		sound: null,
		frame: 'img/border-leaves.png',
	},
	orm: {
		poster: 'video/orm-poster.jpg',
		video: 'video/orm.mp4',
		pause: {
			type: 'pause',
			time: 5.0,
			loop: null,
		},
		sound: null,
		frame: 'img/border-leaves.png',
	},
};

var app = {
    // Application Constructor
    initialize: function() {
			_self = this;
			_self.pageContainer = document.getElementById('pages');
			_self.parallaxContainer = document.getElementById('parallax-inner');
    	_self.myScroll = null,
			_self.isLoaded = false,
			_self.scrollCanceled = null,
			_self.currentPageIndex = 0,
			_self.pageCount = 0;
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
	    	document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
	    	window.addEventListener('resize', _self.onResize, true);
        _self.isLoaded = true;
				
/*
				var menu = document.createElement("li");
						menu.setAttribute('class', 'menu');
						menu.setAttribute('style', 'background:red');
				pageContainer.appendChild(menu);
				_self.pageCount++;
*/
				
				for (var key in pagesObj) {
					if (pagesObj.hasOwnProperty(key)) {
						var page = pagesObj[key];

						var newPage = document.createElement("li");
								newPage.setAttribute('class', 'page');
								newPage.setAttribute('data-index', _self.pageCount);
						
						if (page.video!=null) {
							var video = document.createElement("video");
									video.setAttribute('class', 'video');
									video.setAttribute('webkit-playsinline', 'true');
									//video.setAttribute('preload', 'true');
									var video_src = document.createElement("source");
											video_src.setAttribute('src', page.video);
											video_src.setAttribute('type', 'video/mp4');
									video.appendChild(video_src);
							newPage.appendChild(video);
						} else {
							var video = null;
						}
						if (page.pause.type=='loop' && page.pause.loop!=null) {
							var loop = document.createElement("video");
									loop.setAttribute('class', 'video-loop');
									loop.setAttribute('webkit-playsinline','true');
									loop.setAttribute('preload','true');
									loop.setAttribute('loop','true');
									var loop_src = document.createElement("source");
											loop_src.setAttribute('src', page.pause.loop);
											loop_src.setAttribute('type', 'video/mp4');
									loop.appendChild(loop_src);
							newPage.appendChild(loop);
						} else {
							var loop = null;
						}
						if (page.poster!=null) {
							var poster = document.createElement("div");
									poster.setAttribute('class', 'video-poster');
									poster.setAttribute('style', 'background-image:url("'+page.poster+'")');
							newPage.appendChild(poster);
						} else {
							var poster = null;
						}
						if (page.sound!=null) {
							var sound = document.createElement("audio");
									sound.setAttribute('class', 'background-sound');
									sound.setAttribute('loop','true');
									var sound_src = document.createElement("source");
											sound_src.setAttribute('src', page.sound);
											sound_src.setAttribute('type', 'audio/mpeg');
									sound.appendChild(sound_src);
							newPage.appendChild(sound);
						} else {
							var sound = null;
						}
						_self.pageContainer.appendChild(newPage);
						

						var newFrame = document.createElement("div");
								newFrame.setAttribute('class', 'frame');
								var frameInner = document.createElement("div");
										frameInner.setAttribute('class', 'frame-inner');
										frameInner.setAttribute('style', 'background-image:url('+page.frame+')');
								newFrame.appendChild(frameInner);
								newFrame.appendChild(frameInner.cloneNode());
						_self.parallaxContainer.appendChild(newFrame);
						
						_self.pages[_self.pageCount] = new appPage(newPage, video, poster, loop, sound, page.pause.time, page.pause.loop, newFrame, _self.pageCount );
						_self.pages[_self.pageCount].init();
						
						_self.pageCount++;
					}
				}
				
				_self.loadScroll( true );
    },
		loadScroll: function( first ) {
			_self.pages.forEach(_self.adjustWidth);
			if ( !first ) _self.myScroll.destroy();
			_self.myScroll = new IScroll('#wrapper', _self.options);
			_self.myScroll.on('scrollEnd', _self.onScrollEnd);
			if ( !first ) {
				_self.myScroll.goToPage(_self.currentPageIndex, 0, 0);
				_self.initCurrentPage(_self.currentPageIndex);
			}
			if ( first ) navigator.splashscreen.hide();
		},
		adjustWidth: function(el,i,arr){
			el.elem.style.width = window.innerWidth+'px';
			el.frame.style.width = ( window.innerWidth + 200 )+'px';
		},
		resetSiblings: function() {
			_self.pages.forEach(function(el,i){
				if (i != _self.currentPageIndex) el.reset();
			});
		},
		
		initCurrentPage: function(index) {
			_self.resetSiblings();
			_self.pages[index].start();
			
			// console.log( '_self.currentPageIndex: '+_self.currentPageIndex );
			// console.log( '_self.pages[index].index: '+_self.pages[index].index );
		},
		
		swapPages: function(first_to_last){
			var firstPage = _self.pages.shift();
			_self.pages.push(firstPage);
			
			_self.pageContainer.insertBefore( _self.pageContainer.childNodes[0] );
			_self.loadScroll( false );
			_self.currentPageIndex = _self.currentPageIndex-1
			_self.myScroll.goToPage(_self.currentPageIndex, 0, 0);
			_self.initCurrentPage(_self.currentPageIndex);
		},
		
		swapPagesStart: function(){},
		
		onScrollEnd: function() {
			if ( _self.isLoaded ) {
				lastPageIndex = _self.currentPageIndex;
				_self.currentPageIndex = Number(_self.myScroll.currentPage.pageX);
				if ( lastPageIndex != _self.currentPageIndex ) {
					if ( _self.currentPageIndex+1 == _self.pageCount ) {
						console.log( "last page" );
						_self.swapPages(true);
/*
						var tempPage = _self.pages[0].elem;
						tempPage.remove();
						_self.pageContainer.appendChild(tempPage);
						_self.pages[0].elem = tempPage;
						_self.loadScroll(false);
						
*/
						if ( _self.isLoaded ) {
						  _self.loadScroll(false);
					  }
					} else if ( _self.currentPageIndex == 0 ) { 
						console.log( "first page" );
/*
						var tempPage = _self.pages[0].elem;
						_self.pageContainer.removeChild( self.pages[0].elem );
						_self.pageContainer.insertBefore(tempPage, _self.pageContainer.childNodes[0];
*/
					} else {
						_self.initCurrentPage(_self.currentPageIndex);
					}
				}
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