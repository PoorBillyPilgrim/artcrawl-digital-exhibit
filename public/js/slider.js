var Slider = (function() {
    const init = function() {
        let splide = new Splide('.splide', {
            rewind: true,
            lazyLoad: 'nearby',
            pagination: false,
            breakpoints: {
                640: {
                    height: '70vh'
                }
            }
        }).mount();
        
        splide.on('lazyload:loaded', function(event) {
            Metadata.renderMetadataImg($(event.nextElementSibling), event);
        });

        splide.on('move', function() {
            let highlights = Array.from(document.querySelectorAll('.highlight'));
            for (let highlight of highlights) {
                highlight.classList.remove('highlight');
            }
        })
    
        splide.on('moved', function() {
            let activeImg = document.querySelector('.is-active > img');
            Metadata.renderMetadataImg($(activeImg.nextElementSibling), activeImg)
            let imgSize = Metadata.getImgSizeInfo(activeImg);
            $('.splide__arrow--prev').css({'left': imgSize.left});
            $('.splide__arrow--next').css({'right': imgSize.left});
            let id = activeImg.attributes["data-id"].value;
            $('#' + id).addClass('highlight');
        })

        $('.gallery').click(function() {
            let id = parseInt(this.attributes["id"].value);
            splide.go(id);
        })
    
    }

    return {
        init: init
    }
})();