var Slider = (function() {
    const init = function() {
        
        let splide = new Splide('.splide', {
            rewind: true,
            lazyLoad: 'nearby',
            pagination: false,
            cover: true,
            height: '700px',
            breakpoints: {
                640: {
                    height: '70vh'
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
        
                $('#artcrawl').removeClass('hide');
                $('#artcrawl').css('opacity', '1');
        
                $('#about').removeClass('hide');
                $('#about').css('opacity', '1');
        
                $('#info').removeClass('hide');
                
            }, 1000);
        }
            const loc = window.location;
            let id;
        if (loc.hash === '#artcrawl') {
            // if hash is #artcrawl, load first item in #grid
            id = '0';
            history.pushState({'item_id': id}, 'Art Crawl', window.location.hash = '#username=' + dataAttributes.username + '&id=' + id);
        } else if (loc.hash) {
            // if hash contains an id, load item with corresponding data-dzi-id attribute
            // https://stackoverflow.com/questions/23699666/javascript-get-and-set-url-hash-parameters
            let params = getHashParams(loc.hash.substr(1)); // remove '#'
            id = params.id;
            let redirect = loc.hash;
            loc.hash = 'artcrawl';
            loc.hash = redirect;
            splide.go(parseInt(id))
            animateEnter();
            history.pushState({'item_id': id}, 'Art Crawl', window.location.hash = '#username=' + params.username + '&id=' + id);
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
            let activeImg = document.querySelector('.is-active > .splide__slide__container');
            Metadata.renderMetadataImg($(activeImg.nextElementSibling), activeImg)
            let imgSize = Metadata.getImgSizeInfo(activeImg);
            //$('.splide__arrow').css({'top': (imgSize.height / 2)})
            //$('.splide__arrow--prev').css({'left': imgSize.left});
            //$('.splide__arrow--next').css({'right': imgSize.left});
        });
    
        splide.on('moved', function() {
            
            let activeImg = document.querySelector('.is-active > .splide__slide__container');
            Metadata.renderMetadataImg($(activeImg.nextElementSibling), activeImg)
            let imgSize = Metadata.getImgSizeInfo(activeImg);
            //$('.splide__arrow').css({'top': (imgSize.height / 2)})
            //$('.splide__arrow--prev').css({'left': imgSize.left});
            //$('.splide__arrow--next').css({'right': imgSize.left});
            let id = activeImg.attributes["data-id"].value;
            $('#' + id).addClass('highlight');
            history.pushState({'item_id': id}, 'Art Crawl', window.location.hash = '#id=' + id);
        });

        $('.gallery').click(function() {
            let id = parseInt(this.attributes["id"].value);
            splide.go(id);
            history.pushState({'item_id': id}, 'Art Crawl', window.location.hash = '#id=' + id);
        })
    
    }

    return {
        init: init
    }
})();