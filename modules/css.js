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
            if (href) {
                el.href = href;
            }
        }

        function reset() {
            setCss(config.href);
        }

        createElement();

        if (config.href) {
            setCss(config.href);
        }

        return {
            set: setCss,
            reset: reset
        };
    }
});