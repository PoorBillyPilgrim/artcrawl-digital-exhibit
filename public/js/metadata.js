// 'use strict';

// #metadata-img width is unavailable in DOM because of object-fit: scale-down 
// These functions grab #metadata-img width after scale down
// https://stackoverflow.com/questions/37256745/object-fit-get-resulting-dimensions
function getRenderedSize(contains, cWidth, cHeight, width, height, pos) {
    var oRatio = width / height,
        cRatio = cWidth / cHeight;
    return function () {
        if (contains ? (oRatio > cRatio) : (oRatio < cRatio)) {
            this.width = cWidth;
            this.height = cWidth / oRatio;
        } else {
            this.width = cHeight * oRatio;
            this.height = cHeight;
        }
        this.left = (cWidth - this.width) * (pos / 100);
        this.right = this.width + this.left;
        return this;
    }.call({});
}

function getImgSizeInfo(img) {
    var pos = window.getComputedStyle(img).getPropertyValue('object-position').split(' ');
    return getRenderedSize(true,
        img.width,
        img.height,
        img.naturalWidth,
        img.naturalHeight,
        parseInt(pos[0]));
}

// This will grab all the data-* attributes of an HTML element
// Not sure if I will use or not...
/*
function getDataNames() {
    var el = document.getElementById('0');
    var arr = el.getAttributeNames();
    var dataArr = [];
    arr.forEach(x => {
        if (x.includes('data-')) {
            dataArr.push(x);
        }
    });
}
*/

function getDataAttributes(gridItem) {
    return {
        name: gridItem.attr('data-last-name'), 
        title: gridItem.attr('data-title'),
        major: gridItem.attr('data-major'),
        statement: gridItem.attr('data-artist-statement')
    }
}

function renderMetadataImg($metadata, dataAttributes, $metadataImg = document.querySelector('#metadata-img')) {
    var imgSize = getImgSizeInfo($metadataImg);
    $metadata.css({
        'left': imgSize.left,
        'max-width': imgSize.width
    });
    $metadata.html('<strong>' + dataAttributes.name + '</strong>' + ', ' + dataAttributes.title + ', ' + dataAttributes.major)
}

