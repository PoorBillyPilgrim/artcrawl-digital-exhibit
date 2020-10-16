// #metadata-img width is unavailable in DOM  because of object-fit: scale-down 
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
function getDataNames() {
    let el = document.getElementById('0');
    let arr = el.getAttributeNames();
    let dataArr = [];
    arr.forEach(x => {
        if (x.includes('data-')) {
            dataArr.push(x);
        }
    });
}

function getDataAttributes(gridItem) {
    return {
        name: gridItem.attr('data-last-name'), 
        title: gridItem.attr('data-title'),
        major: gridItem.attr('data-major')
    }
}

function renderMetadataImg($metadata, dataAttributes) {
    let imgSize = getImgSizeInfo(document.querySelector('#metadata-img'));
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
    let $artCrawlItemHighlight;
    $artCrawlItemHighlight = $('.art-crawl-item.highlight').attr('id')
    $('.art-crawl-item').removeClass('highlight');
    setTimeout(function() {
        $('#' + $artCrawlItemHighlight).addClass('highlight');
    }, 2700); // grid speed is set to 2650ms
}

// JQuery for #metadata div
$(document).ready(function () {
    // on DOM load
    let $gridItem, $metadata, $metadataImg;
    let img;
    let dataAttributes;

    $gridItem = $('#0'); // gets first figure in shuffleJS grid
    $metadata = $('#metadata-caption');
    $metadataImg = $('#metadata-img');

    dataAttributes = getDataAttributes($gridItem);
    // ({name, title, major} = getDataAttributes($gridItem)); A destructuring alternative
    img = $gridItem.find('img').attr('src');

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
    */
    var viewer; 
    // on viewer open
    $metadataImg.click(function () {
        let $artCrawlItemHighlight;
        $artCrawlItemHighlight = $('.art-crawl-item.highlight').attr('id') || 0;
        //console.log(id);
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
        
        let $artCrawlItemHighlight = $('.art-crawl-item.highlight').attr('id');
        //console.log(id)
        $('.art-crawl-item').removeClass('highlight');
        window.grid.shuffle.update();
        
        $('#' + $artCrawlItemHighlight).addClass('highlight');
    });

    // handle highlight on grid sort
    const btnGroup = document.querySelector('.sort-options');
    if (!btnGroup) { return; }
    btnGroup.addEventListener('click', handleHighlight);

    // handle highlight on window resize
    $(window).resize(debounce(function () {
        
        $metadata = $('#metadata-caption');
        $gridItem = $('.art-crawl-item.highlight').length === 0 ? $('#0') : $('.art-crawl-item.highlight');

        dataAttributes = getDataAttributes($gridItem);

        $gridItem.removeClass('highlight');

        img = $gridItem.find('img').attr('src');

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

        // adds highlight back after 2.7s
        setTimeout(function () {
            $gridItem.addClass('highlight');
        }, 2700);
        // Currently not optimized to handle a really long resize (but why would someone do that?)
    }, 2700, true));

});

