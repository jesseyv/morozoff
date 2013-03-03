var hidemenu = true;

function hideMenuContainer() {
    if(hidemenu) {
        $('#topMenuContainer .subMenu').hide();
    }
}

$("#topMenuContainer .main-level").on("hover", function(e){
    if (e.type == 'mouseenter') {
        hidemenu = false;
        $(this).next("ul.subMenu").show();
    } else if (e.type == 'mouseleave') {
        hidemenu = true;
        window.setTimeout('hideMenuContainer()', 200);
    }
});

$('#topMenuContainer .subMenu').on("hover", function(e){
    if (e.type == 'mouseenter') {
        hidemenu = false;
    } else if (e.type == 'mouseleave') {
        hidemenu = true;
        window.setTimeout('hideMenuContainer()', 200);
    }
});

$(function() {

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
