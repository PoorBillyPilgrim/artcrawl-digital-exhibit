$(function() {
    const Shuffle = window.Shuffle;
    let shuffle;

    const grid = Grid.init();
    const metadata = Metadata.init();
    //const slider = Slider.init();

});

document.addEventListener( 'DOMContentLoaded', function () {
    new Splide('.splide', {
        rewind: true,
        lazyLoad: 'nearby',
        pagination: false
    }).mount();
} );