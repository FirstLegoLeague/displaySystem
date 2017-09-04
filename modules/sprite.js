displaySystem.registerModule({
    name: 'sprite',
    template: `
        <div id="sprite" class="hidden"></div>
    `,
    style: `
        #sprite .sprite {
            position: absolute;
        }
    `,
    factory: function (config, onMessage) {
        var sprites = [];
        var texts = [];


        var hostAddress;

        function getElement() {
            return document.getElementById('sprite');
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
            sprite.className = 'sprite';
            var imgSrc = config.html || '';
            var img = document.createElement('img');
            img.setAttribute("src", imgSrc);
            img.setAttribute("class", config.imgClass);
            sprite.appendChild(img);
            Object.keys(config).forEach((key) => {
                if (key === "id") {
                    sprite.id = config[key];
                }
                else {
                    sprite.style[key] = config[key];
                }
            });
            getElement().appendChild(sprite);
            return sprite;
        }
        function addText(config) {
            let text = document.createElement('span');
            text.setAttribute("id", "eventName");

            text.innerHTML = config.data;

            getElement().appendChild(text);
        }
        function addTextsToArray(config) {
            texts.push.apply(texts, config);
        }
        function setText(configText) {
            texts.forEach(removeSprite);
            addTextsToArray(configText);
            configText.forEach(addText);
        }
        function set(configSprites) {
            sprites.forEach(removeSprite);
            sprites = configSprites.map(addSprite);
        }
        if (config.data) {
            sprites = config.data;
        }
        if (config.texts) {
            setText(config.texts);
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
