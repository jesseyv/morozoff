// JavaScript Document
/*$(document).ready(function() {
       
	    $('#slideforms').click(function() {
			$(this).hide();
			
			var x=$('#popupblock').position();
			
			$('#popupblock').animate({top:x.top-50},200);
			
			$('#club').animate({height:'405px'},10,function(){
				$('#slideform').fadeIn('400');
				if($('#club:only-child').find('h1').is(':visible')){
					$('#club:only-child').find('h1').hide();
					$('#popupstep').fadeIn(500);
					}
				});
			return false;
			
        });
    });*/
(function($)  {
jQuery.fn.popup=function(opt){
	var IE='\v'=='v';
	var obj=$(this),
		closebtn=obj.find('.closePopUpButton'),
	

		opt=jQuery.extend({
			closebtn:'popupback',
			blockbgcolor:'#fff',
			bgcolor:'#000',
			display:'none',
			corner:false,
			radius:'',
			opacity:.7,
			width:'800',
			height:'600',
			header:'test'
			},opt),
			
			
		inf=$('div#infopop'),
		dh=$(document).height(),
		dw=$(document).width(),
		wh=$(window).height(),
		ww=$(window).width(),
		l=(ww-opt.width)/2,
		t=(wh-opt.height)/2,
		c=obj.html();
		

function isnum(x){
    if (x==0) return true;
    return res=(x/x) ? true : false;
}

if(isnum(opt.height)){
	bh=opt.height+'px'
}else{
	bh=opt.height;
	t=(wh-bh.innerHeight)/2;
}
if(isnum(opt.width)){
	bw=opt.width+'px'
}else{
	bw=opt.width;
	l=(ww-bw.innerWidth)/2;
}

//obj.hide();

$("<div id='popupback'/>").appendTo("body");
$("<div id='popupblock'/>").appendTo("body").hide();
//$("<a id='popupclose' href='?test=<?=$LINK?>' onClick='closepopup();' />").appendTo("body");
var b=$('#popupback'),bl=$('#popupblock')/*,ac=$('#popupclose')*/;
			if(dw>ww||IE)ww=dw;
			if(dh>wh||IE)wh=dh;
	b.css({'width':ww,'height':wh,'position':'absolute','left':'0px','top':'0px','opacity':opt.opacity,'background-color':opt.bgcolor,'z-index':'9000','display':'none'});
	
	/*b.click(function() {
        closepopup();
    });*/
	bl.css({'z-index':'9500','position':'absolute','left':l,'top':t,'display':'block','width':bw/*,'height':bh'background-color':opt.blockbgcolor*/});
	/*ac.text('Close').click(function() {
        closepopup();
    });
	
	var x=bl.position();
	ac.css({'display':'block','z-index':'9505'});
		var x=bl.position();
		ac.css({'position':'absolute','top':x.top+40,'left':x.left+bl.width()-50});*/

	if(opt.corner && !IE){
		
		radius=opt.radius;
		$.getScript('/js/jquery.corner.js');
		if(radius=='')radius=10;
		pad=radius/2;
		obj.css({'padding-bottom':pad+'px','padding-left':pad+'px', 'padding-right':pad+'px', 'padding-top':pad+'px'});
		obj.corner(radius+'px');
	}	
	
	
	$(window).resize(function() {
		var dh=$(document).height(),
			dw=$(document).width(),
			wh=$(window).height(),
			ww=$(window).width(),
			l=(ww-opt.width)/2,
			t=(wh-opt.height)/2,
			bw=opt.width+'px',
			bh=opt.height+'px';
			
			if(dw>ww)ww=dw;
			if(dh>wh)wh=dh;
			
        b.css({'width':ww,'height':wh});
		bl.css({'position':'absolute','left':l,'top':t,'width':bw,'height':bh});
/*		
		var x=bl.position();
			ac.css({'position':'absolute','top':x.top+40,'left':x.left+bl.width()-50});*/
    });

		bl.append(obj);
		b.fadeIn(500,function(){obj.fadeIn(300);});
		//obj.fadeIn(300);
/*	if(opt.header!=''){
		var te='<h1>'+opt.header+'</h1>';
		bl.html(te);
	}*/
//		bl.html(c);
//		bl.load('http://test.love-sl.ru/club/');
		
		
	//b.text(obj.css());
		function closepopup() {
				if(opt.display!='none'){
					obj.show();
				}
				b.detach();
				bl.detach();
				/*ac.detach();*/
			}
		closebtn.click(function(){
			closepopup();
			});	
	
		};
})( jQuery );