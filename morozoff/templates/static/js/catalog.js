
var photoFirst = [1, 5, 8, 9, 10];
var arSelectSave = false;
var objCatalog = false;
var catalogPage = false;
// var objCatalogAll = false;
$(document).ready(function () {
	objCatalog = new catalog();
	objCatalog.init();
	
	// objCatalogAll = new catalogAll();
	// objCatalogAll.init();
	
});

function hidetitle(){
	$('img[title]').mouseover(function(){
		var title=$(this).attr('title');
		
		$(this).attr('title','');
		/*$(this).mouseout(function() {
            $(this).attr('title',title);
        });*/
				
		})
}
$(document).ready(function() {
    hidetitle();
	
});

function catalog()
{
    this.filter = {};
    this.arJews = {};
    this.currentJew = 11;

    this.mHovered = 0;
    this.arSelect = [];

    this.pages = false;

    this.startAjax = false;

    this.isma = false;

    this.getId;

    this.filterMenuOvered;


    this.currentFillingsCount = 0;

    this.jewJewIdent = 'jew';

    this.cancelPageFilter = false;

    this.showAllJews = false;
    this.newShowAllJews = false;

    this.lastAddedCatalogMatrix = false;


    this.showAllFillings = 3;
    this.showAllPassedFillings = 0;

    // this.catalog_page =



    this.init = function() {
        catalogPage = strParams.catalog_page;

        this.bindPageNavEvents();
        this.bindEvents();
        this.bindListEvents();
        this.setFilterFields();
    }


    this.bindEvents = function() {
        $('#nextListingNav').click(function() {
            $('#nextListingNav').fadeOut(500);
            objCatalog.showAllPassedFillings = 0;
            objCatalog.showNextAllElements();
        });

        $('.manuItem').click(function () {
            if(objCatalog.arSelect[$(this).attr('id')]){
                objCatalog.selectFilter($(this), false, $(this).text());
                objCatalog.filter['page'] = 1;
                objCatalog.get();
            }
            else {
                $(this).find('.popupList').slideDown(200);
            }
        });

        // ������� ������ �������
        $('.manuItem').hover(
            function () {
            },
            function ()
            {
                var thisObj = this;
                window.setTimeout(function(){
                    if(objCatalog.filterMenuOvered != $(thisObj).attr('id')) {
                        $(thisObj).find('.popupList').slideUp(200);
                    }
                }, 100);
            }
        );

        $('.popupList').hover(
            function () {
                objCatalog.filterMenuOvered = $(this).parent().attr('id');
                // alert('true');
            },
            function ()
            {
                // alert('false');
                objCatalog.filterMenuOvered = false;
            }
        );
        // �������� �������
        $('.manuItem div.item').click(function () {
            var item = $(this);
            var popup = $(this).parent();
            var field = popup.parent();

            window.setTimeout(function(){
                popup.hide(0);
                objCatalog.selectFilter(field, item, item.text());
                objCatalog.filter['page'] = 1;
                objCatalog.get();
            } , 50);
        });


        $('#produnct_id input').keypress(function(e) {
            var obj = this;
            $('#productIdTitle').hide();
            window.setTimeout(function() {objCatalog.ceckIdField(obj)}, 500);
        });

        $('#productIdTitle').click(function() {
            $(this).hide();
            $('#produnct_id input').focus();
        });

        $('#produnct_id input').blur(function() {
            var value = $('#produnct_id input').val();
            if(value.length < 1) {
                $('#productIdTitle').show();
            }
        });

        $('#produnct_id input').click(function() {
            var value = $('#produnct_id input').val();
            if(value.length < 1) {
                $('#productIdTitle').hide();
            }
        });



    }

    this.showAllTimeOut = false;

    this.showNextAllElements = function() {



        if(objCatalog.loadedAllPages) {
            this.stopShowAll();
            return;
        }

        if(this.showAllPassedFillings >= this.showAllFillings) {
            this.stopShowAll();
            $('#nextListingNav').fadeIn(300);
            return;
        }
        // $('#pageNavigation').hide();


        // this.showAllJews = true;

        var lastTable = $('#catalogAjaxAllJews table:last');
        var lastOffset = lastTable.offset();
        var bottomOffset = 0;
        if(lastOffset) {
            bottomOffset = lastOffset.top + lastTable.height()
        }

        if(bottomOffset <= $(document).scrollTop() + $(window).height()) {
            if(!this.filter['page']) {
                this.filter['page'] = 1;
            }
            this.filter['page']++;
            // alert(this.filter['page']);
            this.get();

            this.showAllPassedFillings++;
        }




        // alert($(window).height());
        // window.setTimeout(function(){
            // alert($(document).scrollTop());
        // }, 3000);

        $('#bigRightArraw').hide();

        this.showAllTimeOut = window.setTimeout(function(){
            objCatalog.showNextAllElements();
        }, 500);



    }

    this.stopShowAll = function() {

        this.showAllJews = false;
        clearTimeout(this.showAllTimeOut);
    }

    this.cancelShowAll = function() {
        this.stopShowAll();
        $('#bigRightArraw').show();
        $('#catalogAjaxAllJews').empty();
        this.showAllPassedFillings = 0;
        $('#nextListingNav').hide();
    }

    this.setFilter = function() {
        for (x in this.arSelect)
        {
            if(this.arSelect[x] === false) {
                this.arSelect[x] = '0';
            }
            this.filter[x] = this.arSelect[x];
            if(this.arSelect[x] == '0') {
                delete this.arSelect[x];
            }

        }
    }

    this.loadedAllPages = false;
    this.defaultPrice = false;

    this.get = function() {




        this.setFilter();
        var request = this.filter;

        request.ajax_mode = 'yes';
        // if(objCatalog.newShowAllJews) {
            // request.show_all = 'yes';
        // }


        // console.log(this.checkFilterChanges());
        if(objCatalog.checkFilterChanges()) {
            request.show_seo = 'no';
            delete request.catalog_page;
        }
        else {
            delete request.show_seo;
            request.catalog_page = catalogPage;
            // delete request.show_seo;
            // for(key in strParams) {
                // console.log(key + ' - ' + strParams[key]);
            // }
        }

        // console.log(request.show_seo);

        request.show_all = false;

        if(this.pages.pagesCount > 0 && request['page'] > this.pages.pagesCount) {
            return;
        }

        var catalogUrl = '/catalog/';
        if(catalogPath) {
            catalogUrl = catalogPath;
        }

        this.startAjax = true;
        $.ajax({
            url: catalogUrl + 'index.php',
            datatype:'html',
            type:'post',
            data:(request),
            cache:false,
            success:function(data)
            {
                // objCatalog.checkFilterChanges();
                // alert(objCatalog.checkFilterChanges());


                // alert(request.show_all);
                // alert(data);
                var oData = $.parseJSON(data);
                // alert(oData.print);
                // console.log(objCatalog.filter.page);
                objCatalog.pages = oData.pages;

                // alert(objCatalog.pages.pagesCount + ' - ' + request['page']);
                if(request['page'] > objCatalog.pages.pagesCount) {

                    objCatalog.loadedAllPages = true;
                    return;
                    // alert(request['page']);
                    // break;
                }
                else {
                    objCatalog.loadedAllPages = false;
                }


                if(!objCatalog.showAllJews) {
                    objCatalog.makePageNav();
                }

                //if(oData.jewsCount > 0) {
                    // alert(oData.pages.total + ' - ' + oData.jewsCount + ' - ' + oData.filter);
                // if(objCatalo.filter['page']
                var noHideSeo = false;

                if(objCatalog.newShowAllJews) {
                    $('#catalogAjaxAllJews').hide();
                    //'' alert(objCatalog.newShowAllJews);
                    // alert(seoPage);
                    // alert(objCatalog.pages.page);
                    if(objCatalog.pages.page == 1 && seoPage && !$('#seoListContainer').is(':visible')) {

                        $('#seoListContainer .innerContainer:not(.withText)').empty();
                        $('#seoListContainer').fadeIn(500);
                        // alert('showSeoPage1');
                        noHideSeo = true;
                        objCatalog.newShowAllJews = false;
                    }
                    else if(!$('#catalogAjax').is(':visible')) {
                        $('#catalogAjax .innerContainer').empty();

                        seoTemplate = false;
                        $('#catalogAjax').fadeIn(500);
                        objCatalog.newShowAllJews = false;
                    }
                }

                arDetails = oData.arDetails;
                // if(oData.seoPage) {
                    // seoPage = true;
                // }
                // else {
                    // seoPage = false;
                // }

                seoPage = oData.seoPage;

                objCatalog.arJews = oData.jews;

                // console.log(objCatalog.changePageProcess + ' - ' + seoPage + ' - ' + oData.seoPage);


                if(($('#seoListContainer').is(':visible') || objCatalog.newShowAllJews) && !noHideSeo && (objCatalog.changePageProcess || objCatalog.checkFilterChanges())) {

                    // console.log('check1');
                    seoTemplate = false;
                    $('#seoListContainer').fadeOut(500);
                    // alert('hideSeoPage2');
                    window.setTimeout(function(){
                        $('#catalogAjax .innerContainer').empty();
                        $('#catalogAjax').fadeIn(500);
                        objCatalog.fillingJews();
                    }, 500);
                }
                else if(objCatalog.pages.page == 1 && seoPage && request.show_seo != 'no') {
                    // console.log('check2');
                    seoTemplate = true;
                    $('#catalogAjax').fadeOut(500);

                    window.setTimeout(function(){

                        $('#seoListContainer .innerContainer:not(.withText)').empty();

                        $('#seoListContainer').fadeIn(500);

                        objCatalog.fillingJews();
                        $('#bigRightArraw').addClass('rightArrowSeo');
                    }, 500);
                }
                else {
                    // console.log('check3');
                    objCatalog.fillingJews();
                }

                // if(objCatalog.newShowAllJews) {
                    // objCatalog.newShowAllJews = false;
                // }

                //}

                if(oData.title && oData.title.length > 0 && objCatalog.checkCancelFilter()) {
                    if(!objCatalog.defaultPrice) {
                        objCatalog.defaultPrice = $('#catalogHeader').text();
                    }
                    $('#catalogHeader').text(oData.title);
                }
                else if(objCatalog.defaultPrice) {
                    $('#catalogHeader').text(objCatalog.defaultPrice);
                }

                if(oData.filter) {
                    objCatalog.ckeckFilter(oData.filter);
                }
                window.setTimeout(function(){
                    objCatalog.startAjax = false;
                    objCatalog.changePageProcess = false;
                    objCatalog.cancelPageFilter = false;

                    if(typeof(sortManager) != 'undefined') {
                        // sortManager();
                        sortManager();
                        addSortManager();
                    }
                }, 1000);

                objCatalog.sendPageDataToGa('#page-' + objCatalog.pages.page);

            }
        });
    }

    this.checkFilterChanges = function()
    {

        if(this.filter.produnct_id) {
            return true;
        }

        for(k in this.arSelect) {
            if(!strParams[k] || strParams[k] != this.arSelect[k]) {
                return true;
            }
        }

        return this.checkCancelFilter();

    }

    this.checkCancelFilter = function()
    {
        for(k in arSelectSave) {
            // console.log(k + ' - ' + arSelectSave[k]);
            if(!this.arSelect[k] || this.arSelect[k] != arSelectSave[k]) {
                return true;
                // console.log(k + ' - ' + arSelectSave[k]);
            }
        }

        return false;
    }

    this.ckeckFilter = function(arrFilter) {
        $('div.containerFilter div.item').each(function(k, v) {
            var id = $(v).attr('id');

            var exists = false;
            for(key in arrFilter) {
                if(id == arrFilter[key]) {
                    exists = true;
                    break
                }
            }

            if(!exists) {
                $(v).hide();
            }
            else {
                $(v).show();
            }
        });
    }

    this.makePageNav = function() {

        content = '';

        // content = content + '<div id=\'showAllJews\'>\
                // <span style=\'color:#f0f0f0\'>&nbsp;&nbsp;&nbsp;|&nbsp;</span>\
            // </div>';

        if(objCatalog.pages.showPrev == true) {
            $('#bigLeftArraw').show();
            content = content + "<div id='leftArrowId' class='arrow leftArrow'><img src='/static/img/catalog.list/big_left.png' alt='' title='������'/></div>";
        }
        else {
            $('#bigLeftArraw').hide();
        }
        var content = content + "<div class='floatLeft'>\
            " + objCatalog.pages.page + " �� " + objCatalog.pages.pagesCount + "<span style='color:#f0f0f0'>&nbsp;&nbsp;|&nbsp;</span>\
            </div>";
        for(key in objCatalog.pages.arPages) {
            var clases = '';
            var page = objCatalog.pages.arPages[key];
            if(page.CURRENT){
                clases = clases + ' redText';
            }
            else {
                clases = clases + ' navPage';
            }

            content = content + "<div id='page" + page.PAGE + "' class=" + clases + ">";
            if(page.MID) {
                content = content + '...';
            }else {
                content = content + page.PAGE;
            }
            content = content + '</div>';
        }
        if(objCatalog.pages.showNext == true) {
            $('#bigRightArraw').show();
            content = content + "<div id='rightArrowId' class='arrow rightArrow'><img src='/static/img/catalog.list/big_right.png' alt='' title='������'/></div>";
        }
        else {
            $('#bigRightArraw').hide();
        }
        $('#pageNavigation').html(content);
        this.bindPageNavEvents();
        // alert(content);
    }

    this.fillingJews = function() {

        if(seoTemplate) {
            objCatalog.jewJewIdent = 'seoJew';
        }
        else {
            objCatalog.jewJewIdent = 'jew';
        }


        if(this.showAllJews) {

            var jewerlyMatrix = this.getJewMatrixToAll();

            if($('#catalogAjaxAllJews').append(jewerlyMatrix)) {
                objCatalog.jewJewIdent = 'jewA';
            }
        }
        else {
            this.currentJew = 0;
        }


        // alert(objCatalog.jewJewIdent);


        $('#bigRightArraw').removeClass('rightArrowSeo');

        // alert(this.currentJew);
        var fillCount = 0;

        for(key in this.arJews) {

            var jew = this.arJews[key];
            this.setJew(jew);
            this.currentJew = this.mathCurrentJew(jew.number);

            fillCount++;
            // catalogHtml = new catalogHtml();
            // additMatrix = catalogHtml.getCatalogBlockHtml(this.currentJew);
            // alert(this.currentJew);
        }

        if(this.currentJew < (this.pages.total - 1)) { //  && !this.showAllJews
            $('#pageNavigation').show();
        }
        else {
            // $('#pageNavigation').hide();
        }

        if(!this.showAllJews) {
            // alert(this.pages.pcount);
            // alert(fillCount);
            while(fillCount < this.pages.pcount) {
                this.setEmpty(fillCount);
                fillCount++;
            }
        }


        this.bindListEvents();
    }


    this.mathCurrentJew = function(num) {
        // if(this.filter['page'] <= 1) {
            // return num;
        // }
        return num + ((this.filter['page'] - 1) * 12);
    }

    this.getJewMatrixToAll = function() {

        var content = '';

        content = '\
            <table>\
                <tr>\
                    <td id=\'jewA' + this.currentJew + '\' colspan=\'2\' rowspan=\'2\' class="product big popright"></td>\
                    <td id=\'jewA' + (this.currentJew + 1) + '\' class="product popRightSmall"></td>\
                    <td id=\'jewA' + (this.currentJew + 2) + '\' class="product popLeftSmall"></td>\
                    <td id=\'jewA' + (this.currentJew + 3) + '\' class="product popLeftSmall"></td>\
                    <td id=\'jewA' + (this.currentJew + 4) + '\' class="product popLeftSmall"></td>\
                </tr>\
                <tr>\
                    <td id=\'jewA' + (this.currentJew + 5) + '\' class="product popRightSmall"></td>\
                    <td id=\'jewA' + (this.currentJew + 6) + '\' class="product popLeftSmall"></td>\
                    <td id=\'jewA' + (this.currentJew + 7) + '\' colspan=\'2\' rowspan=\'2\' class="product big popleft"></td>\
                </tr>\
                <tr>\
                    <td id=\'jewA' + (this.currentJew + 8) + '\' class="product popRightSmall"></td>\
                    <td id=\'jewA' + (this.currentJew + 9) + '\' class="product popRightSmall"></td>\
                    <td id=\'jewA' + (this.currentJew + 10) + '\' class="product popRightSmall"></td>\
                    <td id=\'jewA' + (this.currentJew + 11) + '\' class="product popLeftSmall"></td>\
                </tr>\
            </table>\
        ';

        return content;
    }


    this.setEmpty = function(id) {


        $('#' + objCatalog.jewJewIdent + id + ' .innerContainer img').fadeOut(500);

        window.setTimeout(function(){
            $('#' + objCatalog.jewJewIdent + id + ' .innerContainer').html("<div class='emptyBlock'></div>");
        }, 500);
    }

    this.setJew = function(jew) {

        // if(!moscowGeoCity) {
            // jew.price = jew.old_price;
        // }

        // if(fbGameJew == jew.id) {
            // alert(fbGameJew);
        // }

        if(aOnyxDaysJews) {
            for(k in aOnyxDaysJews) {
                if(aOnyxDaysJews[k].id == jew.id) {
                    // console.log(aOnyxDaysJews[k].price);
                    jew.old_price = jew.price;
                    jew.price = aOnyxDaysJews[k].price;
                }
            }
        }

        var price = jew.price + '�';
        if(jew.price2 > 0 && moscowGeoCity) {
            jew.price = jew.price2;
            price = jew.price2 + '� <div class="priceValueConnent">���� ��������� � ��������� ������� ������ ������</div>';
        }
        // console.log(seoPage);
        // console.log(seoTemplate);

        var oldPrice = '';
        var oldPriceFirst = '';
        var withPriceClass = '';
        if(Math.floor(jew.old_price) > Math.floor(jew.price)) {
            oldPrice = '<div class=\'oldPrice\'>' + jew.old_price + ' �.</div>';
            if(seoTemplate) {
                oldPriceFirst = '<div style="margin-top: 10px;" class=\'oldPriceFirst\'>' + jew.old_price + ' �.</div>';
            }
            else {
                oldPriceFirst = '<div style="margin-top: 10px;" class=\'oldPrice\'>' + jew.old_price + ' �.</div>';
            }
            withPriceClass = ' withOldPriceContainer';
        }


        if(aJewsIds && !moscowGeoCity) {
            for(k in aJewsIds) {
                if(aJewsIds[k] == jew.id) {
                    oldPriceFirst = '';
                    jew.price = '<br />' + jew.old_price;
                    oldPrice = '';
                    price = jew.old_price + '�';
                }
            }
        }





        // console.log(jew.code + oldPriceFirst + ' ' + jew.old_price + ' ' + jew.price);
        var basketButton  = '<br />';
        var addClassOrd='';
        if(jew.sprice && jew.quantity) {
            basketButton = '<div><a href=\'\' class=\'addInBasketLink\' onclick="addPropductInBasket(this); return false;">� �������</a></div>';
            /*addClassOrd='ordpoint';*/
            addClassOrd='<img src="/static/img/korzina_.png" border="0" width="14" height="10" class="basket">';
        }

        var content = "\
        <div class='innerContainer' id='pr" + jew.id + "'>\
            <div class='show'>\
                <div class='decription'>\
                    <div class='seoDetailText' style='display: block;'> ��� �������: " + jew.code + "<br />" + jew.text + "</div>"
                    + oldPrice +
                    "<div class='showPrice '>" + price + "</div>"
                    + basketButton +
                     "<div><a href='/shops/locator.php'>������ �������</a></div>\
                </div>\
            </div>\
            <div class='contain'>\
                <div class='photo'>\
                        <a href='" + jew.url + "'><img src='" + jew.photo + "' alt='" + jew.text + "' title='" + jew.text + "'/></a>\
                </div>\
                <div class='pricesContainer" + withPriceClass +"'>"
                    + oldPriceFirst +
                    "<div class='price'>"+addClassOrd + jew.price + " �.</div>\
                </div>\
        </div>";

        var id = jew.number;
        if(this.showAllJews) {
            id = this.currentJew;
            // id = id + ((this.filter['page'] - 1) * 12);
            // id = id - 12;
            // alert(id);
        }



        var contaner = $('#' + objCatalog.jewJewIdent + id);
        // console.log(jew.number);


        if(fbGameJewId == jew.id) {
            // alert(fbGameJewId);
            // var offset = contaner.offset();
            // $('#fbGameContainer').show();
            // $('#fbGameContainer').css('top', (offset.top + 10) + 'px');
            // $('#fbGameContainer').css('left', (offset.left + 10) + 'px');
            // if($.browser.msie) {
                // $('#fbGameContainer').css('top', (offset.top - 610) + 'px');
                // $('#fbGameContainer').css('left', (offset.left + 20) + 'px');
            // }
        }
        else {
            // $('#fbGameContainer').hide();
        }

        if(jew.sorted == 1){
            contaner.addClass('sortedItem');
        }
        else {
            contaner.removeClass('sortedItem');
        }
        // var contaner = td.find('.innerContainer');
        contaner.find('.innerContainer').attr('id', 'pr' + jew.id);
        contaner.find('.photo').fadeOut(500);
        window.setTimeout(function(){
            contaner.html(content);

            contaner.find('.photo img').hide();
            contaner.find('.photo img').load(function() {
                contaner.find('.photo img').fadeIn(1000);
                hidetitle();
                // objCatalog.bindJewsHover(contaner.find('.photo img'));
            });

        }, 500);


        if(fbGameJewId == jew.id) {
            // console.log(jew);
            window.setTimeout(function(){
                var offset = contaner.offset();

                if(offset) {

                    var seoHeight = $('#seoListContainer').height();
                    var top = offset.top
                    if(seoHeight > 0 && top > seoHeight) {
                        top -= seoHeight;
                        top -= 10;
                        console.log(top + '--' + seoHeight);
                    }

                    var mLeft = 75;
                    var mTop = 115;
                    if(contaner.hasClass('big')) {
                        mLeft = 220;
                        mTop = 260;
                    }


                    $('#fbGameContainer').css('top', (top + mTop) + 'px');
                    $('#fbGameContainer').css('left', (offset.left + mLeft) + 'px');

                    $('#fbGameContainer').show();


                }
            }, 1000);
        }

    }

    this.bindListEvents = function() {
        // alert(true);
        if(!catalogNoDesc) {
            $('.product, div.innerContainer').hover(
                function ()
                {
                    // alert($(this).attr('id'));
                    if($(this).hasClass('empty')) {
                        return;
                    }
                    objCatalog.mHovered = this;
                    var thisObj = this;
                    window.setTimeout(function(){objCatalog.showDelay(thisObj)}, 600);
                },
                function (){
                    if(!objCatalog.mHovered) {
                        return;
                    }
                    $(objCatalog.mHovered).find('.show').hide();
                    $(objCatalog.mHovered).find('.contain').css({
                        'z-index' : '50',
                        'border-color' : '#efedee'
                    });
                    objCatalog.mHovered = false;
                }
            );
        }
        else {
            $('.product img, div.innerContainer img').attr('title', '');
        }


        // for(key in arDetails) {
            // this.bindJewsHover($('#jew' + key + ' .photo img'));
        // }

    }

    this.bigPictureIdNum = false;

    this.bindJewsHover = function(img) {
        var photoToShow;

        $('#jew0 .photo img').attr('src_', $('#jew0 .photo img').attr('src'));
        $('#jew7 .photo img').attr('src_', $('#jew7 .photo img').attr('src'));

        $(img).hover(function () {

            var curId = $(this).parent().parent().parent().parent().parent().attr('id').substr(3, 10);
            if(in_array(curId, photoFirst)) {
                photoToShow = 0;
                // alert(curId);
            }
            else {
                photoToShow = 7;
            }


            this.bigPictureIdNum = photoToShow;
            var photoToChange = $('#' + objCatalog.jewJewIdent + photoToShow + ' .photo img');
            if(photoToChange != objCatalog.currentPhotoToChange) {
                objCatalog.startAinmateGigIMageChange = false;
                // alert(true);
            }
            objCatalog.bigImageToChange = arDetails[curId];
            objCatalog.currentPhotoToChange = photoToChange;
            if(!objCatalog.startAinmateGigIMageChange) {
                $(photoToChange).fadeOut(500, function() {
                    var changedPict = false;
                    if(objCatalog.bigPictureIdNum != photoToShow) {
                        changedPict = true;
                        // alert(true);
                    }
                    objCatalog.bigPictureIdNum = photoToShow;
                    objCatalog.showGibImage(false, true, false, changedPict);
                });
            }


            // alert($(photoToChange).attr('class'));
            //$(this).a(arDetails[key]);
        },
        function () {
            var curId = $(this).parent().parent().parent().parent().parent().attr('id').substr(3, 10);
            if(in_array(curId, photoFirst)) {
                photoToShow = 0;
                // alert(curId);
            }
            else {
                photoToShow = 7;
            }


            var photoToChange = $('#' + objCatalog.jewJewIdent + photoToShow + ' .photo img');
            objCatalog.bigImageToChange = $(photoToChange).attr('src_');

            $(photoToChange).fadeOut(500, function() {
                objCatalog.showGibImage(this, false, $(photoToChange).attr('src_'), false);
            });
        });
    }

    this.makeImgBig = function () {

    }

    this.makeImgSmall = function () {

    }

    this.bigImageToChange = false;
    this.startAinmateGigIMageChange = false;
    this.currentPhotoToChange = false;


    this.showGibImage = function (obj, big, image, changed) {
        if(this.startAinmateGigIMageChange && !changed) {
            return;
        }
        if(!obj) {
            obj = this.currentPhotoToChange;
        }

        if(!image) {
            image = this.bigImageToChange;
        }
        this.startAinmateGigIMageChange = true;
        // alert(this.bigImageToChange);
        $(obj).attr('src', image);
        if(!big) {
            $(obj).removeClass('bigImageClass');
        }
        else {
            $(obj).addClass('bigImageClass');
        }
        $(obj).fadeIn(500, function() {
            objCatalog.startAinmateGigIMageChange = false;
        });
    }

    this.showDelay = function (tobj) {
        if(objCatalog.mHovered != tobj) {
            return false;
        }
        var show = $(tobj).find('.show');
        var container = $(tobj).find('.contain');
        show.show();
        container.css({
            'z-index' : '500',
            'border-color' : '#FFFFFF'
        });
    }

    this.setFilterFields = function () {
        for(x in strParams) {
            this.filter[x] = strParams[x];

            var menuItem = $('#'+x);
            var item = menuItem.find('#'+x+strParams[x]);

            if(item.attr('id')) {
                this.selectFilter(menuItem, item, item.text());
            }


        }

        if(!arSelectSave) {
            for(k in this.arSelect) {
                arSelectSave = {};
                arSelectSave[k] = this.arSelect[k];
            }

        }
    }


    this.changePageProcess = false;
    this.bindPageNavEvents = function() {

        $('#showAllJews').click(function() {

            if(objCatalog.newShowAllJews) {
                objCatalog.get();
            }
            else {
                objCatalog.newShowAllJews = true;


                var request = objCatalog.filter;
                request.ajax_mode = 'yes';
                request.show_all = 'yes';

                catalogManager.showAllJews(request);
            }
            // objCatalog.showNextAllElements();
            // $(window).scrollTop(0);

            // window.location.href = window.location.href + '?show_all=yes';
        });

        $('.navPage').click(function() {

            objCatalog.cancelShowAll();
            objCatalog.filter['page'] = $(this).attr('id').substr(4);
            objCatalog.changePageProcess = true
            objCatalog.get();
        });

        // ������ �������
        $('#rightArrowId, #bigRightArraw').click(function() {
            // objCatalog.showAllJews = false;
            objCatalog.cancelShowAll();
            window.setTimeout(function(){
                if(objCatalog.startAjax == false) {
                    // objCatalog.startAjax = true;

                    if(!objCatalog.filter['page']) {
                        objCatalog.filter['page'] = 1;
                        if(strParams.page_number) {
                            objCatalog.filter['page'] = strParams.page_number;
                        }
                    }

                    objCatalog.filter['page']++;
                    objCatalog.changePageProcess = true
                    objCatalog.get();
                }
            }, 500);
        });

        $('#leftArrowId, #bigLeftArraw').click(function() {
            // objCatalog.showAllJews = false;
            objCatalog.cancelShowAll();
            window.setTimeout(function(){
                if(objCatalog.startAjax == false) {
                    objCatalog.startAjax = true;

                    if(!objCatalog.filter['page']) {
                        objCatalog.filter['page'] = 1;
                        if(strParams.page_number) {
                            objCatalog.filter['page'] = strParams.page_number;
                        }
                    }

                    objCatalog.filter['page']--;
                    objCatalog.changePageProcess = true
                    objCatalog.get();
                }
            }, 500);
        });
    }
    // ���������� ��� ���������� ������
    // ��� ������� �� ������� ������� �������� �������������
    this.selectFilter = function(objField, objItem, text) {
        //alert();



        var field = objField.find('.field');
        var title = false;
        // ���� ������ ��� ��� ������ - �������� ���



        if(this.arSelect[objField.attr('id')]) {


            if(strParams[objField.attr('id')] && seoPage) {
                seoPage = false;
                seoTemplate = false;

                this.cancelPageFilter = true;

                delete strParams.catalog_page;

                delete this.filter.catalog_page;
            }

            field.css({
                'background-image':'url("/static/img/catalog.list/bg_select_w.png")',
                'background-position' : '33px',
                'background-repeat' : 'no-repeat',
                'background-color' : '#ffffff',
                'color':'#767583'
            });
            field.find('span.fieldSelect').hide();
            field.find('span.fieldTitle').show();
            title = field.find('span.fieldTitle');
            this.arSelect[objField.attr('id')] = false;
            // console.log(this.filter[objField.attr('id')]);

            delete this.arSelect[objField.attr('id')];
            delete this.filter[objField.attr('id')];

        } // ����� ��������
        else {

            seoTemplate = false;

            field.css({
                'color':'#FFFFFF',
                'background' : '#e70f0b'
            });

            field.find('span.fieldTitle').hide();
            field.find('span.fieldSelect').show();
            title = field.find('span.fieldSelect');
            this.arSelect[objField.attr('id')] = objItem.attr('id').substr(objField.attr('id').length);

            if(!strParams[objField.attr('id')]) {
                delete strParams.catalog_page;
                delete this.filter.catalog_page;
            }

        }

        // ���� ������ ������ - ��������� ������ ������ � ���� ����� ������ ������
        if(objItem) {
            field.find('span.fieldSelect').text(objItem.text());

            if(field.find('span.fieldSelect').width() > (field.find('span.fieldSelect').parent().width()-20)){
                field.find('span.fieldSelect').parent().css('padding-right', '15px');
            }
        }
        else {
            field.find('span.fieldSelect').text(text);
        }

        // ���� �������� ������ � 2 ������, �� ������ ������
        var paddingTop = 5;
        var paddingBottom = 0;
        if(title.height() > 15) {
            paddingTop = 0;
            paddingBottom = 5;
        }
        else {
            paddingTop = 5;
            paddingBottom = 0;
        }
        field.css({
            'padding-top':paddingTop+'px',
            'padding-bottom':paddingBottom+'px'
        });

    }


    this.ceckIdField = function(obj) {
        var id = $(obj).attr('value');
        if(this.getId != id) {
            if(id.length > 2) {
                this.filter['produnct_id'] = id;
                this.get();
            }
            else if(id == 0) {
                this.filter['produnct_id'] = '0';
                this.get();
            }
            this.getId = id;
        }

        window.setTimeout(function() {objCatalog.ceckIdField(obj)}, 500);
    }
}

