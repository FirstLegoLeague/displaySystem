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
    var lastModuleContainer;
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

    function loadScript(src,onload) {
        var el = document.createElement('script');
        el.src = src;
        el.onload = onload;
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
                var data = JSON.parse(msg.data);
                handleMessage(data);
            };
        }
    }

    var handlers = {};
    function handleMessage(msg) {
        if (msg && msg.topic) {
            var target = msg.topic.split(':')[0];
            if (handlers[target]) {
                handlers[target].forEach(function(handler) {
                    handler(msg);
                });
            }
        }
    }

    function onMessage(def,handler) {
        if (!def.name) {
            return;
        }
        if (!handlers[def.name]) {
            handlers[def.name] = [];
        }
        handlers[def.name].push(handler);
    }

    function init() {
        initWebsocket();
        initKeyBindings();
        var modulePath = config.modulePath||'modules';
        Object.keys(config.modules).forEach(function(name,i) {
            var src = modulePath+'/'+name+'.js';
            loadScript(src,function() {
                if (lastModuleContainer) {
                    lastModuleContainer.style.zIndex = i;
                }
            });
        });
    }

    function registerModule(def) {
        // add html
        if (def.template) {
            var d = document.createElement('div');
            d.className = 'moduleContainer';
            d.innerHTML = def.template;
            document.body.appendChild(d);
            lastModuleContainer = d;
        } else {
            lastModuleContainer = undefined;
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
                //TODO: this is a bit of a tight coupling between names in config and module names
                cfg = config.modules[def.name];
            }
            m = def.factory(cfg,function(handler) {
                return onMessage(def,handler);
            });
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