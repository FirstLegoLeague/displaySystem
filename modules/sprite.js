displaySystem.registerModule({
    name: 'sprite',
    template: `
        <div id="sprites" class="hidden"></div>
    `,
    style: `
        #sprites .sprite {
            position: absolute;
        }
    `,
    factory: function(config,onMessage) {
        var sprites = [];

        function getElement() {
            return document.getElementById('sprites');
        }

        function show() {
            getElement().classList.remove('hidden');
            getElement().classList.add('visible');
        }

        function hide() {
            getElement().classList.add('hidden');
            getElement().classList.remove('visible');
        }

        function showSprite(index) {
            sprites[index].classList.remove('hidden');
        }

        function hideSprite(index) {
            sprites[index].classList.add('hidden');
        }

        function removeSprite(el) {
            el.parentNode.removeChild(el);
        }

        function addSprite(config) {
            let sprite = document.createElement('div');
            sprite.className = 'sprite ';
            if (config.class){
                sprite.className += config.class;
            }
            sprite.innerHTML = config.html || '';
            Object.keys(config).forEach((key) => {
                if (key != 'class'){
                    sprite.style[key] = config[key];
                }
            });
            getElement().appendChild(sprite);
            return sprite;
        }

        function set(configSprites) {
            sprites.forEach(removeSprite);
            sprites = configSprites.map(addSprite);
        }

        if (config.sprites) {
            set(config.sprites);
        }
        if (config.visible) {
            show();
        }

        return {
            show,
            hide,
            showSprite,
            hideSprite,
        };
    }
});
