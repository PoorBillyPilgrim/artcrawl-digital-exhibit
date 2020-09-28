$(document).ready(function () {
    $('.art-crawl-item').click(function () {

        let title = $(this).attr('data-title');
        let thumb = $(this).find('img').attr('src');

        $('#metadata-title').html(title);
        $('#metadata-img').attr('src', thumb);
        $('#metadata').addClass('active');
    })

    $('#metadata-close').click(function () {
        $('#metadata').removeClass('active');
    })
});