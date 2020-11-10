$(function() {
    const Shuffle = window.Shuffle;
    let shuffle;

    $('#hero > a').click(function(event) {
        event.preventDefault();

        $('html, body').animate({
            scrollTop: $( $.attr(this, 'href') ).offset().top
        }, 1250);

        history.pushState({'item_id': 0}, 'Art Crawl', window.location.hash = '#dziID=' + 0 + '&id=' + 0);
    })

    const grid = Grid.init();
    const metadata = Metadata.init();
});