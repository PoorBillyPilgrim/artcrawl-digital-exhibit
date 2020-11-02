$(function() {
    const Shuffle = window.Shuffle;
    let shuffle;

    let colors = {
        'Industrial Design': { count: 2, color: '#7a7adb' },
        BME: { count: 5, color: '#823ab2' },
        'Mechanical Engineering': { count: 13, color: '#3f15a3' },
        'Physics and LMC': { count: 1, color: '#362db5' },
        'Computer Science': { count: 18, color: '#7addd0' },
        Architecture: { count: 6, color: '#c6c607' },
        'Chemical & Biomolecular Engineering': { count: 1, color: '#2ce041' },
        'Industrial Engineering': { count: 3, color: '#7c9915' },
        LMC: { count: 1, color: '#8318e0' },
        'Electrical Engineering': { count: 3, color: '#b3d64a' },
        Aerospace: { count: 1, color: '#8fba01' },
        'Master of City and Regional Planning': { count: 1, color: '#fcf69c' },
        Neuroscience: { count: 5, color: '#9ee1e5' },
        physics: { count: 1, color: '#9798db' },
        'Computer Science (PhD)': { count: 1, color: '#9d87d3' },
        'Biomedical Engineering': { count: 10, color: '#8296d6' },
        CS: { count: 1, color: '#1ae6ed' },
        'Civil Engineering': { count: 3, color: '#1aba18' },
        'Aerospace Engineering': { count: 5, color: '#023cce' },
        Architect: { count: 2, color: '#11b24c' },
        Biochemistry: { count: 3, color: '#cbff87' },
        ME: { count: 4, color: '#a32c1a' },
        'Biomedical Engineering & ALIS': { count: 1, color: '#dbb611' },
        'Industrial & Systems Engineering': { count: 1, color: '#e82771' },
        'Business Administration': { count: 4, color: '#ed768a' },
        'Chemical Engineering': { count: 2, color: '#e8734c' },
        Biology: { count: 4, color: '#f2f282' },
        Robotics: { count: 1, color: '#cf5ee0' },
        Bioinformatics: { count: 1, color: '#c5e9f9' },
        English: { count: 1, color: '#e52724' },
        'Computer Engineer': { count: 1, color: '#e0b508' },
        ALIS: { count: 1, color: '#dd3a37' },
        Mathematics: { count: 1, color: '#d63340' },
        'Computer Engineering': { count: 2, color: '#27ea0e' },
        'Materials Science and Engineering': { count: 2, color: '#85eab1' },
        BMED: { count: 1, color: '#fffdba' },
        MSE: { count: 1, color: '#70f4da' },
        EE: { count: 1, color: '#efa5be' },
        'Online Master of Science in Analytics': { count: 1, color: '#7bf469' },
        ECE: { count: 1, color: '#4695ea' },
        ARCHITECTURE: { count: 1, color: '#9ed140' },
        HTS: { count: 1, color: '#f4675a' },
        'M.S. Global Media and Cultures': { count: 1, color: '#ffe9aa' },
        Physics: { count: 2, color: '#77d8ff' },
        'Computational Media': { count: 2, color: '#9acbe2' },
        'Master of Architecture': { count: 1, color: '#b53a38' },
        'Environmental Engineering': { count: 2, color: '#072b7f' },
        'Literature, Media and Communication': { count: 1, color: '#af7aff' },
        AE: { count: 1, color: '#f438cb' },
        'Chemical and Biomolecular Engineering': { count: 1, color: '#77b6f4' },
        'Literature, Media, and Communication': { count: 1, color: '#4e0499' },
        Psychology: { count: 1, color: '#f916df' }
      }

    $('#color-btn').click(function() {
        $('.art-crawl-item > img').css({'opacity': '0.25'});
        //$('.art-crawl-item').css({'background-color': 'blue'})
        let figures = document.querySelectorAll('.art-crawl-item');
        figures.forEach(figure => {
            let major = figure.attributes.getNamedItem('data-major').value;
            figure.style.backgroundColor = colors[major].color;
        })
        //figures[0].style.backgroundColor = colors["Industrial Design"].color;
        //figures[0].attributes.getNamedItem('data-major').value;
    })

    const grid = Grid.init();
    const metadata = Metadata.init();
});