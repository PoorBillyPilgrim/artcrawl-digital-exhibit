$(function() {
    const Shuffle = window.Shuffle;
    let shuffle;

    const grid = Grid.init();
    const metadata = Metadata.init();
    //const slider = Slider.init();

});


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
    
    /*let loadedImg = document.querySelector('#splide01-slide01 img');
    loadedImg.addEventListener('load', function(event) {
        renderMetadataImg($('#metadata-caption'), dataAttributes);
    });*/
    
    splide.on('lazyload:loaded', function(event) {
        //console.log(event)
        //Metadata.renderMetadataImg($('#splide01-slide01 p'), $('#splide01-slide01 img'));
        Metadata.renderMetadataImg($(event.nextElementSibling), event);
    });

    splide.on('moved', function() {
        let imgSize = Metadata.getImgSizeInfo(document.querySelector('.is-active > img'));
        $('.splide__arrow--prev').css({'left': imgSize.left});
        $('.splide__arrow--next').css({'right': imgSize.left});
    })


