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
    var system = {};
    var config;
    var modules = {};
    var moduleDefs = {};
    var lastModule;
    var ws;

    function setConfig(_config) {
        config = _config;
        closeCurtain();
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

    var connected = false;
    var backoff = 100;
    var maxBackoff = 5000;
    var pendingConnection;

    function initWebsocket(config) {
        var ws;
        if (config.wsHost) {
            if (pendingConnection) {
                clearTimeout(pendingConnection);
            }
            var protocol = (window.location.protocol === 'https:')?'wss://':'ws://';
            ws = new WebSocket(protocol + config.wsHost);

            ws.onopen = function() {
                if (config.mserverNode) {
                    ws.send(JSON.stringify({
                        type: "subscribe",
                        node: config.mserverNode
                    }));
                    connected = true;
                    backoff = 100;
                }
            };
            ws.onerror = function(e){
                console.log("error");
                ws.close();
            };
            ws.onclose = function() {
                console.log("close reconnecting in",backoff,'ms');
                connected = false;
                delete system.ws;
                pendingConnection = setTimeout(function() {
                    connect();
                },backoff);
                backoff = Math.min(maxBackoff,backoff * 2);
            };
            ws.onmessage = function(msg) {
                var data = JSON.parse(msg.data);
                if (data.topic) {
                    handleMessage(data);
                }
            };
        }

        return ws;
    }

    function connect() {
        ws = initWebsocket(config);
        system.ws = {
            sendMessage: sendMessage
        };
    }

    function getArguments(f) {
        var deps = f.toString().match(/^function\s*\w*\((.*?)\)/)[1];
        return deps?deps.split(/\s*,\s*/):[];
    }

    var handlers = {};
    function handleMessage(msg) {
        if (msg && msg.topic) {
            var topic = msg.topic;
            //handle generic by checking the api
            var moduleName = topic.split(':')[0];
            var action = topic.split(':')[1];
            if (modules[moduleName] && modules[moduleName][action]) {
                var module = modules[moduleName];
                var api = module[action];
                var args = getArguments(api);
                var data = args.map(function(arg) {
                    return (msg.data||{})[arg];
                });
                api.apply(module,data);
            }

            //handle individual handlers
            if (handlers[topic]) {
                handlers[topic].forEach(function(handler) {
                    handler(msg);
                });
            }
        }
    }

    function sendMessage(def,action,data) {
        if (config.wsHost) {
            ws.send(JSON.stringify({
                type: "publish",
                node: config.mserverNode,
                topic: def.name+':'+action,
                data: data
            }));
        }
    }

    function onMessage(def,action,handler) {
        if (!def.name) {
            return;
        }
        var topic = (def.name+':'+action);
        if (!handlers[topic]) {
            handlers[topic] = [];
        }
        handlers[topic].push(handler);
    }

    function init() {
        // initWebsocket();
        connect();
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
        document.body.classList.add('curtain');
    }

    function openCurtain(){
        document.body.classList.remove('curtain');
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

    system = {
        config: setConfig,
        registerModule: registerModule,
        modules: modules,
        definitions: moduleDefs
    };

    return system;
}());