// 'use strict';

// #metadata-img width is unavailable in DOM because of object-fit: scale-down 
// These functions grab #metadata-img width after scale down
// https://stackoverflow.com/questions/37256745/object-fit-get-resulting-dimensions


var Metadata = (function () {
    let viewer, img, dataAttributes, gridItemID;

    const init = function() {
        openViewer();
        closeViewer();
        renderMetadata();
        handleAbout();
        toggleGridSlider();
        onResize();
        renderColor();
    }

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
    
    function getDataAttributes(gridItem) {
        return {
            firstName: gridItem.attr('data-first-name'),
            lastName: gridItem.attr('data-last-name'), 
            title: gridItem.attr('data-title'),
            major: gridItem.attr('data-major'),
            statement: gridItem.attr('data-artist-statement')
        }
    }
    
    function renderMetadataImg($metadata, $metadataImg) {
        var imgSize = getImgSizeInfo($metadataImg);
        $metadata.css({
            'left': imgSize.left,
            'max-width': imgSize.width
        });
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
    
    
    function createHtmlOverlay(title, name, major, description) {
        function p(text) {
            return '<p>' + text + '</p>'
        };
        let html = "";
        for (let i = 0; i < arguments.length; i++) {
            if (arguments[i] != "") {
                html += p(arguments[i]);
            }
        }
        return html;
    }
    
    function getHashParams(arr) {
        return arr.split('&').reduce(function(result, item) {
            let parts = item.split('=');
            result[parts[0]] = parts[1];
            return result;
        }, {});
    }
    
    function animateEnter() {
        $('#hero').css('opacity', '0');
        setTimeout(function() {
            $('#hero').addClass('hide');
            $('#artcrawl-container').removeClass('hide');
            $('#artcrawl-container').css('opacity', '1');
            $('#about').removeClass('hide');
            $('#about').css('opacity', '1');
            $('#footer').removeClass('hide');
            
        }, 1000);
    }

    function initViewer(id) {
        $('#openseadragon').toggleClass('show');
        $('#openseadragon-close').removeClass('hide');
        $('#html-overlay').removeClass('hide');
        $('#artcrawl-container').addClass('hide');
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
    
    const openViewer = function() {
        $('.splide__slide').click(function () {
            //let id = this.attributes["data-id"].value;
            let username = $('.art-crawl-item.highlight').attr('data-username');
            gridItemID = $('.art-crawl-item.highlight').attr('id');

            let $ID = $('#' + gridItemID);
            let html = createHtmlOverlay($ID.attr('data-title'), $ID.attr('data-first-name') + ' ' + $ID.attr('data-last-name'), $ID.attr('data-major'), $ID.attr('data-artist-statement'));
            $('#html-overlay').append(html);

            $('#hero').addClass('hide');
            $('#about').addClass('hide');
            $('#info').addClass('hide');
            $('#legend').addClass('hide');

            initViewer(username);
            
            history.pushState({'item_id': gridItemID}, 'Art Crawl', '#id=' + gridItemID + '&viewer=true'); 
        });
    }

    const closeViewer = function() {
        $('#openseadragon-close').click(function () {
            let params = getHashParams(window.location.hash.substr(1));
            
            $('#openseadragon').removeClass('show');
            $('#openseadragon-close').addClass('hide');
            $('#artcrawl-container').removeClass('hide');
            $('#info').removeClass('hide');
            $('#legend').removeClass('hide');
            
            viewer.destroy();
            viewer = null;
            
            window.location.hash = 'artcrawl';

            gridItemID = $('.art-crawl-item.highlight').attr('id');
            let username = $('.art-crawl-item.highlight').attr('data-username');
            history.pushState({'item_id': gridItemID}, 'Art Crawl', window.location.hash = '#id=' + gridItemID);

            let dataAttributes = getDataAttributes($('#' + gridItemID));

            shuffle.update();
            $("#" + params.id).addClass('highlight');
            $('<div id="html-overlay" class="hide">' + '</div>').insertBefore('#legend');
        });
    }

    const renderMetadata = function() {
        
        function changeImage(id) {
            id = $(id);
            dataAttributes = getDataAttributes(id);
            img = id.find('img').attr('src').replace('thumbnails', 'artcrawl');
            $('#metadata.active').css('opacity', 0);
 
        
            setTimeout(function () {
                $('#metadata-img').attr('src', img);
                /*let loadedImg = document.querySelector('#metadata-img');
                loadedImg.addEventListener('load', function(event) {
                     $('#metadata.active').css('opacity', 1);
                     renderMetadataImg($('#metadata-caption'), dataAttributes);
                });*/
                $(id).addClass('highlight');            
                let gridItemID = id.attr('id');
                let username = id.attr('data-username');
                let activeColor = id.css('background-color');
                $('#legend').css({'background-color': activeColor});
                history.pushState({'item_id': gridItemID}, 'Art Crawl', '#username=' + username + '&id=' + gridItemID);
            }, 400);
        }
        
    }

    const handleAbout = function() {
        $('#hero > div > div > button').click(function() {
            animateEnter();
            let id = '0';
            let username = $('#' + id).attr('data-username');
            history.pushState({'item_id': id}, 'Art Crawl', window.location.hash = '#id=' + id);
        });
        
        $('#about-close').click(function() {
            $('#about').addClass('hide');
        });

        $('.footer-btns > .fa-info-circle').click(function() {
            $('#about').toggleClass('hide');
        });
    }

    const toggleGridSlider = function() {
        $('.footer-btns > .grid-slider-toggle').click(function() {
            $('#grid-container').toggleClass('hide');
            $('.slider').toggleClass('hide');
            $('.grid-slider-toggle > .footer__btn').toggleClass('hide');
            shuffle.update();
        });
    }

    const onResize = function() {
        let width;
        width = $(window).width();
        
        $(window).resize(debounce(function () {
            /**
             * Because mobile browsers register scroll as window resize,
             * this checks for only change in width
             * https://stackoverflow.com/questions/17328742/mobile-chrome-fires-resize-event-on-scroll
             * */
            if ($(window).width() != width) {
                setTimeout(function() {
                    let activeImg = document.querySelector('.is-active > img')
                    renderMetadataImg($(activeImg.nextElementSibling), activeImg);
                    let imgSize = getImgSizeInfo(activeImg);
                    $('.splide__arrow--prev').css({'left': imgSize.left});
                    $('.splide__arrow--next').css({'right': imgSize.left});
                }, 750);
            }
        }, 1000, true));
    }

    const renderColor = function() {
        let colors = {"Industrial Design":{"count":3,"color":"#f7aaf2"},"BME":{"count":5,"color":"#ea7e90"},"Mechanical Engineering":{"count":13,"color":"#28e257"},"Physics and LMC":{"count":1,"color":"#2b3bef"},"Computer Science":{"count":18,"color":"#daa2e8"},"Architecture":{"count":6,"color":"#152487"},"Chemical & Biomolecular Engineering":{"count":1,"color":"#8015b2"},"Industrial Engineering":{"count":3,"color":"#f2756f"},"LMC":{"count":1,"color":"#fc562d"},"Electrical Engineering":{"count":3,"color":"#577fd6"},"Aerospace":{"count":1,"color":"#abbce8"},"Master of City and Regional Planning":{"count":1,"color":"#fcc7d3"},"Neuroscience":{"count":5,"color":"#349fb5"},"physics":{"count":1,"color":"#60db8d"},"Computer Science (PhD)":{"count":1,"color":"#e086de"},"Biomedical Engineering":{"count":10,"color":"#9ff4e3"},"CS":{"count":1,"color":"#efca0e"},"Civil Engineering":{"count":3,"color":"#efb3ac"},"Aerospace Engineering":{"count":6,"color":"#ff9bb2"},"Architect":{"count":2,"color":"#f8c6ff"},"Biochemistry":{"count":3,"color":"#9e7ed6"},"ME":{"count":4,"color":"#fcdfbf"},"Biomedical Engineering & ALIS":{"count":1,"color":"#4b92f4"},"Industrial & Systems Engineering":{"count":1,"color":"#230489"},"Business Administration":{"count":5,"color":"#f9c866"},"Chemical Engineering":{"count":2,"color":"#ce27bd"},"Biology":{"count":4,"color":"#d99df9"},"Robotics":{"count":1,"color":"#1eb573"},"Bioinformatics":{"count":1,"color":"#ef757f"},"English":{"count":1,"color":"#9def4a"},"Computer Engineer":{"count":1,"color":"#6cfcce"},"ALIS":{"count":1,"color":"#f7bffc"},"Mathematics":{"count":1,"color":"#232b82"},"Computer Engineering":{"count":2,"color":"#8bf4b0"},"Materials Science and Engineering":{"count":2,"color":"#32bc37"},"BMED":{"count":1,"color":"#0f9e33"},"MSE":{"count":1,"color":"#ead162"},"EE":{"count":1,"color":"#db8967"},"Online Master of Science in Analytics":{"count":1,"color":"#b1deef"},"ECE":{"count":1,"color":"#18036d"},"ARCHITECTURE":{"count":1,"color":"#daa9f2"},"HTS":{"count":1,"color":"#176e82"},"M.S. Global Media and Cultures":{"count":1,"color":"#a295e2"},"Physics":{"count":2,"color":"#2dc922"},"Computational Media":{"count":2,"color":"#37efcd"},"Master of Architecture":{"count":1,"color":"#c69ce2"},"Environmental Engineering":{"count":2,"color":"#2eb71f"},"Literature, Media and Communication":{"count":1,"color":"#d81a92"},"AE":{"count":1,"color":"#79e554"},"Music Technology":{"count":1,"color":"#e069d2"},"Biomedical engineering":{"count":1,"color":"#f43a3d"},"Chemical and Biomolecular Engineering":{"count":1,"color":"#114dff"},"Literature, Media, and Communication":{"count":1,"color":"#efa7ab"},"Psychology":{"count":1,"color":"#5b15db"}};
        let figures = document.querySelectorAll('.art-crawl-item');
        figures.forEach(figure => {
            let major = figure.attributes.getNamedItem('data-major').value;
            figure.style.backgroundColor = colors[major].color;
        });

        let id;
        if(location.hash) {
            let params = getHashParams(window.location.hash.substr(1));
            id = params.id;
        } else {
            id = '0';
        }

        let colorOnLoad = $('#' + id).css('background-color');
        console.log(colorOnLoad);
        $('#legend').css('background-color', colorOnLoad);

        $('#color-btn').click(function() {
            $('.art-crawl-item > img').toggleClass('show-color');
            let activeColor = $('.art-crawl-item.highlight').css('background-color');
            $('#legend').css('background-color', activeColor);
        });
    }

    return {
        init: init,
        renderMetadataImg: renderMetadataImg,
        getImgSizeInfo: getImgSizeInfo
    }
})();
