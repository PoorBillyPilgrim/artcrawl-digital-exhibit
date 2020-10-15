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

// JQuery for #metadata div
$(document).ready(function () {
    // on DOM load
    let $gridItem, $metadata;
    let name, title, major, img, obj;
    let dataAttributes;

    $gridItem = $('#0'); // gets first figure in shuffleJS grid
    $metadata = $('#metadata-caption');

    dataAttributes = getDataAttributes($gridItem);
    // ({name, title, major} = getDataAttributes($gridItem)); A destructuring alternative
    img = $gridItem.find('img').attr('src');

    $('#metadata-img').attr('src', img);

    obj = getImgSizeInfo(document.querySelector('#metadata-img'));
    // console.log(obj)

    $metadata.css({
        'left': obj.left,
        'max-width': obj.width
    });
    $metadata.html('<strong>' + dataAttributes.name + '</strong>' + ', ' + dataAttributes.title + ', ' + dataAttributes.major)




    $('.art-crawl-item').click(function () {
        
        dataAttributes = getDataAttributes($(this));
        img = $(this).find('img').attr('src');

        $('#metadata.active').css('opacity', 0);
        setTimeout(function () {
            $('#metadata-img').attr('src', img);
            obj = getImgSizeInfo(document.querySelector('#metadata-img'));
            $metadata.css('left', obj.left);
            $metadata.css('max-width', obj.width);
            $metadata.html('<strong>' + dataAttributes.name + '</strong>' + ', ' + dataAttributes.title + ', ' + dataAttributes.major)

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
    $('#metadata-img').click(function () {
        let id;
        id = $('.art-crawl-item.highlight').attr('id') || 0;
        //console.log(id);
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
        
        let id = $('.art-crawl-item.highlight').attr('id');
        //console.log(id)
        $('.art-crawl-item').removeClass('highlight');
        window.grid.shuffle.update();
        
        $('#' + id).addClass('highlight');
    });


    const btnGroup = document.querySelector('.sort-options');
    if (!btnGroup) { return; }
    btnGroup.addEventListener('click', function() {
        let id;
        id = $('.art-crawl-item.highlight').attr('id');
        //console.log(id)
        $('.art-crawl-item').removeClass('highlight');
        /*
        grid.shuffle.on(Shuffle.EventType.LAYOUT, function() {
            //let arr = Array.from(grid.shuffle.element.children)
            //console.log(gridID)
            console.log(gridID)
            gridID = null;
        }) */
        setTimeout(function() {
            $('#' + id).addClass('highlight');
        }, 2700)
    })
    // reset highlights
    /*
    $('label.btn').click(function () {
        // also need to account for btn click when it's the same button already active
        
        let id = $('.art-crawl-item.highlight').attr('id');
        //$('.art-crawl-item').removeClass('highlight');
        grid.shuffle.on(Shuffle.EventType.LAYOUT, function(data) { 
            /*data.shuffle.element.children.forEach(x => {
                if (x.className.includes('highlight')) {
                    console.log(x);
                }
            })
            let arr = Array.from(data.shuffle.element.children);
            arr.forEach(x => {
                if (x.className.includes('highlight')) {
                    console.log(x);
                }
            })
            
            //console.log(arr[0].className)
        });*/
        // highlight messes with grid conformity
        // add highlight to .art-crawl-item after grid shuffle
        /*
        setTimeout(function() {
            $('#' + id).addClass('highlight');
        }, 2650)
        */
            
       
        //renderHighlight();
    //})

    $(window).resize(function() {
        //renderHighlight();
    });

    /*
    function renderHighlight() {
        // rethink how highlight is read, b/c $('.art-crawl-item.highlight') returns an array
        // which can lead to more than one .art-crawl-item receiving a highlight
        id = $('.art-crawl-item.highlight').attr('id');
        $('.art-crawl-item').removeClass('highlight');
        
        // highlight messes with grid conformity
        // add highlight to .art-crawl-item after grid shuffle
        grid.shuffle.on(Shuffle.EventType.LAYOUT, function() { 
            $('#' + id).addClass('highlight');
        });
    }
    */
});

