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
    var obj;
    $('#metadata-img').on('load', function (e) {

        obj = getImgSizeInfo(e.target);

        console.log(`Left: ${obj.left}px, Right: ${obj.right}px`);

    });
    $('.art-crawl-item').click(function (obj) {
        // get metadata
        let name, title, major, thumb;

        name = $(this).attr('data-last-name');
        title = $(this).attr('data-title');
        major = $(this).attr('data-major');
        thumb = $(this).find('img').attr('src');

        // get calculated width after scale down


        console.log(`Left: ${obj.left}px, Right: ${obj.right}px, Width: ${obj.width}`);

        $('#metadata-data').css('left', obj.left);
        $('#metadata-data').css('right', obj.right);

        if ($('#metadata').hasClass('active')) {
            $('#metadata.active').css('opacity', 0);
            setTimeout(function () {
                $('#metadata-data').html('<strong>' + name + '</strong>' + ', ' + title + ', ' + major)
                $('#metadata-img').attr('src', thumb);
                $('#metadata.active').css('opacity', 1);
            }, 550);
        } else {
            // render metadata in #metadata
            $('#metadata-data').html('<strong>' + name + '</strong>' + ', ' + title + ', ' + major)
            $('#metadata-img').attr('src', thumb);
            $('#metadata').addClass('active');
        }



        // orange highlight on click
        if (!$(this).hasClass('highlight')) {
            $('.art-crawl-item').removeClass('highlight');
            $(this).addClass('highlight');
        } else {
            $(this).addClass('highlight');
        }

    });

    // hide #metadata
    /*
    $('#metadata-close').click(function () {
        $('#metadata.active').css('opacity', 0);
    })
    */

    // reset highlights
    $('label.btn').click(function () {
        $('.art-crawl-item').removeClass('highlight');
    })
});