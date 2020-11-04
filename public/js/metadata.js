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
        major: gridItem.attr('data-major')
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
        //handleSortChange();

        $('#' + id).addClass('highlight');
    }

    function _initViewer(id) {
        $('#openseadragon').toggleClass('show');
        $('#openseadragon-close').removeClass('hide');
        $('.artcrawl-container').addClass('hide');
        viewer = OpenSeadragon({
            id: 'openseadragon',
            prefixUrl: '/images/dzi/images/navImages/',
            tileSources: '/images/dzi/images/image' + id + '.dzi'
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
            // parse hash params
            // https://stackoverflow.com/questions/23699666/javascript-get-and-set-url-hash-parameters
            let hash = loc.hash.substr(1);
            let params = _getHashParams(hash);
            _initViewer(params.dziID);
        }

        $('#metadata-img').click(function () {
            dziID = $('.art-crawl-item.highlight').attr('data-dzi-id') || '0';
            gridItemID = $('.art-crawl-item.highlight').attr('id') || '0';
            $('#legend').addClass('hide');
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
            if($('.art-crawl-item > img').hasClass('active')) {
                $('#legend').removeClass('hide');
            }
            
            viewer.destroy();
            viewer = null;
            
            history.pushState({undefined: undefined}, undefined, window.location.pathname); // resets URL to root

            //gridItemID = $('.art-crawl-item.highlight').attr('id') || '0';
            //$('.art-crawl-item').removeClass('highlight');
            shuffle.update();
            $("#" + params.id).addClass('highlight');
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
        $(window).resize(debounce(function () {
            
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
                }, 550);

            }

            /*
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
            }, 550); */

            /*$('#' + gridItemID).removeClass('highlight');
            
            // adds highlight back after 2.7s
            setTimeout(function () {
                //grid.shuffle.update();
                $('#' + gridItemID).addClass('highlight');
            }, 2700);
            //grid.shuffle.update();
            shuffle.update(); */
        }, 1000, true));
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




/*
// JQuery for #metadata div
$(document).ready(function () {
    
    // on DOM load
    var $metadata, $metadataImg, $gridItem;
    var img;
    var dataAttributes, gridItemID;
    gridItemID = '0'; // gets first figure in shuffleJS grid
    $metadata = $('#metadata-caption');
    $metadataImg = $('#metadata-img');
    
    dataAttributes = getDataAttributes($('#' + gridItemID));
    // ({name, title, major} = getDataAttributes($gridItem)); A destructuring alternative
    img = $('#' + gridItemID).find('img').attr('src');
    $metadataImg.attr('src', img);
    $metadataImg.on('load', renderMetadataImg($metadata, dataAttributes));
    // $gridItem.addClass('highlight')
    $('.art-crawl-item').click(function () {
        
        dataAttributes = getDataAttributes($(this));
        img = $(this).find('img').attr('src');
        $('#metadata.active').css('opacity', 0);
        setTimeout(function () {
            $metadataImg.attr('src', img);
            renderMetadataImg($metadata, dataAttributes);
            $('#metadata.active').css('opacity', 1);
        }, 550);
        // orange highlight on click
        if (!$(this).hasClass('highlight')) {
            $('.art-crawl-item').removeClass('highlight');
            $(this).addClass('highlight');
        } else {
            $(this).addClass('highlight');
        }
    });
    /*
    * OpenSeadragon Viewer
    
    var viewer; 
    // on viewer open
    $metadataImg.click(function () {
        var $artCrawlItemHighlight;
        $artCrawlItemHighlight = $('.art-crawl-item.highlight').attr('id') || '0';
        
        $('#openseadragon').toggleClass('show');
        $('#openseadragon-close').removeClass('hide');
        $('.artcrawl-container').addClass('hide');
        viewer = OpenSeadragon({
            id: 'openseadragon',
            prefixUrl: '/images/dzi/images/navImages/',
            tileSources: '/images/dzi/images/image' + $artCrawlItemHighlight + '.dzi',
        })
    });
    // on viewer close
    $('#openseadragon-close').click(function () {
        $('#openseadragon').removeClass('show');
        $('#openseadragon-close').addClass('hide');
        $('.artcrawl-container').removeClass('hide');
        viewer.destroy();
        viewer = null;
        
        var $artCrawlItemHighlight = $('.art-crawl-item.highlight').attr('id');
        $('.art-crawl-item').removeClass('highlight');
        grid.shuffle.update();
        
        $('#' + $artCrawlItemHighlight).addClass('highlight');
    });
    // handle highlight on grid sort
    const btnGroup = document.querySelector('.sort-options');
    if (!btnGroup) { return; }
    btnGroup.addEventListener('click', handleHighlight);
    // handle highlight on window resize
    $(window).resize(debounce(function () {
            
            $metadata = $('#metadata-caption');
            gridItemID = $('.art-crawl-item.highlight').attr('id') || '0';
            dataAttributes = getDataAttributes($('#' + gridItemID));
            img = $('#' + gridItemID).find('img').attr('src');
            console.log(gridItemID);
            console.log(dataAttributes);
            console.log(img);
            
            // fadeout metadata
            $metadata.css('opacity', 0);         
            $('#metadata.active').css('opacity', 0);
            // fades in $metadata after 0.55s
            setTimeout(function () {
                $metadataImg.attr('src', img);
                renderMetadataImg($metadata, dataAttributes);
                $metadata.css('opacity', 1);
                $('#metadata.active').css('opacity', 1);
                
            }, 550);
            $('#' + gridItemID).removeClass('highlight');
            
            // adds highlight back after 2.7s
            setTimeout(function () {
                grid.shuffle.update();
                if (gridItemID !== '0') {
                    $('#' + gridItemID).addClass('highlight');
                }
            }, 2700);
        }, 1000, true)); 
}); */