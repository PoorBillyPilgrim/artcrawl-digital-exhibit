// JQuery for #metadata div
$(document).ready(function () {

    $('.art-crawl-item').click(function () {
        // get metadata
        let name, title, major, thumb;

        name = $(this).attr('data-last-name');
        title = $(this).attr('data-title');
        major = $(this).attr('data-major');
        thumb = $(this).find('img').attr('src');

        if ($('#metadata').hasClass('active')) {
            $('#metadata.active').css('opacity', 0);
            setTimeout(function () {
                $('#metadata-data').html('<strong>' + name + '</strong>' + ', ' + title + ', ' + major)
                $('#metadata-img').attr('src', thumb);
                $('#metadata.active').css('opacity', 1);
            }, 250);
        } else {
            // render metadata in #metadata
            $('#metadata-data').html('<strong>' + name + '</strong>' + ', ' + title + ', ' + major)
            $('#metadata-img').attr('src', thumb);
            $('#metadata').addClass('active');
        }



        // orange highlight on click
        if (!$(this).hasClass('highlight')) {
            $('.art-crawl-item').removeClass('highlight');
            $(this).addClass('highlight');
        } else {
            $(this).addClass('highlight');
        }

    });

    // hide #metadata
    $('#metadata-close').click(function () {
        $('#metadata.active').css('opacity', 0);
    })

    // reset highlights
    $('label.btn').click(function () {
        $('.art-crawl-item').removeClass('highlight');
    })
});