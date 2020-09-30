// JQuery for #metadata div
$(document).ready(function () {
    $('.art-crawl-item').click(function () {
        // get metadata
        let name, title, major, thumb;

        name = $(this).attr('data-last-name');
        title = $(this).attr('data-title');
        major = $(this).attr('data-major');
        thumb = $(this).find('img').attr('src');

        $('#metadata-data').html('<strong>' + name + '</strong>' + ', ' + title + ', ' + major)
        $('#metadata-img').attr('src', thumb);
        $('#metadata').addClass('active');

        /*
        if ($('#metadata').hasClass('active')) {
            $(this).fadeOut(125, 'linear', function () {
                // fade #metadata back in
                $('#metadata-data').html('<strong>' + name + '</strong>' + ', ' + title + ', ' + major)
                $('#metadata-img').attr('src', thumb);
                $(this).fadeIn(125);
            });
        } else {
            // render metadata in #metadata
            $('#metadata-data').html('<strong>' + name + '</strong>' + ', ' + title + ', ' + major)
            $('#metadata-img').attr('src', thumb);
            $('#metadata').addClass('active');
        }
        */


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
        $('#metadata').removeClass('active');
    })

    // reset highlights
    $('label.btn').click(function () {
        $('.art-crawl-item').removeClass('highlight');
    })
});