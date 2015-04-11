//adapted from https://github.com/sindresorhus/multiline
var multiline = (function() {
    // start matching after: comment start block => ! or @preserve => optional whitespace => newline
    // stop matching before: last newline => optional whitespace => comment end block
    var reCommentContents = /\/\*!?(?:\@preserve)?[ \t]*(?:\r\n|\n)([\s\S]*?)(?:\r\n|\n)[ \t]*\*\//;

    return function (fn) {
        if (typeof fn !== 'function') {
            throw new TypeError('Expected a function');
        }

        var match = reCommentContents.exec(fn.toString());

        if (!match) {
            throw new TypeError('Multiline comment missing.');
        }

        return match[1];
    };
}());

// display system main
var displaySystem = (function() {
    var config;
    var modules = {};
    var moduleDefs = {};
    var ws;

    function setConfig(_config) {
        config = _config;
        if (config.background) {
            document.body.style.backgroundColor = config.background;
        }
        setTimeout(init,0);
    }

    function prependToHead(el) {
        var h = document.getElementsByTagName('head')[0];
        h.insertBefore(el,h.firstChild);
    }

    function loadScript(src) {
        var el = document.createElement('script');
        el.src = src;
        prependToHead(el);
    }

    function initWebsocket() {
        if (config.wsHost) {
            ws = new WebSocket(config.wsHost);
            ws.onopen = function() {
                if (config.mserverNode) {
                    ws.send(JSON.stringify({
                        type: "subscribe",
                        node: config.mserverNode
                    }));
                }
            };
            ws.onerror = function(e){
                console.log("error", e);
            };
            ws.onclose = function() {
                console.log("close");
            };
            ws.onmessage = function(msg) {
                console.log(msg);
                var data = JSON.parse(msg.data);
                handleMessage(data);
            };
        }
    }

    function handleMessage(msg) {

    }

    function init() {
        initWebsocket();
        initKeyBindings();
        var modulePath = config.modulePath||'modules';
        Object.keys(config.modules).forEach(function(name) {
            var src = modulePath+'/'+name+'.js';
            loadScript(src);
        });
    }

    function registerModule(def) {
        // add html
        if (def.template) {
            var d = document.createElement('div');
            d.innerHTML = def.template;
            document.body.appendChild(d);
        }
        // add styles
        if (def.style) {
            var s = document.createElement('style');
            s.innerHTML = def.style;
            prependToHead(s);
        }
        // register api
        var m,cfg;
        if (def.factory) {
            if (def.name) {
                cfg = config.modules[def.name];
            }
            m = def.factory(cfg);
        }
        if (def.name) {
            // register module
            if (m) {
                modules[def.name] = m;
            }
            // register definition
            moduleDefs[def.name] = def;
        }
    }

    function initKeyBindings() {
        window.addEventListener('keydown',function(e) {
            var key = e.which||e.keyCode;
            console.log(key);
            switch (key) {
                case 67:    //c
                    window.open('controls.html','fllDisplayControlWindow','resize=yes,width=600,height=300');
                    break;
            }
        });
    }

    return {
        config: setConfig,
        registerModule: registerModule,
        modules: modules,
        definitions: moduleDefs
    };
}());