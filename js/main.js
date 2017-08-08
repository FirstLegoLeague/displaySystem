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
        setTimeout(init,0);
    }

    function prependToHead(el) {
        var h = document.getElementsByTagName('head')[0];
        h.insertBefore(el,h.firstChild);
    }

    function appendToHead(el) {
        var h = document.getElementsByTagName('head')[0];
        h.appendChild(el);
    }

    function loadScript(src,onload) {
        var el = document.createElement('script');
        el.src = src;
        el.onload = onload;
        appendToHead(el);
    }

    function loadCss(src,onLoad) {
        var el = document.createElement('link');
        el.rel = 'stylesheet';
        el.href = src;
        appendToHead(el);
    }

    var connected = false;
    var backoff = 100;
    var maxBackoff = 5000;
    var pendingConnection;

    function initWebsocket(config) {
        var ws, host;
        if (config.wsHost || config.wssHost) {
            if (pendingConnection) {
                clearTimeout(pendingConnection);
            }
            if (window.location.protocol === 'https:') {
                host = 'wss://'+config.wssHost;
            } else {
                host = 'ws://'+config.wsHost;
            }
            ws = new WebSocket(host);

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
        if (ws) {
            system.ws = {
                sendMessage: sendMessage
            };
        }
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
        if (config.wsHost || config.wssHost) {
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
        }
    }

    function registerModule(def) {
        lastModule = def;
    }

    function initializeModule(def) {
        // add html
        if (def.template) {
            var d = document.createElement('div');
            d.className = 'moduleContainer '+def.name;
            d.innerHTML = def.template;
            document.getElementById('mainContainer').appendChild(d);
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
        registerModule,
        modules,
        definitions: moduleDefs,
        loadScript,
        loadCss
    };

    return system;
}());
