var pageCount = 6;

var pagesObj = {
/*
	chimpans: {
		poster: 'poster/chimpans-poster.jpg',
		video: 'video/schimpans_VIDEO1.mp4',
		pause: {
			type: 'loop',
			time: 0,
			loop: 'video/schimpans_VIDEO2.mp4',
			finish: true,
		},
		endloop: true,
		sound: 'audio/schimpans_BG_SOUND.caf',
		frame: 'frame/border-stork.png',
		answer: 'Schimpans på dans',
	},
*/
	chimpans: {
		poster: 'poster/chimpans-poster-ny.jpg',
		video: 'video/SHIMPANS_NY.mp4',
		pause: {
			type: 'pause',
			time: false,
			loop: false,
			finish: false,
		},
		endloop: true,
		sound: 'audio/schimpans_BG_SOUND.caf',
		frame: 'frame/border-stork.png',
		answer: 'Schimpans på dans',
	},
	
	// 0.2597 0.3464
	
	/* FIRST PAGE */
	elefant: {
		poster: 'poster/elefant-poster.jpg',
		video: 'video/elefant_video1v2.mp4',
		pause: {
			type: 'loop',
			time: 1.5,
			loop: 'video/elefant_video2.mp4',
			finish: false,
		},
		endloop: true,
		sound: 'audio/elefant_bg_sound_1-2.caf',
		frame: 'frame/border-elefent.png',
		answer: 'Elefant på högkant',
	},
	
	stork: {
		poster: 'poster/stork-poster.jpg',
		video: 'video/stork_video_1.mp4',
		pause: {
			type: 'touch',
			time: false,
			loop: 'video/stork_video_2.mp4',
			finish: false,
		},
		endloop: true,
		sound: 'audio/stork_bg_sound.caf',
		frame: 'frame/border-stork.png',
		answer: 'Stork med hårtork',
	},
	trast: {
		poster: 'poster/trast-poster.jpg',
		video: 'video/trast_VIDEO1.mp4',
		pause: {
			type: 'loop',
			time: 0,
			loop: 'video/trast_VIDEO2.mp4',
			finish: false,
		},
		endloop: true,
		sound: 'audio/trast_bg_audio_1-2.caf',
		frame: 'frame/border-trast.png',
		answer: 'Trast på rast ',
	},
	koala: {
		poster: 'poster/koala-poster.jpg',
		video: 'video/KOALA_VIDEO1.mp4',
		pause: {
			type: 'loop',
			time: 0,
			loop: 'video/KOALA_VIDEO2.mp4',
			finish: false,
		},
		endloop: true,
		sound: 'audio/KOALA_bg_sound.caf',
		frame: 'frame/border-djungle.png',
		answer: 'Koala i färgskala',
	},
	ormvrak: {
		poster: 'poster/ormvrak-poster.jpg',
		video: 'video/ORMVRAK_VIDEO_1.mp4',
		pause: {
			type: 'loop',
			time: 2.00,
			loop: 'video/ORMVRAK_VIDEO_2.mp4',
			finish: false,
		},
		endloop: true,
		sound: 'audio/ormvrak_BG_SOUND.caf',
		frame: 'frame/border-stork.png',
		answer: 'Ormvrååk i vråålååk',
	},
};

