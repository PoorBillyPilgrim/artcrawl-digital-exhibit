$(function() {
    const Shuffle = window.Shuffle;
    let shuffle;

    $('#hero > a').click(function(event) {
        event.preventDefault();

        $('html, body').animate({
            scrollTop: $( $.attr(this, 'href') ).offset().top
        }, 1250);
    })

    const grid = Grid.init();
    const metadata = Metadata.init();
});