displaySystem.registerModule({
    name: 'gallery',
    template: `
        <div id="gallery" class="hidden">
        </div>
    `,
    style: `
        #gallery {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
        }

        #gallery.hidden {
            display: none;
        }

        #gallery div {
            opacity: 0;
            position: absolute;
            width: 100%;
            height: 100%;
            left: 0;
            top: 0;
            background-size: contain;
            background-repeat: no-repeat;
            background-position: center center;
            transition: all 1s;
        }
        #gallery div.current {
            opacity: 1;
        }
        #gallery iframe {
            opacity: 0;
            position: absolute;
            width: 100%;
            height: 100%;
            left 0;
            top: 0;
            border: none;
            transition: all 1s;
        }
        #gallery iframe.current {
            opacity: 1;
        }
    `,
    factory: function(config) {
        var el, containerElements = [], currentIndex = 0, timer;

        function getElement() {
            return el?el:(el=document.getElementById('gallery'));
        }

        function clear() {
            var container = getElement();
            container.innerHTML = '';
            containerElements = [];
        }

        function load(images) {
            if (typeof images === 'string') {
                return load(images.split(/(\r\n|\r|\n)/gi));
            }
            var container = getElement();
            containerElements = containerElements.concat(images.map(function(img) {
                var newEl = container.appendChild(document.createElement('div'));
                newEl.style.backgroundImage = 'url('+img+')';
                newEl.style.backgroundSize = config.size||'cover';
                return newEl;
            }));
            set(0);
        }

        function loadPages(pages) {
            if (typeof pages === 'string') {
                return loadPages(pages.split(/(\r\n|\r|\n)/gi));
            }
            var container = getElement();
            containerElements = containerElements.concat(pages.map(function(page) {
                var newEl = container.appendChild(document.createElement('iframe'));
                newEl.src = page;
                return newEl;
            }));
            set(0);
        }

        function show() {
            getElement().className = '';
            if (config.timeout && !timer) {
                timer = window.setInterval(next,config.timeout * 1000);
            }
        }

        function hide() {
            getElement().className = 'hidden';
            if (timer) {
                window.clearInterval(timer);
                timer = null;
            }
        }

        function set(index) {
            if (containerElements[currentIndex]) {
                containerElements[currentIndex].classList.remove('current');
            }
            currentIndex = index;
            if (containerElements[currentIndex]) {
                containerElements[currentIndex].classList.add('current');
            }
        }

        function next() {
            set((currentIndex+1)%containerElements.length);
        }

        function prev() {
            set((currentIndex+containerElements.length-1)%containerElements.length);
        }

        if (config.images) {
            load(config.images);
        }
        if (config.pages) {
            loadPages(config.pages);
        }
        if (config.visible) {
            show();
        }

        return {
            show: show,
            hide: hide,
            prev: prev,
            next: next,
            set: set,
            load: function(images) { clear(); load(images); },
            pages: function(pages) { clear(); loadPages(pages); }
        };
    }
});