var appPage = function( page, video, videourl, loop, loopurl, sound, pausetime, doloop, frame, index, name, pausetype, answer, endloop, finishloop, answertext ) {
	_this = this;
	this.elem = page;
	this.video = video;
	this.videourl = videourl;
	this.videoloop = loop;
	this.loopurl = loopurl;
	this.endloop = endloop;
	this.sound = sound;
	this.frame = frame;
	this.button = answer;
	this.answer = new SpeechSynthesisUtterance(answertext);
		this.answer.voiceURI = 'native';
		this.answer.lang = 'sv-SE';
		this.answer.rate = 0.25;
		this.answer.pitch = 1.8;
	this.isReading = false;
	this.pauseState = {
		type: pausetype,
		time: pausetime, 
		loop: doloop,
		finish: finishloop,
	};
	this.duration = null;
	this.loopduration = null;
	this.loopstart = 0;
	this.loopend = 0;
	this.isCurrent = false;
	this.playState = 'init'; // init | start | resume | paused | ended | loading;
	this.hasRunned = false;
	this.index = index;
	this.name = name;
	this.touchTime = null;
	this.click = false;
	this.isPosetrHide = 0;
	this.finishloop = false;
	this.playedCount = 0;
	this.isPlaying = false;
	this.isLoopPlaying = false;
};

		appPage.prototype.init = function() {
			if (this.videoloop && this.pauseState.type == 'touch' ) {
				this.elem.addEventListener('touchstart', this.onTouchStart.bind(this), false);
				this.elem.addEventListener('touchmove', this.onTouchEnd.bind(this), false);
				this.elem.addEventListener('touchend', this.onTouchEnd.bind(this), false);
			} else {
				this.elem.addEventListener('touchstart', this.onClickStart.bind(this), false);
				this.elem.addEventListener('touchmove', this.onClickMove.bind(this), false);
				this.elem.addEventListener('touchend', this.onClickEnd.bind(this), false);
			}
			this.video.addEventListener('playing', (function(){ this.isPlaying = true; }).bind(this), false);
			this.video.addEventListener('pause', (function(){ this.isPlaying = false; }).bind(this), false);
			
			this.video.addEventListener('ended', this.onVideoEnded.bind(this), false);
			this.video.addEventListener('loadeddata', this.onVideoLoaded.bind(this), false);
			//this.video.addEventListener('timeupdate', this.onTimeUpdate.bind(this), false);
			
			if (this.videoloop) this.videoloop.addEventListener('loadeddata', this.onLoopLoaded.bind(this), false);
			if (this.videoloop) this.videoloop.addEventListener('playing', (function(){ this.isLoopPlaying = true; }).bind(this), false);
			if (this.videoloop) this.videoloop.addEventListener('pause', (function(){ this.isLoopPlaying = false; }).bind(this), false);
			//if (this.videoloop) this.videoloop.addEventListener('ended', this.onLoopEnded.bind(this), false);
			
			this.button.addEventListener('touchstart', this.onAnswerClick.bind(this), false);
			
			this.answer.addEventListener('start', this.onAnswerStart.bind(this), false);
			this.answer.addEventListener('end', this.onAnswerEnd.bind(this), false);
		};
		
		
		/*  A N S W E R  */
		
		appPage.prototype.onAnswerClick = function(){
		  if ( !this.isReading ) window.speechSynthesis.speak(this.answer);
		};
		
		appPage.prototype.onAnswerStart = function(){ this.isReading = true; };
		
		appPage.prototype.onAnswerEnd = function(){ this.isReading = false; };
		
		
		/*  T O U C H  */
		
		appPage.prototype.onTouchStart = function(e){
			/* Check if answer button was clicked */
			if ( e.target.nodeName == 'INPUT' ) return false;
			this.videoloop.currentTime = this.loopstart;
			this.touchplay();
		};
		
		appPage.prototype.onTouchEnd = function(e){
			this.touchpause();
			this.videoloop.currentTime = this.loopstart;
		};
		
		appPage.prototype.onClickStart = function(e){
			this.click = true;
			this.touchTime = setTimeout((function(time){
				this.click = false;
				clearTimeout(time);
			}).bind(this), 500);
		};
		
		appPage.prototype.onClickMove = function(e){
			this.click = false;
			clearTimeout(this.touchTime);
		};
		
		appPage.prototype.onClickEnd = function(e){
			/* Check if answer button was clicked */
			if ( this.click && e.target.nodeName != 'INPUT') {
				if ( this.playState == 'paused' ) {
					if ( this.pauseState.finish && !this.finishloop ) {
						this.finishloop = true;
					} else if ( !this.finishloop ) {
						this.resume();
					}
				} else if ( this.playState == 'init' || this.playState == 'ended' ) {
					 this.start();
				}
			}
		};
		
		/*  V I D E O  */
		
		appPage.prototype.start = function() {
			if ( !this.hasRunned ) setTimeout(function(){
				navigator.splashscreen.hide();
			}, 500);
		  
		  this.playState = 'start';
		  //this.timeUpdate();
		  
		  if (this.pauseState.time !== 0) {
			  this.video.currentTime = 0;
			  this.video.play();
		  } else {
			  //this.video.load();
			  this.pause();
			  this.loop();
		  }
		  
		  if ( !this.hasRunned && this.sound ) {
				this.sound.currentTime = 0;
				this.sound.play();
		  }
		  
		  this.hidePoster(true);
		  this.hasRunned = true;
		};
		
		appPage.prototype.pause = function() {
			this.video.pause();
			this.video.currentTime = this.pauseState.time;
		  this.playState = 'paused';
		};
		
		appPage.prototype.loop = function() {
			this.hideLoop(false);
			this.videoloop.play();
		};
		
		appPage.prototype.resume = function() {
			this.hideLoop(true);
			if (this.videoloop) this.videoloop.pause();
			this.video.play();
		  this.playState = 'resume';
		};
		
		appPage.prototype.reset = function(index,current) {
			this.hidePoster(false);
			this.video.currentTime = 0;
			this.video.pause();
			
			window.speechSynthesis.cancel();
			
			if ( this.sound ) this.resetSound();
		  if ( this.videoloop ) this.resetLoop();
		  
		  this.playState = 'init';
		  this.hasRunned = false;
			this.isCurrent = false;
			
			if ( index == current-1 || index == current+1 ) this.recover();
			var current_three = (index >= current-1 && index <= current+1);
			if ( !current_three ) this.destroy();
		};
		
		appPage.prototype.touchplay = function() {
			this.hideLoop(false);
			this.videoloop.play();
		};
		
		appPage.prototype.touchpause = function() {
			this.hideLoop(true);
			this.videoloop.pause();
		};
				
				appPage.prototype.destroy = function() {
					this.video.pause();
					this.video.src = ''; // empty source
					//this.video.load();
					
					if ( this.videoloop ) {
						this.videoloop.pause();
						this.videoloop.src = ''; // empty source
						//this.videoloop.load();
					}
				};
				
				appPage.prototype.recover = function() {
					this.video.src = this.videourl;
					this.video.load();
					
					if ( this.videoloop ) {
						this.videoloop.src = this.loopurl;
						this.videoloop.load();
					}
				};
				
				appPage.prototype.onVideoEnded = function() {
					this.playState = 'ended';
				};
				
				appPage.prototype.onVideoLoaded = function() { this.duration = this.video.duration; };
				
				appPage.prototype.onLoopLoaded = function() { 
					this.loopduration = this.videoloop.duration;
					this.loopstart = this.loopduration / 4;
					this.loopend = this.loopstart * 3;
				};
				
				appPage.prototype.onTimeUpdate = function() {
					// Kolla om det kan ha med 'this.playState' att göra att den stanna på pause.time ist. startar om
					if ( this.playState == 'start' && this.video.currentTime >= this.pauseState.time ) {
						this.pause();
						if (this.pauseState.loop) this.loop();
					}
					if (this.endloop) {
						if ( this.video.currentTime >= this.duration ) {
							this.playState = 'start';
							this.video.currentTime = 0;
						}
					}
				};
				
				appPage.prototype.onLoopUpdate = function() {
					if ( this.videoloop.currentTime >= this.loopend-0.05 ) {
						this.videoloop.currentTime = this.loopstart;
						this.onLoopEnded();
					}
				};
				
				appPage.prototype.hidePoster = function(hide) {
					hide = typeof hide !== 'undefined' ? hide : true;
					this.elem.classList[ (hide) ? 'remove' : 'add' ]('poster');
				};
				
				appPage.prototype.hideLoop = function(hide) {
					hide = typeof hide !== 'undefined' ? hide : true;
					if ( this.videoloop )	this.videoloop.currentTime = this.loopstart;
					if ( this.videoloop ) this.videoloop.classList[ (hide) ? 'add' : 'remove' ]('hidden');
				};
				
				appPage.prototype.resetSound = function() {
					this.sound.pause();
					this.sound.currentTime = 0;
				};
				
				appPage.prototype.resetLoop = function() {
					this.hideLoop(true);
					this.videoloop.pause();
					this.videoloop.currentTime = this.loopstart;
				};
				
				appPage.prototype.onLoopEnded = function() {
					//this.videoloop.play();
					if ( this.pauseState.finish && this.finishloop ) {
						this.finishloop = false;
						this.resume();
						this.videoloop.currentTime = 0;
						this.playedCount = 0;
					}
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
			_self.parallax = 1.3;
			_self.ww = window.innerWidth;
			_self.wh = window.innerHeight;
		  _self.new_width = _self.wh*0.75;
		  _self.center =  Math.round( -( _self.new_width - _self.ww ) / 2 );
		  _self.prlx = _self.ww * _self.parallax;
			_self.options = { 
				scrollX: true, 
				scrollY: false, 
				momentum: false, 
				mouseWheel: false, 
				snap: 'li',
				//deceleration: 0.0006,
				indicators: [{
					el: document.getElementById('parallax'),
					listenX: true,
					resize: false,
					ignoreBoundaries: true,
					speedRatioX: _self.parallax,
				}],
			};
			_self.pages = [];
      _self.bindEvents();
    },
    bindEvents: function() {
        document.addEventListener('deviceready', _self.onDeviceReady, false);
    },
    onDeviceReady: function() {
				document.addEventListener('touchmove', function(e) { e.preventDefault(); }, false);
				document.addEventListener('pause', _self.onBlur, false);
				document.addEventListener('resume', _self.onFocus, false);
        _self.isLoaded = true;
        
        var frameCSS = '';
				
				for (var key in pagesObj) {
					if (pagesObj.hasOwnProperty(key)) {
						var page = pagesObj[key];
						var video = null,
								loop = false,
								sound = false;
								answer = false;

						var newPage = document.createElement("li");
								newPage.setAttribute('id', key);
						var li_classes = 'poster';
								li_classes += ( page.pause.type=='touch' ) ? ' touch' : '';
								newPage.setAttribute('class', li_classes);
								if (page.poster) newPage.setAttribute('style', 'background-image:url("'+page.poster+'")');
						
						if (page.video) {
							video = document.createElement("video");
								video.setAttribute('class', 'video');
								video.setAttribute('poster', 'poster/transparent.png');
								video.setAttribute('webkit-playsinline', 'true');
								if ( _self.pageCount < 3 ) video.setAttribute('src', page.video);
								video.setAttribute('type', 'video/mp4');
								video.setAttribute('preload','auto');
								if ( page.endloop ) video.setAttribute('loop','true');
							newPage.appendChild(video);
						}
						if (page.pause.type=='loop' || page.pause.type=='touch' && page.pause.loop) {
							loop = document.createElement("video");
							loop.setAttribute('class', 'video-loop');
							video.setAttribute('poster', 'poster/transparent.png');
							loop.setAttribute('webkit-playsinline','true');
							//loop.setAttribute('loop','loop');
							loop.setAttribute('src', page.pause.loop);
							loop.setAttribute('type', 'video/mp4');
							video.setAttribute('preload','auto');
							newPage.appendChild(loop);
						}
						if (page.sound) {
							sound = document.createElement("audio");
								sound.setAttribute('class', 'background-sound');
								sound.setAttribute('loop','true');
								sound.setAttribute('src', page.sound);
								sound.setAttribute('type', 'audio/mpeg');
								sound.setAttribute('volume', 0.5);
							newPage.appendChild(sound);
						}
						
						if (page.answer) {
							answer = document.createElement("input");
								answer.setAttribute('type', 'button');
								answer.setAttribute('value', '?');
							newPage.appendChild(answer);
						}
						
						_self.pageContainer.appendChild(newPage);
						

						var newFrame = document.createElement("div");
								newFrame.setAttribute('class', 'frame');
								newFrame.setAttribute('id', 'frame-'+key);
															
						_self.parallaxContainer.appendChild(newFrame);
						
						/* !== false BECAUSE ZERO (0) IS CONSIDERED 'FALSE' + CHECK typeof */
						var videopausetime = (page.pause.time !== false) ? page.pause.time : 9999999; 
						
						_self.pages[_self.pageCount] = new appPage(newPage, video, page.video, loop, page.pause.loop, sound, videopausetime, page.pause.loop, newFrame, _self.pageCount, key, page.pause.type, answer, page.endloop, page.pause.finish, page.answer );
						_self.pages[_self.pageCount].init();
						
						_self.pageCount++;
						
						frameCSS += '#frame-'+key+':before, #frame-'+key+':after {background-image:url('+page.frame+')} ';
						if ( _self.pageCount == pageCount ) {
							var frameStyle = document.createElement("style");
									frameStyle.type = 'text/css';
									frameStyle.appendChild( document.createTextNode( frameCSS ) );
							document.getElementsByTagName('body')[0].appendChild(frameStyle);
						}
					}
				}
				
				_self.loadScroll( true );
    },
		loadScroll: function( first ) {
			if ( first ) _self.pages.forEach( _self.adjustWidth );
			_self.pages.forEach( _self.adjustFrame );
			if ( !first ) _self.myScroll.destroy();
			_self.myScroll = new IScroll('#wrapper', _self.options);
			_self.myScroll.on('scrollEnd', _self.onScrollEnd);
			if ( first ) _self.currentPageIndex = 1; // Go to 2nd page
			_self.myScroll.goToPage(_self.currentPageIndex, 0, 0);
			_self.initCurrentPage(_self.currentPageIndex);
		},
		adjustWidth: function( el, i ){
			
			el.elem.style.height = _self.wh+'px';
			el.elem.style.width = _self.ww+'px';
			
			//if (_self.ww/_self.wh != 0.75) {
		    
				
				el.video.style.width = _self.new_width+'px';
				el.video.style.marginLeft = _self.center+'px';
				
				if ( el.videoloop ) {
					el.videoloop.style.width = _self.new_width+'px';
					el.videoloop.style.marginLeft = _self.center+'px';
				}
				
				el.elem.style.backgroundPositionX = _self.center+'px';
			//}
		},
		adjustFrame: function( el, i ){
			el.frame.style.width = _self.prlx + 'px';
			el.frame.style.marginLeft = (i===0) ? -( ( _self.prlx ) - _self.ww ) / 2 + 'px' : 0 + 'px';
		},
		resetSiblings: function(current,callback) {
			//index = (typeof current !== null) ? current : 999;
			_self.pages.forEach(function(item,i){
				item.reset(i, current);
			});
			if (callback && typeof(callback) === "function") callback();
		},
		
		initCurrentPage: function(index) {
			_self.resetSiblings(index, function(){
				_self.pages[index].isCurrent = true;
				_self.pages[index].start();
				_self.timeUpdate();
			});
		},
		timeUpdate: function(timestamp) {
			var obj = _self.pages[_self.currentPageIndex];
			if ( obj.isLoopPlaying ) obj.onLoopUpdate();
	    if ( obj.isPlaying ) obj.onTimeUpdate();
	    window.requestAnimationFrame( _self.timeUpdate );
		},
		onBlur: function(){
			navigator.splashscreen.show();
			_self.resetSiblings( _self.currentPageIndex );
		},
		onFocus: function(){
			_self.initCurrentPage( _self.currentPageIndex );
			navigator.splashscreen.hide();
		},
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
			_self.parallaxContainer.insertBefore(frame, frameneighbour);
			_self.pageContainer.insertBefore(node, neighbour);
			
			// Reload Scroll
			_self.currentPageIndex = _self.currentPageIndex+indexchange;
			_self.loadScroll( false );
			_self.myScroll.goToPage(_self.currentPageIndex, 0, 0);
			_self.initCurrentPage(_self.currentPageIndex);
		},
		
		onScrollEnd: function() {
			//_self.isScrolling = false;
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
};

function onload() {
	app.initialize();
}