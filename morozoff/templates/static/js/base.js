
var feedback = {};
feedback.init = function(config) {
    if (!(config.button && config.drop && config.popup))
        throw "invalid params";
    config.popup.find('form.feedback').ajaxSubmit({
        'onstart':function(){
            config.popup.addClass('loading');
        },
        'onend':function(){
            config.popup.removeClass('loading');
        },
        'onerror':function(why){
            alert('Error! '+why);
        },
        'onsuccess':feedback.done(config)
    });

    config.button.click(function(){
        config.drop.removeClass('hiding');
        config.popup.removeClass('hiding');
        config.popup.find('input[name=email]').focus();
    });
    config.popup.find('.close').click(feedback.closeit(config));
};

feedback.done = function(config) {
    return function() {
        config.popup.addClass('thanks');
        config.popup.delay(1000).fadeOut(500, feedback.closeit(config));
        config.popup.delay(1000).fadeOut(500);
    };
};

feedback.closeit = function(config) {
    return function(){
        config.drop.addClass('hiding');
        config.popup.addClass('hiding');
        config.popup.removeClass('thanks');
        config.popup.css('display','');
        config.drop.css('display','');
        config.popup.find('textarea').val('');
        config.popup.find('input[name=subject]').val('');
    };
};

check_shipping_method = function() {
    if ($("[value='pickup_process']").prop("selected")) {
        $("#id_ship-address").closest("tr").hide();
    } else {
        $("#id_ship-address").closest("tr").show();
    }
};

$(document).ready(function(){
    $('a [href^="skype"]').click(function(){return skypeCheck()});
    $("a[rel^='prettyPhoto']").prettyPhoto({theme: 'light_rounded'});

    check_shipping_method();
    
    $("#id_shipping_method").change(check_shipping_method);
    feedback.init({
        'button':$('#feedback_button'),
        'drop':$('#feedback_drop'),
        'popup':$('#feedback_popup')
    });
    $(".rate i").mouseover(function(){
        $(this).add($(this).nextAll("i")).addClass("active");
        $(this).prevAll("i").addClass("inactive");
        $(".hint").show();
    });
    $(".rate i").mouseleave(function(){
        $(".rate i").removeClass("active");
        $(".rate i").removeClass("inactive");
        $(".hint").hide();
    });

    $(".rate i").click(function() {
        var params = $(this).attr("id").match(/(\d+)/g);
        $.get(
            '/rating/vote/',
            {'product': params[0], 'score': params[1]},
            function(data) {
                $("#hint-for-"+params[0]).text('голос учтен!');
            },
            'json'
        );
    });
    $(".brief .image").click(function(){
        document.location = $(this).closest(".brief").find("a").first().attr("href");
    });
    $(".leftside .ammo").click(function(){
        document.location = $(this).prev("h2").find("a").first().attr("href");
    });
    $(".manufacturer-list img").click(function(){
        document.location = $(this).parent("div").next("h2").find("a").first().attr("href");
    });
});
