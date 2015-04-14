displaySystem.registerModule({
    name: 'css',
    factory: function(config) {
        var el;

        function createElement() {
            el = document.createElement('link');
            el.rel = 'stylesheet';
            document.head.appendChild(el);
        }

        function setCss(href) {
            el.href = href;
        }

        createElement();

        if (config.href) {
            setCss(config.href);
        }

        return {
            set: setCss
        };
    }
});