function debounce(func, wait, immediate) {
	var timeout;
	return function() {
		var context = this, args = arguments;
		var later = function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
};

function handleHighlight() {
    var gridItemID;
    gridItemID = $('.art-crawl-item.highlight').attr('id');
    $('.art-crawl-item').removeClass('highlight');
    setTimeout(function() {   
        $("#" + gridItemID).addClass('highlight');
    }, 2700); // grid speed is set to 2650ms
}

var Metadata = (function () {
    let viewer, img, dataAttributes, gridItemID, dziID;

    const init = function() {
        const loc = window.location;
        let id;
        if (loc.hash) {
            // parse hash params
            // https://stackoverflow.com/questions/23699666/javascript-get-and-set-url-hash-parameters
            let hash = loc.hash.substr(1);
            let params = _getHashParams(hash);
            id = params.id;
            dataAttributes = getDataAttributes($('#' + id));
        } else {
            // #metadata first loads with metadata of first grid item
            id = '0';
            dataAttributes = getDataAttributes($('#0'));
        }

        img = $('#' + id).find('img').attr('src');
        $('#metadata-img').attr('src', img);
        $('#metadata-img').on('load', renderMetadataImg($('#metadata-caption'), dataAttributes));


        openViewer();
        closeViewer();
        renderMetadata();
        onResize();
        renderColor();
        //handleSortChange();

        $('#' + id).addClass('highlight');
    }

    function _initViewer(id) {
        $('#openseadragon').toggleClass('show');
        $('#openseadragon-close').removeClass('hide');
        $('#html-overlay').removeClass('hide');
        $('.artcrawl-container').addClass('hide');
        viewer = OpenSeadragon({
            id: 'openseadragon',
            prefixUrl: '/images/dzi/images/navImages/',
            tileSources: '/images/dzi/images/image' + id + '.dzi',
            overlays:[{
                id: 'html-overlay',
                x: 1,
                y: 0
            }]
        });
    }
    
    function _getHashParams(arr) {
        return arr.split('&').reduce(function(result, item) {
            let parts = item.split('=');
            result[parts[0]] = parts[1];
            return result;
        }, {});
    }
    
    const openViewer = function() {
        const loc = window.location;
        if (loc.hash) {
            $('#hero').addClass('hide');
            // parse hash params
            // https://stackoverflow.com/questions/23699666/javascript-get-and-set-url-hash-parameters
            let hash = loc.hash.substr(1);
            let params = _getHashParams(hash);
            // add dataAttributes to #html-overlay
            _initViewer(params.dziID);
        }

        $('#metadata-img').click(function () {
            dziID = $('.art-crawl-item.highlight').attr('data-dzi-id') || '0';
            gridItemID = $('.art-crawl-item.highlight').attr('id') || '0';
            $('#legend').addClass('hide');
            $('#hero').addClass('hide');
            _initViewer(dziID);
            
            // Still need to populate first parameter 'state' with a valid entry
            history.pushState({undefined: undefined}, undefined, window.location.hash = '#dziID=' + dziID + '&id=' + gridItemID); 
        });
    }

    const closeViewer = function() {
        $('#openseadragon-close').click(function () {
            let params = _getHashParams(window.location.hash.substr(1));
            
            $('#openseadragon').removeClass('show');
            $('#openseadragon-close').addClass('hide');
            $('.artcrawl-container').removeClass('hide');
            $('#hero').removeClass('hide');
            if($('.art-crawl-item > img').hasClass('active')) {
                $('#legend').removeClass('hide');
            }
            
            viewer.destroy();
            viewer = null;
            
            window.location.hash = 'artcrawl';

            history.pushState({undefined: undefined}, undefined, window.location.pathname); // resets URL to root

            //gridItemID = $('.art-crawl-item.highlight').attr('id') || '0';
            //$('.art-crawl-item').removeClass('highlight');
            shuffle.update();
            $("#" + params.id).addClass('highlight');
            $('<div id="html-overlay" class="hide">' + '</div>').insertBefore('#legend');
        });
    }

    const renderMetadata = function() {
        $('.art-crawl-item').click(function () {
            
            //$('.art-crawl-item.highlight > img').css({'opacity': '0'});
            //
            dataAttributes = getDataAttributes($(this));
            img = $(this).find('img').attr('src');
            //$('#metadata-span').css('background-color', '')
    
            $('#metadata.active').css('opacity', 0);
            setTimeout(function () {
                $('#metadata-img').attr('src', img);
                renderMetadataImg($('#metadata-caption'), dataAttributes);
                $('#metadata.active').css('opacity', 1);
            }, 550);
    
            // orange highlight on click
            if (!$(this).hasClass('highlight')) {
                $('.art-crawl-item').removeClass('highlight');
                $(this).addClass('highlight');
            } else {
                $(this).addClass('highlight');
            }

            let activeColor = $('.art-crawl-item.highlight').css('background-color');
            $('#legend').css({'background-color': activeColor});
            
        });
    }

    const onResize = function() {
        let $metadataImg;
        
        $('#metadata').click(function () {
            $metadataImg = document.querySelector('#metadata-img');
        });

        let width;
        width = $(window).width();
        
        $(window).resize(debounce(function () {
            // Because mobile browsers register scroll as window resize,
            // this checks for only change in width
            // https://stackoverflow.com/questions/17328742/mobile-chrome-fires-resize-event-on-scroll
            if ($(window).width() != width) {
                gridItemID = $('.art-crawl-item.highlight').attr('id');
                dataAttributes = getDataAttributes($('#' + gridItemID));
                img = $('#' + gridItemID).find('img').attr('src');
    
                // fadeout metadata
                $('#metadata-caption').css('opacity', 0);         
                $('#metadata.active').css('opacity', 0);
    
                // fades in $metadata after 0.55s
                setTimeout(function() {
                    // console.log($metadataImg)
                    $('#metadata-img').attr('src', img);
                    renderMetadataImg($('#metadata-caption'), dataAttributes, $metadataImg);
                    $('#metadata-caption').css('opacity', 1);
                    $('#metadata.active').css('opacity', 1);
                }, 750);
            }
        }, 1000, true));
    }

    const renderColor = function() {
        let colors = {"Industrial Design":{"count":2,"color":"#f257c1"},"BME":{"count":5,"color":"#2f538e"},"Mechanical Engineering":{"count":13,"color":"#4c4eb2"},"Physics and LMC":{"count":1,"color":"#e076d2"},"Computer Science":{"count":18,"color":"#295b93"},"Architecture":{"count":6,"color":"#b4fcae"},"Chemical & Biomolecular Engineering":{"count":1,"color":"#83fc9d"},"Industrial Engineering":{"count":3,"color":"#6d22b7"},"LMC":{"count":1,"color":"#ef5f7a"},"Electrical Engineering":{"count":3,"color":"#db6087"},"Aerospace":{"count":1,"color":"#9f63ed"},"Master of City and Regional Planning":{"count":1,"color":"#04edbe"},"Neuroscience":{"count":5,"color":"#d863c5"},"physics":{"count":1,"color":"#e1e569"},"Computer Science (PhD)":{"count":1,"color":"#3ffc8a"},"Biomedical Engineering":{"count":10,"color":"#ba5d1b"},"CS":{"count":1,"color":"#5df4e5"},"Civil Engineering":{"count":3,"color":"#b0f716"},"Aerospace Engineering":{"count":5,"color":"#ffba66"},"Architect":{"count":2,"color":"#00c197"},"Biochemistry":{"count":3,"color":"#af68ed"},"ME":{"count":4,"color":"#b7daf7"},"Biomedical Engineering & ALIS":{"count":1,"color":"#fcdf6c"},"Industrial & Systems Engineering":{"count":1,"color":"#cc186c"},"Business Administration":{"count":4,"color":"#df6cfc"},"Chemical Engineering":{"count":2,"color":"#ed2bff"},"Biology":{"count":4,"color":"#f9978e"},"Robotics":{"count":1,"color":"#ef6eb3"},"Bioinformatics":{"count":1,"color":"#c67d0f"},"English":{"count":1,"color":"#359099"},"Computer Engineer":{"count":1,"color":"#e0003f"},"ALIS":{"count":1,"color":"#28cc7f"},"Mathematics":{"count":1,"color":"#5d22cc"},"Computer Engineering":{"count":2,"color":"#98e559"},"Materials Science and Engineering":{"count":2,"color":"#ed6a9a"},"BMED":{"count":1,"color":"#d0afed"},"MSE":{"count":1,"color":"#f699ff"},"EE":{"count":1,"color":"#d33295"},"Online Master of Science in Analytics":{"count":1,"color":"#dc59f9"},"ECE":{"count":1,"color":"#75efe5"},"ARCHITECTURE":{"count":1,"color":"#3c36b5"},"HTS":{"count":1,"color":"#6be845"},"M.S. Global Media and Cultures":{"count":1,"color":"#8de8c0"},"Physics":{"count":2,"color":"#55db57"},"Computational Media":{"count":2,"color":"#3f70af"},"Master of Architecture":{"count":1,"color":"#ea4c3a"},"Environmental Engineering":{"count":2,"color":"#edb0a8"},"Literature, Media and Communication":{"count":1,"color":"#b516f4"},"AE":{"count":1,"color":"#b9ed95"},"Chemical and Biomolecular Engineering":{"count":1,"color":"#d3ef97"},"Literature, Media, and Communication":{"count":1,"color":"#f4c6ff"},"Psychology":{"count":1,"color":"#f9eeae"}};

        $('#color-btn').click(function() {
            $('.art-crawl-item > img').toggleClass('active');
            $('#legend').toggleClass('hide');

            let figures = document.querySelectorAll('.art-crawl-item');
            figures.forEach(figure => {
                let major = figure.attributes.getNamedItem('data-major').value;
                figure.style.backgroundColor = colors[major].color;
            });
            
            let activeColor = $('.art-crawl-item.highlight').css('background-color');
            $('#legend').css('background-color', activeColor);
        });
    }

    // I don't think I need now after adding highlight to .art-crawl-item > img
    const handleSortChange = function() {
        const btnGroup = document.querySelector('.sort-options');
        if (!btnGroup) { return; }
        btnGroup.addEventListener('click', handleHighlight);
    }

    return {
        init: init
    }
})();