$(document).ready(function() {
	// catalogManager = new catalogManager();
	// catalogManager.init();
});


function catalogManager()
{
	this.catalogData = new catalogData();
	this.catalogHtml = new catalogHtml();
	
	this.init = function()
	{
		
	};
	
	this.showAllJews = function(request)
	{
		this.catalogData.request = request;
		var catalogManager = this;
		
		this.catalogData.load(function() {
			var jewsData = catalogManager.catalogData.getJson();
			var blocksCount = Math.ceil(jewsData.jewsCount/12);
			
			// var jewsCount = jewsData.pages.pcount - 1;
			
			catalogManager.catalogHtml.clearAllBlock();
			
			for(i = 1; i <= blocksCount; i++) {
				catalogManager.catalogHtml.addBlockToAll(jewsData.pages.pcount * (i - 1), i);
			}
			
			
			catalogManager.catalogHtml.showMatrixAll();
			
			for(key in jewsData.jews) {
				catalogManager.catalogHtml.setJew(jewsData.jews[key]);
			}
			
			
			catalogManager.catalogHtml.hideDefaultMatrix();
			catalogManager.catalogHtml.hideSeoMatrix();
			// alert(request.page);
			if(request.page && request.page > 1) {
				catalogManager.catalogHtml.moveToPage(request.page);
				window.setTimeout(function(){
					catalogManager.catalogHtml.moveToPage(request.page);
				}, 500);
			}
			
			catalogManager.catalogHtml.hideArrows();
		});
	}
}

function in_array(val, array)
{
	for(key in array) {
		if(val == array[key]) {
			return true;
		}
	}
	return false;
}

//===================================================TEST!!!!!!!!!!!!!!!!!

