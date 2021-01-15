var Slider = (function() {
    const init = function() {
        let splide = new Splide('.splide', {
            rewind: true,
            lazyLoad: 'nearby',
            pagination: false,
            cover: true,
            height: '500px',
            breakpoints: {
                640: {
                    height: '70vh'
                }
            }
        }).mount();

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
        });

        $('.gallery').click(function() {
            let id = parseInt(this.attributes["id"].value);
            splide.go(id);
        })
    
    }

    return {
        init: init
    }
})();