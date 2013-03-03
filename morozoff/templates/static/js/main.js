function ShowForm(){
	$('#shadow').css('display','block');
	
	if ($.browser.msie && (parseInt($.browser.version) == 7 || parseInt($.browser.version) == 6 )){
		$('#form').css({
			'display': 'block',
			'position': 'absolute'
		}); 
	}
	else {
		$('#form').css('display','table');
	}
}

$('div#topMenu').ready(function() {

	var menuNameHovered = false;
	
	$('.mi_container').hover(function() {
		$(menuNameHovered).find('.popupContainer').slideUp(0);
		menuNameHovered = this;
		var offset = jQuery(this).offset();

		var container = $(this).find('.popupContainer');
		container.css('left', offset.left).css('top', offset.top+15);

		container.slideDown(0);
		
	},
	function() {
		$(this).find('.popupContainer').slideUp(0);
	});
	
	
	var hoveredPopUpMenu;
	
	$('#topMenu .topMenuItem a').hover(function() {
		
		
		$(this).parent().find('.pupupTopMenu ul').show(0);
	}, function() {});
	
	
	$('#topMenu .pupupTopMenu').hover(function() {

		$(menuNameHovered).find('ul').hide(0);
		menuNameHovered = this;
		

		var container = $(this).find('ul');
		container.show(0);
		
	},
	function() {
		$(this).find('ul').hide(0);
	});
	
	$('#topMenu .pupupTopMenu').each(function() {
		var offset = $(this).parent().offset();
		$(this).css('left', offset.left).css('top', offset.top);
	});
});

$(document).ready(function(){
	$("#shadow").click(function() {
		$('#shadow').hide();
		$('#form').hide();
		//window.location.href("/");
		window.location.href = '/';
	});
    $('#shadow').css('opacity','0.5');

}); 

$(document).ready(function() {
    $('#footer>#footerMenuContainer>#subContainerFooterMenu>.slideMenu').each(function() {
		
		$(this).click(function(){ if($(this).attr('href')=='') return false; });
		
        $(this).mouseover(function() {
            var submenu=$(this).next('ul'),
				pos=submenu.position(),
				coordy=$(this).offset().top,
				coordx=$(this).offset().left,
				heightl=$(this).height(),
				height=submenu.outerHeight(),
				y=submenu.width(),
				z=submenu.outerWidth(true),
				x=(z-y)/2,
				linkname=$(this).text();
				submenu.css({'position':'absolute','top':coordy-height-12+'px','left':coordx-x+'px','z-index':'1000'});
				submenu.append('<span style="border-top:1px solid #ccc; width: 100% clear: both; height:20px; font-size:12px;">'+linkname+'</span>');
				
				if(submenu.not(':visible')){
					submenu.fadeIn(100);
				}else if(submenu.is(':animated')){
					submenu.stop();
					submenu.fadeIn(100);
					}
				
				submenu.mouseleave(function(){
					submenu.hide();
					submenu.find('span').remove();
				});
				
        });
    });
});