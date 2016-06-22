displaySystem.registerModule({
    name: 'rtl',
    style: multiline(function() {/*
        .rtl {
            direction: rtl;
        }
    */}),
    factory: function(config) {

        var body = document.getElementsByTagName('body')[0];

        if (config.enable) {
            enableRtl();
        }

        return {
            enable: enableRtl,
            disable: disableRtl
        };

        function enableRtl() {
            addClass(body, 'rtl');
        }

        function addClass(el, className) {
            if (el.classList) el.classList.add(className);
            else if (!hasClass(el, className)) el.className += ' ' + className;
        }

        function disableRtl() {
            removeClass(body, 'rtl');
        }

        function removeClass(el, className) {
            if (el.classList) el.classList.remove(className);
            else el.className = el.className.replace(new RegExp('\\b'+ className+'\\b', 'g'), '');
        }
    }
});
