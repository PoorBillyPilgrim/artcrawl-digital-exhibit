//var Shuffle = window.Shuffle;

const Grid = (function() {
    //let shuffle;
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
        imgLoad.on('always', onAlways);
        
        // Sort, Search, and Filter
        addGridEvent('.sort-options', 'change', _handleSortChange);
        addGridEvent('.filter-options', 'change', _handleFilterChange);
        addGridEvent('#search', 'input', _handleSearchInput);
        addGridEvent('#search', 'keydown', _handleSearchKeydown); // Only to prevent form submission on "Enter" key press
        
    }

    const onAlways = function() {
        console.log('all images are loaded');
        shuffle.update();
    };

    const addGridEvent = function(shuffleInput, event, eventHandler) {
        const input = document.querySelector(shuffleInput);
        if (!input) { return; }
        input.addEventListener(event, eventHandler);
    }

    // add + remove 'active' class from btns
    const _handleActiveBtn = function(event) {
        const btns = Array.from(event.currentTarget.children);
        btns.forEach(btn => {
            if (btn.querySelector('input').value === event.target.value) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }
    const _handleSortChange = function(event) {
        _handleActiveBtn(event);

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

    const _handleFilterChange = function(event) {
        _handleActiveBtn(event);

        const { value } = event.target;
        const highlight = document.querySelector('.highlight');

        function filterByMajor(element) {
            return element.getAttribute('data-major') === highlight.getAttribute('data-major');
        }

        if (value === 'major') {
            shuffle.filter(filterByMajor);
        } else {
            shuffle.filter();
        }
    }

    const _handleSearchInput = function(event) {
        const searchText = event.target.value.toLowerCase();
        const majorFilterBtn = document.querySelector('#major-filter');

        shuffle.filter(function(element) {
            const lastName = element.getAttribute('data-last-name').toLowerCase();

            if (majorFilterBtn.classList.contains('active')) {
                const major = document.querySelector('.highlight').getAttribute('data-major');
                return element.getAttribute('data-major') === major && lastName.indexOf(searchText) !== -1; // && finds first falsy value. 'data-major' therefore must go first
            } else {
                return lastName.indexOf(searchText) !== -1;
            }
        });
    }

    const _handleSearchKeydown = function(event) {
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

/*
var grid;
// https://codepen.io/Vestride/pen/ZVWmMX -- from Shuffle.js website
class Grid {
    constructor(element) {
        this.element = element;
        this.shuffle = new Shuffle(this.element, {
            itemSelector: '.art-crawl-item',
            sizer: element.querySelector('.sizer-element'),
            speed: 2600, // 2.6 seconds
            easing: 'cubic-bezier(.28,1.06,.54,.98)' // custom from https://cubic-bezier.com/#.28,1.06,.54,.98
        });

        this.addSorting();
        
        // on img load
        // https://github.com/Vestride/Shuffle/issues/100
        var imgLoad = imagesLoaded(element);
        imgLoad.on('always',this.onAlways.bind(this));
    }

    onAlways() {
        console.log('all images are loaded');
        this.shuffle.update();
    };

    addSorting() {
        const btnGroup = document.querySelector('.sort-options');
        if (!btnGroup) { return; }
        btnGroup.addEventListener('change', this._handleSortChange.bind(this));
    }

    _handleSortChange(event) {
        // add + remove 'active' class from btns
        const btns = Array.from(event.currentTarget.children);
        btns.forEach(btn => {
            if (btn.querySelector('input').value === event.target.value) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

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
        this.shuffle.sort(options);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    //window.grid = new Grid(document.getElementById('grid'));
    grid = new Grid(document.getElementById('grid'));
    console.log('Shuffle grid loaded.')
});





var gridUpdate = debounce(function () {
    grid.shuffle.update();
    console.log('grid reset.')
}, 250);

// window.addEventListener('resize', gridUpdate);

// debounce function to use with window resize
// https://davidwalsh.name/javascript-debounce-function
function debounce(func, wait, immediate) {
	var timeout;
	return function() {
		var context = this, args = arguments;
		var later = function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
}; */