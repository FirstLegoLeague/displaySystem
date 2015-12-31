displaySystem.registerModule({
    name: 'gallery',
    template: multiline(function() {/*
        <div id="gallery" class="hidden">
            
        </div>
    */}),
    style: multiline(function() {/*
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
            right: 0;
            background-size: contain;
            background-repeat: no-repeat;
            background-position: center center;
            transition: all 1s;
        }
        #gallery div.current {
            opacity: 1;
        }
    */}),
    factory: function(config) {
        var el, imageElements = [], currentIndex, timer;

        function getElement() {
            return el?el:(el=document.getElementById('gallery'));
        }

        function load(images) {
            if (typeof images === 'string') {
                load(images.split(/(\r\n|\r|\n/gi));
            }
            var container = getElement();
            container.innerHTML = '';
            imageElements = images.map(function(img) {
                var newEl = container.appendChild(document.createElement('div'));
                newEl.style.backgroundImage = 'url('+img+')';
                newEl.style.backgroundSize = config.size||'cover';
                return newEl;
            });
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
            imageElements[currentIndex||0].classList.remove('current');
            imageElements[currentIndex = index].classList.add('current');
        }

        function next() {
            set((currentIndex+1)%imageElements.length);
        }

        function prev() {
            set((currentIndex+imageElements.length-1)%imageElements.length);
        }

        if (config.images) {
            load(config.images);
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
            load: load
        };
    }
});