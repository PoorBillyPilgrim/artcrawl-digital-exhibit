var Slider = (function() {
    const init = function() {
        
        let splide = new Splide('.splide', {
            rewind: true,
            lazyLoad: 'nearby',
            pagination: false,
            height: '82.5vh',
            breakpoints: {
                640: {
                    height: '85vh',
                    fixedHeight: '90%'
                },
                769: {
                    height: '79vh'
                },
                992: {
                    height: '80vh'
                },
                1200: {
                    height: '84vh',
                    fixedHeight: '100%'
                }
            }
        }).mount();
        
        const loc = window.location;
        let id;
        if (loc.hash) {
            // if hash contains an id, load item with corresponding data-dzi-id attribute
            // https://stackoverflow.com/questions/23699666/javascript-get-and-set-url-hash-parameters
            let params = getHashParams(loc.hash.substr(1)); // remove '#'
            id = params.id;
            splide.go(parseInt(id))
            animateEnter();
            history.pushState({'item_id': id}, 'Art Crawl', window.location.hash = '#id=' + id);
        } else {
            // default 
            // load first item in #grid
            id = '0';
        }

        $('#' + id).addClass('highlight');

        handleSplideEvents(splide);
        openViewer();
        closeViewer(splide);
        handleAbout();
        handleView(splide);
        renderColor();
        //onResize();
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
            $('#artcrawl-container').css('opacity', '1');
            $('#about').removeClass('hide');
            $('#about').css('opacity', '1');
            $('#footer').removeClass('hide');
        }, 1000);
    }

    function changeLegendColor() {
        let activeColor = $('.art-crawl-item.highlight').css('background-color');
        $('#legend').css('background-color', activeColor);
    }

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

    function initViewer(id) {
        $('#openseadragon').toggleClass('show');
        $('#openseadragon-close').removeClass('hide');
        $('#html-overlay').removeClass('hide');
        $('#artcrawl-container').addClass('hide');
        viewer = OpenSeadragon({
            id: 'openseadragon',
            prefixUrl: '/images/openseadragonNav/',
            tileSources: [{
                tileSource: '/images/dzi/' + id + '.dzi'
            }],
            viewportMargins: {
                right: 300
            },
            overlays:[{
                id: 'html-overlay',
                x: 1,
                y: 0,
            }]
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

    const handleSplideEvents = function(splide) {
        function toggleSplideText(opacity) {
            let splideText = Array.from(document.querySelectorAll('.splide__slide > p'));

            splideText.forEach(p => {
                p.style.opacity = opacity;
            });
        }
        
        splide.on('move', function() {
            let highlights = Array.from(document.querySelectorAll('.highlight'));
            for (let highlight of highlights) {
                highlight.classList.remove('highlight');
            }

            toggleSplideText('0');
        });
    
        splide.on('moved', function(event) {
            $('#' + event).addClass('highlight');
            history.pushState({'item_id': event}, 'Art Crawl', window.location.hash = '#id=' + event);
            changeLegendColor();
            toggleSplideText('1');
        });

        $('.gallery').click(function() {
            if(window.innerWidth < 1200) {
                $('#grid-container').toggleClass('hide');
                $('.slider').toggleClass('hide');
                $('.grid-slider-toggle > .footer__btn').toggleClass('hide');
                $('.footer__btns').toggleClass('grid-view slider-view');
                splide.refresh();
            }
            let id = parseInt(this.attributes["id"].value);
            splide.go(id);
            changeLegendColor();
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
            
            history.pushState({'item_id': gridItemID}, 'Art Crawl', '#id=' + gridItemID); 
        });
    }

    const closeViewer = function(splide) {
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
            history.pushState({'item_id': gridItemID}, 'Art Crawl', window.location.hash = '#id=' + gridItemID);

            shuffle.update();
            splide.refresh();
            $("#" + params.id).addClass('highlight');
            $('<div id="html-overlay" class="hide">' + '</div>').insertBefore('#legend');
        });
    }

    const handleAbout = function() {
        $('#hero > div > div > button').click(function() {
            animateEnter();
            history.pushState({'item_id': '0'}, 'Art Crawl', window.location.hash = '#id=0');
        });
        
        $('#about-close').click(function() {
            $('#about').addClass('hide');
        });

        $('i.fa-info-circle').click(function() {
            $('#about').toggleClass('hide');
        });
    }

    const handleView = function(splide) {
        let isResized = false;

        function toggleFooterView() {

            function toggleGridView() {
                $('.grid-slider-toggle').removeClass('hide');
                if (window.location.hash) {
                    $('#grid-container').addClass('hide');
                    $('#slider-toggle').addClass('hide');
                    $('#about-toggle').addClass('slider-view');
                    $('.footer__btns').addClass('slider-view');
                } else {
                    $('.slider').addClass('hide');
                    $('#grid-toggle').addClass('hide');
                    $('#about-toggle').addClass('grid-view');
                    $('.footer__btns').addClass('grid-view');
                }
            }

            function handleWindowSize() {
                if (window.innerWidth >= 1280) {
                    $('.grid-slider-toggle').addClass('hide');
                    $('#grid-container').removeClass('hide');
                    shuffle.update();
                } else {
                    toggleGridView();
                }
            }
            // on load
            handleWindowSize();

            // on resize
            window.addEventListener('resize', function(event) {
                handleWindowSize();
            });
        }

        // on load
        toggleFooterView();
        
        $('.footer__btns > .grid-slider-toggle').click(function() {
            $('#grid-container').toggleClass('hide');
            $('.slider').toggleClass('hide');
            $('.grid-slider-toggle > .footer__btn').toggleClass('hide');
            $('#about-toggle').toggleClass('grid-view slider-view');
            $('.footer__btns').toggleClass('grid-view slider-view');

            splide.refresh();
            shuffle.update();
        });
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
        $('#legend').css('background-color', colorOnLoad);

        $('#color-btn').click(function() {
            $('.art-crawl-item > img').toggleClass('show-color');
            let activeColor = $('.art-crawl-item.highlight').css('background-color');
            $('#legend').css('background-color', activeColor);
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
                splide.refresh();
            }
        }, 100, true));
    }

    return {
        init: init
    }
})();