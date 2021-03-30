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
        }).mount(window.splide.Extensions); // window.splide.Extensions == Video extension
        
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
        handleHelp();
        handleView(splide);
        renderColor();
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

    function initViewer(username) {
        let y;
        fetch('/images/dzi/' + username + '.dzi')
            .then(response => response.text())
            .then(string => $.parseXML(string))
            .then(xml => {
                let sizeTag = xml.documentElement.firstElementChild.attributes;
                let height = parseInt(sizeTag.Height.value);
                let width = parseInt(sizeTag.Width.value);
                return y = height / width;
            })
            .then(y => {
                let x, right, bottom;
                if (window.innerWidth < 1200) {
                    right = 0;
                    bottom = 150;
                    x = 0;
                } else {
                    right = 300;
                    bottom = 0;
                    x = 1;
                    y = 0;
                }
                $('#openseadragon').toggleClass('show');
                $('#openseadragon-close').removeClass('hide');
                $('#html-overlay').removeClass('hide');
                $('#artcrawl-container').addClass('hide');
                OpenSeadragon.pixelDensityRatio = 1;
                viewer = OpenSeadragon({
                    id: 'openseadragon',
                    prefixUrl: '/images/openseadragonNav/',
                    tileSources: [{
                        tileSource: '/images/dzi/' + username + '.dzi'
                    }],
                    immediateRender: true,
                    viewportMargins: {
                        right: right,
                        bottom: bottom
                    },
                    overlays:[{
                        id: 'html-overlay',
                        x: x,
                        y: y,
                    }]
                });
            })
            .catch(err => console.log(err));
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
            if($(this).hasClass('video') || $(this).hasClass('audio')) {
                return;
            }
            let username = $('.art-crawl-item.highlight').attr('data-username');
            gridItemID = $('.art-crawl-item.highlight').attr('id');

            let $ID = $('#' + gridItemID);
            let html = createHtmlOverlay($ID.attr('data-title'), $ID.attr('data-first-name') + ' ' + $ID.attr('data-last-name'), $ID.attr('data-major'), $ID.attr('data-artist-statement'));

            $('#hero').addClass('hide');
            $('#about').addClass('hide');
            $('#info').addClass('hide');
            $('#legend').addClass('hide');

            if (username == undefined) {
                return;
            } else {
                $('#html-overlay').append(html);
                initViewer(username);
            }
            
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

    const handleHelp = function() {
        $('i.help').click(function() {
            //$(this + 'div.help-card').toggleClass('hide');
            $(this).parent().children('div.help-card').toggleClass('hide');
        })
    }

    const handleView = function(splide) {
        let isResized = false;
        let heightBefore, widthBefore;
        let heightAfter, widthAfter;
        heightBefore = $(window).height();
        widthBefore = $(window).width();

        function toggleFooterView() {

            function toggleGridView() {
                $('.grid-slider-toggle').removeClass('hide');
                if (window.innerWidth >= 1200) {
                    $('.grid-slider-toggle').addClass('hide');
                    $('#grid-container').removeClass('hide');
                    $('.slider').removeClass('hide');
                    shuffle.update();
                } else if (window.location.hash) {
                    $('#grid-container').addClass('hide');
                    $('#slider-toggle').addClass('hide');
                    $('#grid-toggle').removeClass('hide');
                    $('#about-toggle').addClass('slider-view');
                    $('.footer__btns').addClass('slider-view');
                } else {
                    $('.slider').addClass('hide');
                    $('#grid-toggle').addClass('hide');
                    $('#about-toggle').addClass('grid-view');
                    $('.footer__btns').addClass('grid-view');
                }
            }

            function handleToggleOnLoad() {
                if (window.innerWidth >= 1200) {
                    $('.grid-slider-toggle').addClass('hide');
                    $('#grid-container').removeClass('hide');
                    shuffle.update();
                } else {
                    toggleGridView();
                }
            }

            function handleToggleOnResize() {
                heightAfter = $(window).height();
                widthAfter = $(window).width();
                if (widthBefore < 1200 && widthAfter >= 1200 || widthBefore >= 1200 && widthAfter < 1200) {
                    toggleGridView();
                    console.log('width before:'+widthBefore)
                    console.log('width after:'+widthAfter)
                }
                widthBefore = widthAfter;
            }

            /** handling grid/slider toggle **/
            // on load
            handleToggleOnLoad();

            // on resize
            window.addEventListener('resize', function(event) {
                handleToggleOnResize();
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
        let colors = {
            // Georgia Tech Branding -- Tertiary Colors -- https://brand.gatech.edu/brand/colors
            'Scheller College of Business': {'color': '#002233'}, // Atlanta Fog - Tertiary Color
            'College of Computing':{'color': '#4B8B9B'}, // Tower Patina - Tertiary Color
            'College of Design':{'color': '#335161'}, // Blue 80 - Web/Digital Color
            'College of Engineering':{'color': '#F95E10'}, // Horizon - Tertiary Color
            'Ivan Allen College of Liberal Arts':{'color': '#AD4025'}, // Georgia Clay - Tertiary Color
            'College of Sciences':{'color': '#F5D580'} // Buzz Gold 60 - Web/Digital Color
        };
        let figures = document.querySelectorAll('.art-crawl-item');
        figures.forEach(figure => {
            let college = figure.attributes.getNamedItem('data-college').value;
            if (colors[college] == undefined) {
                console.log(college)
            }
            figure.style.backgroundColor = colors[college].color;
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

    return {
        init: init
    }
})();