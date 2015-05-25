displaySystem.registerModule({
    name: 'css',
    factory: function(config) {
        var el, gistEl;

        function createElements() {
            el = document.createElement('link');
            el.rel = 'stylesheet';
            document.head.appendChild(el);
            gistEl = document.createElement('link');
            gistEl.rel = 'stylesheet';
            document.head.appendChild(gistEl);
        }

        function setCss(href) {
            if (href) {
                el.href = href;
            }
        }

        function setGist(id) {
            fetch('https://api.github.com/gists/'+id).then(function(resp) {
                return resp.json();
            }).then(function(data) {
                //get all css files and concatenate
                var cssSrc = Object.keys(data.files).map(function(filename) {
                    return data.files[filename];
                }).filter(function(file) {
                    return file.language === 'CSS';
                }).map(function(file) {
                    return file.content;
                }).join('\n');

                //set as data url
                gistEl.href = [
                    'data:',
                    'text/css;charset=utf-8,',
                    cssSrc
                ].join('');
            });
        }

        function reset() {
            setCss(config.href);
            gistEl.href = '';
        }

        createElements();

        if (config.href) {
            setCss(config.href);
        }
        if (config.gist) {
            setGist(config.gist);
        }

        return {
            set: setCss,
            reset: reset,
            gist: setGist
        };
    }
});