var Slider = (function() {
    const init = function() {
        
        let splide = new Splide('.splide', {
            rewind: true,
            lazyLoad: 'nearby',
            pagination: false,
            height: '650px',
            breakpoints: {
                640: {
                    height: '85vh',
                    fixedHeight: '90%'
                }
            }
        }).mount();


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
        
                //$('#artcrawl-container').removeClass('hide');
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
        
        


        splide.on('move', function(event) {
            console.log(event)
            let highlights = Array.from(document.querySelectorAll('.highlight'));
            for (let highlight of highlights) {
                highlight.classList.remove('highlight');
            }
        });

        splide.on('lazyload:loaded', function() {
            let activeImg = document.querySelector('.is-active > img');
            Metadata.renderMetadataImg($(activeImg.nextElementSibling), activeImg)
            let imgSize = Metadata.getImgSizeInfo(activeImg);
            //$('.splide__arrow').css({'top': (imgSize.height / 2)})
            //$('.splide__arrow--prev').css({'left': imgSize.left});
            //$('.splide__arrow--next').css({'right': imgSize.left});
        });
    
        splide.on('moved', function() {
            
            let activeImg = document.querySelector('.is-active > img');
            Metadata.renderMetadataImg($(activeImg.nextElementSibling), activeImg)
            let imgSize = Metadata.getImgSizeInfo(activeImg);
            //$('.splide__arrow').css({'top': (imgSize.height / 2)})
            //$('.splide__arrow--prev').css({'left': imgSize.left});
            //$('.splide__arrow--next').css({'right': imgSize.left});
            let id = activeImg.attributes["data-id"].value;
            $('#' + id).addClass('highlight');
            history.pushState({'item_id': id}, 'Art Crawl', window.location.hash = '#id=' + id);
            changeLegendColor();
        });

        $('.gallery').click(function() {
            let id = parseInt(this.attributes["id"].value);
            splide.go(id);
            history.pushState({'item_id': id}, 'Art Crawl', window.location.hash = '#id=' + id);
            changeLegendColor();
        })
    
    }

    return {
        init: init
    }
})();