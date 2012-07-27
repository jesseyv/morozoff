
function Hotdev_SlideshowMan(params)
{
	if(!params) {
		return;
	}
	
	this.params = params;
	
	this.slideKey = 0;
	this.defaultInterval = 3000;
	this.defaultAnimateTime = 1000;
	
	this.activeSlider = true;
	this.slides = false;
	
	this.init = function() {
	
		if(!this.getSlides) {
			return false;
		}
		
		this.addIdentClass();
		
		this.startSlideShow();
		
		return this;
		
	}
	
	this.addIdentClass = function() {
		var slides = this.getSlides();
		for(k in slides) {
			$(slides[k].addClass('sliderElement'));
		}
	}
	
	this.getSlides = function() {
	
		if(this.slides) {
			return this.slides;
		}
		
		this.slides = new Array();
		if(this.params.ejqSlides && this.params.ejqSlides instanceof $ && this.params.ejqSlides.length > 0) {
			oThis = this;
			this.params.ejqSlides.each(function() {
				if($(this).length > 0) {
					oThis.slides[oThis.slides.length] = $(this);
				}
			});
		}
		else if(this.params.aSlides && this.params.aSlides.length > 0) {
			for(k in this.params.aSlides) {
				var element = $(this.params.aSlides[k]);
				if(element.length) {
					this.slides[this.slides.length] = $(this.params.aSlides[k]);
				}
			}
		}
		else if(this.params.seSlides && this.params.seSlides.length > 0) {
			for(k in this.params.seSlides) {
				var element = $(this.params.seSlides[k]);
				if(element.length) {
					this.slides[this.slides.length] = $(this.params.seSlides[k]);
				}
			}
		}
		
		if(this.slides.length > 0) {
			return this.slides;
		}
		
		return false;
		
	}
	
	
	this.slideProcess = false;
	this.startSlideShow = function() {
		
		if(!this.activeSlider || this.slideProcess) {
			return;
		}
		
		this.slideProcess = true;
		
		this.slideNext();
		
		thisObj = this;
		
		if(this.params.interval) {
			interval = this.params.interval;
		}
		else {
			interval = this.defaultInterval;
		}
		
		interval += this.defaultAnimateTime;
		
		
		this.setSliderShedule();
	}
	
	
	this.stopSlider = function() {
		this.activeSlider = false;
	}
	
	this.continueSlider = function() {
	
		this.activeSlider = true;
		this.setSliderShedule();
	}
	
	this.timeoutShed = false;
	this.setSliderShedule = function()
	{
		if(this.timeoutShed) {
			window.clearTimeout(this.timeoutShed);
		}		
		
		thisObj = this;
		
		this.timeoutShed = window.setTimeout(function(){
			thisObj.slideProcess = false;
			if(thisObj.activeSlider) {
				thisObj.startSlideShow();
			}
		}, this.getInterver());
	}

	this.getInterver = function () 
	{
		var interval;
		
		if(this.params.interval) {
			interval = this.params.interval;
		}
		else {
			interval = this.defaultInterval;
		}
		
		interval += this.defaultAnimateTime;
	
		return interval;
	}
	
	this.slideNext = function()
	{
		
		var slides = this.getSlides();
		if(slides.length < 1) {
			return false;
		}
		
		if(slides[this.slideKey]) {
		
			this.slideGo(this.slideKey)
			this.slideKey++;
			
		}
		else if(this.slideKey >= slides.length) {
			this.slideKey = 0;
			this.slideImage;
		}
	}
	
	this.slideGo = function(key) {
	
		// console.log(key);
		
		var slides = this.getSlides();
		
		$(this.params.container).find('.sliderElement:not(.currentItem)').remove();
		
		if($(this.params.container).find('.sliderElement').length > 0) {
			$(this.params.container).find('.sliderElement').
				css('z-index', '1').
				removeClass('currentItem');
		}
		
		var currentItem = slides[key].clone();
		currentItem.addClass('currentItem');
		
		
		$(this.params.container).append(currentItem);
		$(this.params.container).find('.currentItem').css({
			'z-index' : '10',
			'position' : 'absolute'
		});
		
		
		if(this.params.atime) {
			atime = this.params.atime;
		}
		else {
			atime = this.defaultAnimateTime;
		}
		
		if(this.params.slideCallback && $.isFunction(this.params.slideCallback)) {
			var oThis = this;
			window.setTimeout(function(){
				oThis.params.slideCallback(key);
			}, atime);
		}
		
		$(this.params.container).find('.currentItem').fadeIn(atime);
	}
	
	if(!this.params.noAutoStart) {
		return this.init();
	}
	
}