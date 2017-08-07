displaySystem.registerModule({
    name: 'background',
    template: '<div id="background"></div>',
    style: `
        #background {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
        }
        #background.hidden {
            display: none;
        }
    `,
    factory: function(config) {
        var el;

        function getElement() {
            return el?el:(el=document.getElementById('background'));
        }

        function setColor(col) {
            getElement().style.backgroundColor = col;
        }

        function clear() {
            setColor('transparent');
        }

        function show() {
            getElement().className = '';
        }

        function hide() {
            getElement().className = 'hidden';
        }

        if (config.color) {
            setColor(config.color);
        }
        if (config.visible === false) {
            hide();
        }

        return {
            show: show,
            hide: hide,
            set: setColor,
            clear: clear
        };
    }
});
