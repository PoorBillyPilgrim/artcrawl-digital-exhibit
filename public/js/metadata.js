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

// JQuery for #metadata div
$(document).ready(function () {
    // on DOM load
    let gridItem, name, title, major, img, obj;

    gridItem = $('#0'); // gets first figure in shuffleJS grid

    name = gridItem.attr('data-last-name');
    title = gridItem.attr('data-title');
    major = gridItem.attr('data-major');
    img = gridItem.find('img').attr('src');

    gridItem.addClass('highlight');

    $('#metadata-img').attr('src', img);

    obj = getImgSizeInfo(document.querySelector('#metadata-img'));
    console.log(obj)

    $('#metadata-data').css('left', obj.left);
    $('#metadata-data').css('max-width', obj.width);
    $('#metadata-data').html('<strong>' + name + '</strong>' + ', ' + title + ', ' + major)




    $('.art-crawl-item').click(function () {
        // get metadata
        //let name, title, major, img;

        name = $(this).attr('data-last-name'); // can create function to abstract and consolidate
        title = $(this).attr('data-title');
        major = $(this).attr('data-major');
        img = $(this).find('img').attr('src');

        // get calculated width after scale down
        /*var obj;
        document.querySelector('#metadata-img').addEventListener('load', function (e) {
            obj = getImgSizeInfo(e.target);
        });
        obj = getImgSizeInfo(document.querySelector('#metadata-img'));

        console.log(`Left: ${obj.left}px, Right: ${obj.right}px, Width: ${obj.width}`);*/

        //$('#metadata-data').css('left', obj.left);
        //$('#metadata-data').css('right', obj.right);

        // if ($('#metadata').hasClass('active')) {
        $('#metadata.active').css('opacity', 0);
        setTimeout(function () {
            $('#metadata-img').attr('src', img);
            obj = getImgSizeInfo(document.querySelector('#metadata-img'));
            $('#metadata-data').css('left', obj.left);
            $('#metadata-data').css('max-width', obj.width);
            $('#metadata-data').html('<strong>' + name + '</strong>' + ', ' + title + ', ' + major)

            $('#metadata.active').css('opacity', 1);
        }, 550);
        /*} else {
            // render metadata in #metadata
            $('#metadata-data').html('<strong>' + name + '</strong>' + ', ' + title + ', ' + major)
            $('#metadata-img').attr('src', img);
            $('#metadata').addClass('active');
        }*/



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
    $('#metadata-img').click(function () {
        let id;
        id = $('.art-crawl-item.highlight').attr('id');
        console.log(id);
        $('#openseadragon').toggleClass('show');
        $('#openseadragon-close').removeClass('hide');
        $('.artcrawl-container').addClass('hide');
        viewer = OpenSeadragon({
            id: 'openseadragon',
            prefixUrl: '/images/dzi/images/navImages/',
            tileSources: '/images/dzi/images/image' + id + '.dzi',
        })
    });

    $('#openseadragon-close').click(function () {
        $('#openseadragon').removeClass('show');
        $('#openseadragon-close').addClass('hide');
        $('.artcrawl-container').removeClass('hide');
        viewer.destroy();
        viewer = null;
    });

    // reset highlights
    $('label.btn').click(function () {
        $('.art-crawl-item').removeClass('highlight');
    })
});