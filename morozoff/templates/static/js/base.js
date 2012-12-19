$(window).resize(function() {
    resSubMenu();
    });

function resSubMenu() {
    var menus = $('#topMenuContainer .subMenu');
    $.each(menus, function(i, menu) {
        var id = $(menu).attr('id').substr(9, 50);
        var menuItem = $('#menuId' + id);
        var offset = menuItem.offset();
        $(menu).css('left', offset.left).css('top', offset.top);
    });
}

var selectedMenu = false;
var hoverTopItem = false;
var hoverSubMenuCotainer = false;

function hideMenuContainer() {
    if(!hoverTopItem && !hoverSubMenuCotainer) {
    $('#topMenuContainer .subMenu').hide();
    }
    window.setTimeout('hideMenuContainer()', 100);
}

function menuPopUpManager() {
    $('#topMenuContainer .subMenu').each(function() {
        var id = $(this).attr('id').substr(9, 50);
        var offset = $('#menuId' + id).offset();
        $(this).css('left', offset.left).css('top', offset.top);
    });

    $('#topMenuContainer a.menuItem').hover(function() {
        resSubMenu();
        if ($(this).attr('id')) {
            if(selectedMenu != $(this).attr('id').substr(6, 50)) {
                $('#subMenuId' + selectedMenu).hide();
            }
        }
        // console.log(selectedMenu);
        selectedMenu = $(this).attr('id').substr(6, 50);
        hoverTopItem = true;
        $('#subMenuId' + selectedMenu).show();
    },
    function() {
        hoverTopItem = false;
    }
    );

    $('#topMenuContainer .subMenu').hover(function() {
        hoverSubMenuCotainer = true;
        },
    function() {
        hoverSubMenuCotainer = false;
        });

    hideMenuContainer();
}

$(function() {

    $('div#topMenuContainer').ready(function() {
        menuPopUpManager();
    });

    $('.flexslider').flexslider({
        animation: "slide"
    });

    var jPhotos = $('.photo a img');

    jPhotos.each(function() {
        var photo = $(this);
        var container = photo.parents('.contain');
        var innerContainer = photo.parents('.innerContainer');
        var show = innerContainer.find('.show');

        var overPhoto = false;
        var overShow = false;

        show.on('mouseover', function(e) {
            overShow = true;
        });
        photo.on('mouseover', function(e) {
            overPhoto = true;
            container.css('z-index', '62');
            show.css('z-index', '60').show();
        });

        show.on('mouseleave', function(e) {
            overShow = false;

            window.setTimeout(function() {
                if (!overPhoto && !overShow) {
                    container.css('z-index', '50');
                    show.css('z-index', 'auto').hide();
                }
            }, 300);
        });
        photo.on('mouseleave', function(e) {
            overPhoto = false;

            window.setTimeout(function() {
                if (!overShow) {
                    container.css('z-index', '50');
                    show.css('z-index', 'auto').hide();
                }
            }, 300);
        });

    });

});
