const Grid = (function() {
    const init = function() {
        const element = document.getElementById('grid');
        const sizer = element.querySelector('.sizer-element')
        shuffle = new Shuffle(element, {
            itemSelector: '.art-crawl-item',
            sizer: sizer,
            speed: 2600, // 2.6 seconds
            easing: 'cubic-bezier(.28,1.06,.54,.98)' // custom from https://cubic-bezier.com/#.28,1.06,.54,.98
        });
        
        const imgLoad = imagesLoaded(element);
        imgLoad.on('done', onSuccess);
        imgLoad.on('fail', onFail);
        
        // Sort, Search, and Filter
        addGridEvent('#sort-options', 'change', handleSortChange);
        addGridEvent('#filter-options', 'change', handleFilterChange);
        addGridEvent('#search', 'input', handleSearchInput);
        addGridEvent('#search', 'keydown', handleSearchKeydown); // Only to prevent form submission on "Enter" key press
        
    }

    const onSuccess = function() {
        console.log('all images loaded');
    };

    const onFail = function() {
        let errMsg = `
        <div class="error-message pop-up">
            <div class="card">
                <h2>Sorry!</h2>
                <a id="" class="pop-up-close"><i class="fas fa-times"></i></a>    
                <p>Some images did not load. Please reload this page.</p>
            </div>
        </div>
        `;
        $('#about').after(errMsg);
        $('.error-message > .card > a').click(function() {
            $('div.error-message').remove();
        })
    }

    const addGridEvent = function(shuffleInput, event, eventHandler) {
        const input = document.querySelector(shuffleInput);
        if (!input) { return; }
        input.addEventListener(event, eventHandler);
    }

    // add + remove 'active' class from btns
    function handleActiveBtn(event) {
        const btns = Array.from(event.currentTarget.children);
        btns.forEach(btn => {
            if (btn.querySelector('input').value === event.target.value) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }
    const handleSortChange = function(event) {
        handleActiveBtn(event);

        const { value } = event.target;
        let options = {};

        function sortByLastName(element) {
            return element.getAttribute('data-last-name').toLowerCase();
        }

        function sortByMajor(element) {
            return element.getAttribute('data-major').toLowerCase();
        }

        function sortByTitle(element) {
            return element.getAttribute('data-title').toLowerCase();
        }

        if (value === 'last-name') {
            options = { by: sortByLastName };
        } else if (value === 'major') {
            options = { by: sortByMajor };
        } else if (value === 'title') {
            options = { by: sortByTitle };
        } else {
            options = {};
        };

        // shuffle.sort(options) sorts based on the options object provided.
        // this binds it to Grid
        shuffle.sort(options);
    }

    const handleFilterChange = function(event) {
        handleActiveBtn(event);

        const { value } = event.target;
        const highlight = document.querySelector('.highlight');

        function filterByMajor(element) {
            return element.getAttribute('data-major') === highlight.getAttribute('data-major');
        }

        function filterByImage(element) {
            return element.getAttribute('data-media') === 'Image';
        }

        function filterByAudio(element) {
            return element.getAttribute('data-media') === 'Audio';
        }

        function filterByVideo(element) {
            return element.getAttribute('data-media') === 'Video';
        }

        if (value === 'major') {
            shuffle.filter(filterByMajor);
        } else if (value === 'image') {
            shuffle.filter(filterByImage);
        } else if (value === 'audio') {
            shuffle.filter(filterByAudio);
        } else if (value === 'video') {
            shuffle.filter(filterByVideo);
        } else {
            shuffle.filter();
        }
    }

    const handleSearchInput = function(event) {
        const searchText = event.target.value.toLowerCase();
        const majorFilterBtn = document.querySelector('#major-filter');

        shuffle.filter(function(element) {
            const firstName = element.getAttribute('data-first-name').toLowerCase();
            const lastName = element.getAttribute('data-last-name').toLowerCase();
            const title = element.getAttribute('data-title').toLowerCase();
            const major = element.getAttribute('data-major').toLowerCase();
            const year = element.getAttribute('data-year');

            if (majorFilterBtn.classList.contains('active')) {
                const majorHighlight = document.querySelector('.highlight').getAttribute('data-major');
                let majorFilter = element.getAttribute('data-major') === majorHighlight;
                return majorFilter && firstName.startsWith(searchText) || majorFilter && lastName.startsWith(searchText) || majorFilter && title.startsWith(searchText) || majorFilter && major.startsWith(searchText); // && finds first falsy value. 'data-major' therefore must go first
            } else {
                return firstName.startsWith(searchText) || lastName.startsWith(searchText) || title.indexOf(searchText) !== -1 || major.startsWith(searchText) || year.startsWith(searchText);
            }
        });
    }

    const handleSearchKeydown = function(event) {
        // To prevent form submission on "Enter" press down
        // https://stackoverflow.com/questions/905222/prevent-form-submission-on-enter-key-press
        // but if there is only one input, then form submit is always present. Have to place a "dummy" hidden input underneath.
        if (event.which == 13 || event.keyCode == 13 || event.key === "Enter") {
            return false;
        }
    }

    return {
        init: init
    }
})();