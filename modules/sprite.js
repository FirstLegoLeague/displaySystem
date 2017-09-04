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
        var top = document.createElement('div');
        var bottom = document.createElement('div');
        getElement().appendChild(top);
        getElement().appendChild(bottom);
        top.setAttribute("id", "top");
        bottom.setAttribute("id", "bottom");

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
            var imageServer = "http://10.100.102.13:1395/";
            var imgSrc = imageServer.concat(config.alias);

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
            var spriteWrapper = document.getElementById(config.side);
            spriteWrapper.appendChild(sprite);
            getElement().appendChild(spriteWrapper);
            return sprite;
        }
        function addText(config) {
            let text = document.createElement('span');
            text.setAttribute("id", "eventName");

            text.innerHTML = config.data;

            bottom.appendChild(text);
            return text;
        }
        function setText(configText) {
            texts.forEach(removeSprite);
            texts = configText.map(addText);
        }
        function set(configSprites) {
            sprites.forEach(removeSprite);
            sprites = configSprites.map(addSprite);
        }
        if (config.data) {
            sprites = config.data;
        }
        if (config.text) {
            setText(config.text);
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
