$(function() {
    const Shuffle = window.Shuffle;
    let shuffle;

    let colors = {"Industrial Design":{"count":2,"color":"#f257c1"},"BME":{"count":5,"color":"#2f538e"},"Mechanical Engineering":{"count":13,"color":"#4c4eb2"},"Physics and LMC":{"count":1,"color":"#e076d2"},"Computer Science":{"count":18,"color":"#295b93"},"Architecture":{"count":6,"color":"#b4fcae"},"Chemical & Biomolecular Engineering":{"count":1,"color":"#83fc9d"},"Industrial Engineering":{"count":3,"color":"#6d22b7"},"LMC":{"count":1,"color":"#ef5f7a"},"Electrical Engineering":{"count":3,"color":"#db6087"},"Aerospace":{"count":1,"color":"#9f63ed"},"Master of City and Regional Planning":{"count":1,"color":"#04edbe"},"Neuroscience":{"count":5,"color":"#d863c5"},"physics":{"count":1,"color":"#e1e569"},"Computer Science (PhD)":{"count":1,"color":"#3ffc8a"},"Biomedical Engineering":{"count":10,"color":"#ba5d1b"},"CS":{"count":1,"color":"#5df4e5"},"Civil Engineering":{"count":3,"color":"#b0f716"},"Aerospace Engineering":{"count":5,"color":"#ffba66"},"Architect":{"count":2,"color":"#00c197"},"Biochemistry":{"count":3,"color":"#af68ed"},"ME":{"count":4,"color":"#b7daf7"},"Biomedical Engineering & ALIS":{"count":1,"color":"#fcdf6c"},"Industrial & Systems Engineering":{"count":1,"color":"#cc186c"},"Business Administration":{"count":4,"color":"#df6cfc"},"Chemical Engineering":{"count":2,"color":"#ed2bff"},"Biology":{"count":4,"color":"#f9978e"},"Robotics":{"count":1,"color":"#ef6eb3"},"Bioinformatics":{"count":1,"color":"#c67d0f"},"English":{"count":1,"color":"#359099"},"Computer Engineer":{"count":1,"color":"#e0003f"},"ALIS":{"count":1,"color":"#28cc7f"},"Mathematics":{"count":1,"color":"#5d22cc"},"Computer Engineering":{"count":2,"color":"#98e559"},"Materials Science and Engineering":{"count":2,"color":"#ed6a9a"},"BMED":{"count":1,"color":"#d0afed"},"MSE":{"count":1,"color":"#f699ff"},"EE":{"count":1,"color":"#d33295"},"Online Master of Science in Analytics":{"count":1,"color":"#dc59f9"},"ECE":{"count":1,"color":"#75efe5"},"ARCHITECTURE":{"count":1,"color":"#3c36b5"},"HTS":{"count":1,"color":"#6be845"},"M.S. Global Media and Cultures":{"count":1,"color":"#8de8c0"},"Physics":{"count":2,"color":"#55db57"},"Computational Media":{"count":2,"color":"#3f70af"},"Master of Architecture":{"count":1,"color":"#ea4c3a"},"Environmental Engineering":{"count":2,"color":"#edb0a8"},"Literature, Media and Communication":{"count":1,"color":"#b516f4"},"AE":{"count":1,"color":"#b9ed95"},"Chemical and Biomolecular Engineering":{"count":1,"color":"#d3ef97"},"Literature, Media, and Communication":{"count":1,"color":"#f4c6ff"},"Psychology":{"count":1,"color":"#f9eeae"}};

    $('#color-btn').click(function() {
        $('.art-crawl-item > img').toggleClass('active');
        $('#legend').toggleClass('hide');

        let figures = document.querySelectorAll('.art-crawl-item');
        figures.forEach(figure => {
            let major = figure.attributes.getNamedItem('data-major').value;
            figure.style.backgroundColor = colors[major].color;
        });
        //figures[0].style.backgroundColor = colors["Industrial Design"].color;
        //figures[0].attributes.getNamedItem('data-major').value;
        
        let activeColor = $('.art-crawl-item.highlight').css('background-color');
        //$('.art-crawl-item.highlight > img').css({'opacity': '1'});
        $('#legend').css('background-color', activeColor);
    });

    const grid = Grid.init();
    const metadata = Metadata.init();
});