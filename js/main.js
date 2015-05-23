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
    var lastModule;
    var ws;

    function setConfig(_config) {
        config = _config;
        closeCurtain();
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
            var topic = msg.topic.toLowerCase();
            if (handlers[topic]) {
                handlers[topic].forEach(function(handler) {
                    handler(msg);
                });
            }
        }
    }

    function onMessage(def,action,handler) {
        if (!def.name) {
            return;
        }
        var topic = (def.name+':'+action).toLowerCase();
        if (!handlers[topic]) {
            handlers[topic] = [];
        }
        handlers[topic].push(handler);
    }

    function init() {
        initWebsocket();
        var modulePath = config.modulePath||'modules';
        var pending = [];
        Object.keys(config.modules).forEach(function(name,i) {
            var src = modulePath+'/'+name+'.js';
            pending[i] = {
                name: name
            };
            loadScript(src,function() {
                pending[i].def = lastModule;
                checkLoaded(pending);
            });
        });
    }

    function checkLoaded(pending) {
        if (pending.every(function(module) {
            return module.def;
        })) {
            pending.forEach(function(module) {
                initializeModule(module.def);
            });
            openCurtain();
        }
    }

    function registerModule(def) {
        lastModule = def;
    }

    function closeCurtain(){
        var curtain = document.createElement('div');
        curtain.setAttribute('id', 'curtain');
        document.body.insertBefore(curtain, document.body.firstChild);
    }

    function openCurtain(){
        document.body.removeChild(document.getElementById('curtain'));
    }

    function initializeModule(def) {
        // add html
        if (def.template) {
            var d = document.createElement('div');
            d.className = 'moduleContainer';
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
                //TODO: this is a bit of a tight coupling between names in config and module names
                cfg = config.modules[def.name];
            }
            m = def.factory(cfg,function(action, handler) {
                return onMessage(def,action,handler);
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

    return {
        config: setConfig,
        registerModule: registerModule,
        modules: modules,
        definitions: moduleDefs
    };
}());