var pagesObj = {
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
	tiger: {
		poster: 'video/tiger-poster.jpg',
		video: 'video/tiger.mp4',
		pause: {
			type: 'loop',
			time: 3.4,
			loop: 'video/tiger-loop.mp4',
		},
		sound: 'audio/jungle.mp3',
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

var appPage = function( page, video, poster, loop, sound, pausetime, doloop, frame, index ) {
	this.elem = page;
	this.video = video;
	this.poster = poster;
	this.videoloop = loop;
	this.backgroundSound = sound;
	this.frame = frame;
	this.pauseState = {
		time: pausetime, 
		loop: doloop,
	};
	this.duration = null;
	this.isLoaded = false;
	this.isCurrent = false;
	this.playState = 'init'; // init | start | resume | paused | ended | loading;
	this.hasRunned = false;
	this.index = index;
};

appPage.prototype.init = function() {
	this.elem.addEventListener('touchend', this.onTouchEnd.bind(this), false);
	this.video.addEventListener('ended', this.onVideoEnded.bind(this), false);
	this.video.addEventListener('loadeddata', this.onVideoLoaded.bind(this), false);
	this.video.addEventListener("timeupdate", this.onTimeUpdate.bind(this), false);
};

appPage.prototype.onTouchEnd = function(e){
	if ( this.playState == 'paused' ) {
		this.resume();
	} else if ( this.playState == 'init' || this.playState == 'ended' ) {
		this.start();
	}
};

appPage.prototype.onVideoEnded = function() {
	this.playState = 'ended';
	if (this.pauseState.loop) this.start();
};

appPage.prototype.onVideoLoaded = function() {
	this.isLoaded = true;
	this.duration = this.video.duration;
	if ( this.playState == 'loading' ) {
		this.start();
	}
};

appPage.prototype.onTimeUpdate = function() {
	if ( this.playState == 'start' && this.video.currentTime >= this.pauseState.time ) {
		this.pause();
		if (this.pauseState.loop) this.loop();
	}
	if ( this.video.currentTime >= this.duration-0.1 ) this.hidePoster(true);
};

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
	this.isCurrent = true;
  if ( this.isLoaded ) {
		if ( !this.hasRunned ) navigator.splashscreen.hide();
	  this.video.currentTime = 0;
	  this.video.play();
	  
	  if ( !this.hasRunned && this.backgroundSound !== null ) {
			this.backgroundSound.currentTime = 0;
			this.backgroundSound.play();
	  }
	  
	  this.hidePoster(true);
	  this.playState = 'start';
	  this.hasRunned = true;
  } else {
	  this.video.load();
	  this.playState = 'loading';
  }
};

appPage.prototype.resume = function() {
	this.videoloop.style.opacity = 0;
	this.videoloop.pause();
	
  this.video.play();
  this.playState = 'resume';
};

appPage.prototype.reset = function() {
	this.hidePoster(false);
	this.isCurrent = false;
	this.isLoaded = false;
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
	this.video.currentTime = this.pauseState.time;
  this.playState = 'paused';
};

appPage.prototype.loop = function() {
	this.videoloop.play();
	var _this = this;
	setTimeout(function(){
		_this.videoloop.style.opacity = 1;
	}, 100);
};

var app = {
    initialize: function() {
			_self = this;
			_self.pageContainer = document.getElementById('pages');
			_self.parallaxContainer = document.getElementById('parallax-inner');
			_self.myScroll = null;
			_self.isLoaded = false;
			_self.scrollCanceled = null;
			_self.currentPageIndex = 0;
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
					speedRatioX: 1.4,
				}],
			};
			_self.pages = [];
			_self.testArr = [];
      _self.bindEvents();
    },
    bindEvents: function() {
        document.addEventListener('deviceready', _self.onDeviceReady, false);
    },
    onDeviceReady: function() {
				document.addEventListener('touchmove', function(e) { e.preventDefault(); }, false);
				window.addEventListener('resize', _self.onResize, true);
        _self.isLoaded = true;
				
				for (var key in pagesObj) {
					if (pagesObj.hasOwnProperty(key)) {
						var page = pagesObj[key];
						var video = null,
								loop = null,
								poster = null,
								sound = null;

						var newPage = document.createElement("li");
								newPage.setAttribute('class', 'page');
								newPage.setAttribute('data-index', key);
						
						if (page.video!=null) {
							video = document.createElement("video");
								video.setAttribute('class', 'video');
								video.setAttribute('webkit-playsinline', 'true');
								//video.setAttribute('preload', 'true');
								var video_src = document.createElement("source");
									video_src.setAttribute('src', page.video);
									video_src.setAttribute('type', 'video/mp4');
								video.appendChild(video_src);
							newPage.appendChild(video);
						}
						if (page.pause.type=='loop' && page.pause.loop!=null) {
							loop = document.createElement("video");
							loop.setAttribute('class', 'video-loop');
							loop.setAttribute('webkit-playsinline','true');
							loop.setAttribute('preload','true');
							loop.setAttribute('loop','true');
							var loop_src = document.createElement("source");
									loop_src.setAttribute('src', page.pause.loop);
									loop_src.setAttribute('type', 'video/mp4');
								loop.appendChild(loop_src);
							newPage.appendChild(loop);
						}
						if (page.poster!=null) {
							poster = document.createElement("div");
								poster.setAttribute('class', 'video-poster');
								poster.setAttribute('style', 'background-image:url("'+page.poster+'")');
							newPage.appendChild(poster);
						}
						if (page.sound!=null) {
							sound = document.createElement("audio");
								sound.setAttribute('class', 'background-sound');
								sound.setAttribute('loop','true');
								var sound_src = document.createElement("source");
										sound_src.setAttribute('src', page.sound);
										sound_src.setAttribute('type', 'audio/mpeg');
									sound.appendChild(sound_src);
							newPage.appendChild(sound);
						}
						_self.pageContainer.appendChild(newPage);
						

						var newFrame = document.createElement("div");
								newFrame.setAttribute('class', 'frame');
								var frameInner = document.createElement("div");
										frameInner.setAttribute('class', 'frame-inner');
										frameInner.setAttribute('style', 'background-image:url('+page.frame+')');
								newFrame.appendChild(frameInner);
								newFrame.appendChild(frameInner.cloneNode(false));
						_self.parallaxContainer.appendChild(newFrame);
						
						_self.pages[_self.pageCount] = new appPage(newPage, video, poster, loop, sound, page.pause.time, page.pause.loop, newFrame, _self.pageCount );
						_self.pages[_self.pageCount].init();
						
						_self.pageCount++;
					}
				}
				
				_self.loadScroll( true );
    },
		loadScroll: function( first ) {
			_self.pages.forEach( _self.adjustWidth );
			if ( !first ) _self.myScroll.destroy();
			_self.myScroll = new IScroll('#wrapper', _self.options);
			_self.myScroll.on('scrollEnd', _self.onScrollEnd);
			if ( first ) _self.currentPageIndex = 1; // Go to 2nd page
			_self.myScroll.goToPage(_self.currentPageIndex, 0, 0);
			_self.initCurrentPage(_self.currentPageIndex);
		},
		adjustWidth: function(el,i,arr){
			el.elem.style.width = window.innerWidth+'px';
			el.frame.style.width = window.innerWidth * 1.4 + 'px';
			var margin = (i===0) ? -( ( window.innerWidth * 1.4 ) - window.innerWidth ) / 2 : 0;
			el.frame.style.marginLeft = margin + 'px';
		},
		resetSiblings: function(index) {
			_self.pages.forEach(function(el,i){
				if (i != index) el.reset();
			});
		},
		
		initCurrentPage: function(index) {
			_self.resetSiblings(index);
			_self.pages[index].start();
		},
		
		/* ONLY SHOW THREE PAGES AT THE TIME (FOR PERFORMANCE) */
		
		swapPages: function(first_to_last){
			var fetch = (first_to_last) ? 'shift' : 'pop';
			var insert = (first_to_last) ? 'push' : 'unshift';
			var node = (first_to_last) ? _self.pageContainer.childNodes[0] : _self.pageContainer.childNodes[_self.pageCount-1];
			var neighbour = (first_to_last) ? null : _self.pageContainer.childNodes[0];
			var frame = (first_to_last) ? _self.parallaxContainer.childNodes[0] : _self.parallaxContainer.childNodes[_self.pageCount-1];
			var frameneighbour = (first_to_last) ? null : _self.parallaxContainer.childNodes[0];
			var indexchange = (first_to_last) ? -1 : 1;
			
			// Change Array
			var fetched = _self.pages[fetch]();
			_self.pages[insert](fetched);
			
			// Change DOM
			_self.pageContainer.insertBefore(node, neighbour);
			_self.parallaxContainer.insertBefore(frame, frameneighbour);
			
			// Reload Scroll
			_self.currentPageIndex = _self.currentPageIndex+indexchange;
			_self.loadScroll( false );
			_self.myScroll.goToPage(_self.currentPageIndex, 0, 0);
			_self.initCurrentPage(_self.currentPageIndex);
		},
		
		onScrollEnd: function() {
			var lastPageIndex = _self.currentPageIndex;
			_self.currentPageIndex = Number(_self.myScroll.currentPage.pageX);
			
			if ( lastPageIndex != _self.currentPageIndex ) {
				if ( _self.currentPageIndex+1 == _self.pageCount ) {
					_self.swapPages(true);
				} else if ( _self.currentPageIndex === 0 ) { 
					_self.swapPages(false);
				} else {
					_self.initCurrentPage(_self.currentPageIndex);
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