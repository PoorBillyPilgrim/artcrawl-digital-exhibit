var Shuffle = window.Shuffle;

// https://codepen.io/Vestride/pen/ZVWmMX -- from Shuffle.js website
class Grid {
    constructor(element) {
        this.element = element;
        this.shuffle = new Shuffle(element, {
            itemSelector: '.art-crawl-item',
            sizer: element.querySelector('.sizer-element'),
            speed: 2600, // 2.6 seconds
            easing: 'cubic-bezier(.28,1.06,.54,.98)' // custom from https://cubic-bezier.com/#.28,1.06,.54,.98
        });

        this.addSorting();
    }

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
    window.grid = new Grid(document.getElementById('grid'));
    console.log('Shuffle grid loaded!')
});