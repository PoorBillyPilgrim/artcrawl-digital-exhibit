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
        firstName: gridItem.attr('data-first-name'),
        lastName: gridItem.attr('data-last-name'), 
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
    $metadata.html('<em>' + dataAttributes.title + '</em>, ' + dataAttributes.firstName + ' ' + dataAttributes.lastName + ', ' + dataAttributes.major)
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

function createHtmlOverlay(title, name, major, description) {
    function p(text) {
        return '<p>' + text + '</p>'
    };
    let html = "";
    for (let i = 0; i < arguments.length; i++) {
        console.log(arguments[i])
        if(arguments[i] != "") {
            html += p(arguments[i]);
        }
    }
    return html;
}

function animateEnter() {
    $('#hero').css('opacity', '0');
    setTimeout(function() {
        $('#hero').addClass('hide');
        $('#artcrawl').removeClass('hide');
        $('#artcrawl').css('opacity', '1');
        $('#about').removeClass('hide');
        $('#about').css('opacity', '1');
        $('#info').removeClass('hide');
    }, 1000);
}

var Metadata = (function () {
    let viewer, img, dataAttributes, gridItemID, dziID;

    const init = function() {
        const loc = window.location;
        let id;
        if (loc.hash === '#artcrawl') {
            // if hash is #artcrawl, load first item in #grid
            id = '0';
            dataAttributes = getDataAttributes($('#0'));
        } else if (loc.hash) {
            // if hash contains an id, load item with corresponding data-dzi-id attribute
            // https://stackoverflow.com/questions/23699666/javascript-get-and-set-url-hash-parameters
            let hash = loc.hash.substr(1);
            let params = _getHashParams(hash);
            id = params.id;
            dataAttributes = getDataAttributes($('#' + id));
            let redirect = loc.hash;
            loc.hash = 'artcrawl';
            loc.hash = redirect;
            animateEnter();
            history.pushState({'item_id': id}, 'Art Crawl', window.location.hash = '#username=' + params.username + '&id=' + id);
        } else {
            // default 
            // load first item in #grid
            id = '0';
            dataAttributes = getDataAttributes($('#0'));
        }

        img = $('#' + id).find('img').attr('src').replace('thumbnails', 'artcrawl');
        $('#metadata-img').attr('src', img);
        $('#metadata-img').on('load', renderMetadataImg($('#metadata-caption'), dataAttributes));


        openViewer();
        closeViewer();
        renderMetadata();
        handleAbout()
        onResize();
        renderColor();
        //handleScroll();
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
            prefixUrl: '/images/openseadragonNav/',
            tileSources: '/images/dzi/' + id + '.dzi',
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
        // const loc = window.location;
        
        // this currently opens viewer if hash has params
        // may change this so that hash params directs to grid, not viewer
        /* if (loc.hash) {
            $('#hero').addClass('hide');
            // parse hash params
            // https://stackoverflow.com/questions/23699666/javascript-get-and-set-url-hash-parameters
            let hash = loc.hash.substr(1);
            let params = _getHashParams(hash);
            // add dataAttributes to #html-overlay
            _initViewer(params.dziID);
        } */

        $('#metadata-img').click(function () {
            let dzi = $('.art-crawl-item.highlight').attr('data-username');
            gridItemID = $('.art-crawl-item.highlight').attr('id');

            $ID = $('#' + gridItemID);
            let html = createHtmlOverlay($ID.attr('data-title'), $ID.attr('data-first-name') + ' ' + $ID.attr('data-last-name'), $ID.attr('data-major'), $ID.attr('data-artist-statement'));
            $('#html-overlay').append(html);

            $('#hero').addClass('hide');
            $('#about').addClass('hide');
            $('#info').addClass('hide');
            $('#legend').addClass('hide');
            _initViewer(dzi);
            
            history.pushState({'item_id': gridItemID}, 'Art Crawl', window.location.hash = '#username=' + dzi + '&id=' + gridItemID + '&viewer=true'); 
        });
    }

    const closeViewer = function() {
        $('#openseadragon-close').click(function () {
            let params = _getHashParams(window.location.hash.substr(1));
            
            $('#openseadragon').removeClass('show');
            $('#openseadragon-close').addClass('hide');
            $('.artcrawl-container').removeClass('hide');
            //$('#hero').removeClass('hide');
            //$('#about').removeClass('hide');
            $('#info').removeClass('hide');
            if($('.art-crawl-item > img').hasClass('show-color')) {
                $('#legend').removeClass('hide');
            }
            
            viewer.destroy();
            viewer = null;
            
            window.location.hash = 'artcrawl';

            gridItemID = $('.art-crawl-item.highlight').attr('id');
            let username = $('.art-crawl-item.highlight').attr('data-username');
            history.pushState({'item_id': gridItemID}, 'Art Crawl', window.location.hash = '#username=' + username + '&id=' + gridItemID);

            shuffle.update();
            $("#" + params.id).addClass('highlight');
            $('<div id="html-overlay" class="hide">' + '</div>').insertBefore('#legend');
        });
    }

    const renderMetadata = function() {
        $('.art-crawl-item').click(function (event) {
            
            dataAttributes = getDataAttributes($(this));
            img = $(this).find('img').attr('src').replace('thumbnails', 'artcrawl');
            //console.log(img);
    
            $('#metadata.active').css('opacity', 0);
            setTimeout(function () {
                $('#metadata-img').attr('src', img);
                renderMetadataImg($('#metadata-caption'), dataAttributes);
                $('#metadata.active').css('opacity', 1);

                gridItemID = $('.art-crawl-item.highlight').attr('id');
                let username = $('.art-crawl-item.highlight').attr('data-username');
                history.pushState({'item_id': gridItemID}, 'Art Crawl', window.location.hash = '#username=' + username + '&id=' + gridItemID);
            }, 550);
            

            /*function handleShowColor(selector, opacity) {
                if(selector.classList.contains('show-color')) {
                    selector.style.opacity = opacity;
                }
            }*/
            // orange highlight on click
            if (!$(this).hasClass('highlight')) {
                //let imgBefore = document.querySelector('.highlight').firstElementChild;
                //handleShowColor(imgBefore, 0) // doesn't work
                // console.log($('.art-crawl-item.highlight'))
                $('.art-crawl-item').removeClass('highlight');
                $(this).addClass('highlight');
                //let imgAfter = event.currentTarget.firstElementChild;
                // console.log($('.art-crawl-item.highlight'))
                //handleShowColor(imgAfter, 1); // doesn't work
            } else {
                $(this).addClass('highlight');
            }

            let activeColor = $('.art-crawl-item.highlight').css('background-color');
            $('#legend').css({'background-color': activeColor});


            
        });
    }

    const handleAbout = function() {
        $('h1').click(function() {
            animateEnter();
        });
        
        $('#about-close').click(function() {
            $('#about').addClass('hide');
        });

        $('#info > i').click(function() {
            $('#about').toggleClass('hide');
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
                img = $('#' + gridItemID).find('img').attr('src').replace('thumbnails', 'artcrawl');
    
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
        let colors = {"Industrial Design":{"count":3,"color":"#f7aaf2"},"BME":{"count":5,"color":"#ea7e90"},"Mechanical Engineering":{"count":13,"color":"#28e257"},"Physics and LMC":{"count":1,"color":"#2b3bef"},"Computer Science":{"count":18,"color":"#daa2e8"},"Architecture":{"count":6,"color":"#152487"},"Chemical & Biomolecular Engineering":{"count":1,"color":"#8015b2"},"Industrial Engineering":{"count":3,"color":"#f2756f"},"LMC":{"count":1,"color":"#fc562d"},"Electrical Engineering":{"count":3,"color":"#577fd6"},"Aerospace":{"count":1,"color":"#abbce8"},"Master of City and Regional Planning":{"count":1,"color":"#fcc7d3"},"Neuroscience":{"count":5,"color":"#349fb5"},"physics":{"count":1,"color":"#60db8d"},"Computer Science (PhD)":{"count":1,"color":"#e086de"},"Biomedical Engineering":{"count":10,"color":"#9ff4e3"},"CS":{"count":1,"color":"#efca0e"},"Civil Engineering":{"count":3,"color":"#efb3ac"},"Aerospace Engineering":{"count":6,"color":"#ff9bb2"},"Architect":{"count":2,"color":"#f8c6ff"},"Biochemistry":{"count":3,"color":"#9e7ed6"},"ME":{"count":4,"color":"#fcdfbf"},"Biomedical Engineering & ALIS":{"count":1,"color":"#4b92f4"},"Industrial & Systems Engineering":{"count":1,"color":"#230489"},"Business Administration":{"count":5,"color":"#f9c866"},"Chemical Engineering":{"count":2,"color":"#ce27bd"},"Biology":{"count":4,"color":"#d99df9"},"Robotics":{"count":1,"color":"#1eb573"},"Bioinformatics":{"count":1,"color":"#ef757f"},"English":{"count":1,"color":"#9def4a"},"Computer Engineer":{"count":1,"color":"#6cfcce"},"ALIS":{"count":1,"color":"#f7bffc"},"Mathematics":{"count":1,"color":"#232b82"},"Computer Engineering":{"count":2,"color":"#8bf4b0"},"Materials Science and Engineering":{"count":2,"color":"#32bc37"},"BMED":{"count":1,"color":"#0f9e33"},"MSE":{"count":1,"color":"#ead162"},"EE":{"count":1,"color":"#db8967"},"Online Master of Science in Analytics":{"count":1,"color":"#b1deef"},"ECE":{"count":1,"color":"#18036d"},"ARCHITECTURE":{"count":1,"color":"#daa9f2"},"HTS":{"count":1,"color":"#176e82"},"M.S. Global Media and Cultures":{"count":1,"color":"#a295e2"},"Physics":{"count":2,"color":"#2dc922"},"Computational Media":{"count":2,"color":"#37efcd"},"Master of Architecture":{"count":1,"color":"#c69ce2"},"Environmental Engineering":{"count":2,"color":"#2eb71f"},"Literature, Media and Communication":{"count":1,"color":"#d81a92"},"AE":{"count":1,"color":"#79e554"},"Music Technology":{"count":1,"color":"#e069d2"},"Biomedical engineering":{"count":1,"color":"#f43a3d"},"Chemical and Biomolecular Engineering":{"count":1,"color":"#114dff"},"Literature, Media, and Communication":{"count":1,"color":"#efa7ab"},"Psychology":{"count":1,"color":"#5b15db"}};

        $('#color-btn').click(function() {
            
            let hlImg = document.querySelector('.highlight').firstElementChild;
            let item  = document.querySelector('.art-crawl-item');
           // console.log(img.classList.contains('show-color'))
            $('.art-crawl-item > img').toggleClass('show-color');
            /* if(hlImg.classList.contains('show-color')) {
                hlImg.style.opacity = 0;
                console.log(hlImg.style.opacity)
            } else {
                hlImg.style.opacity = 1;
            } */
            // $('.art-crawl-item.highlight > img').css('opacity', 1); // need to toggle
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

    const handleScroll = function() {
        $('#hero > a').click(function(event) {
            event.preventDefault();
    
            $('html, body').animate({
                scrollTop: $( $.attr(this, 'href') ).offset().top
            }, 1250);

            if(window.location.hash == "") {
                setTimeout(function() {
                    $('#about-card').removeClass('hide');
                }, 1250);
            }
            $('.art-crawl-item').removeClass('highlight');
            id = '0';
            dataAttributes = getDataAttributes($('#0'));
            img = $('#' + id).find('img').attr('src');
            $('#metadata-img').attr('src', img);
            $('#metadata-img').on('load', renderMetadataImg($('#metadata-caption'), dataAttributes));
            $('#' + id).addClass('highlight');
            
            history.pushState({'item_id': id}, 'Art Crawl', window.location.hash = '#dziID=' + id + '&id=' + id);
        });

        $('#about-link').click(function(event) {
            event.preventDefault();
    
            $('html, body').animate({
                scrollTop: $( $.attr(this, 'href') ).offset().top
            }, 1250);

            $('.art-crawl-item').removeClass('highlight');
            id = '0';
            dataAttributes = getDataAttributes($('#0'));
            img = $('#' + id).find('img').attr('src');
            $('#metadata-img').attr('src', img);
            $('#metadata-img').on('load', renderMetadataImg($('#metadata-caption'), dataAttributes));
            $('#' + id).addClass('highlight');
           // let username = $('')
            
            history.pushState({'item_id': id}, 'Art Crawl', window.location.hash = '#username=' + username + '&id=' + id);
        });
    }

    return {
        init: init
    }
})();
