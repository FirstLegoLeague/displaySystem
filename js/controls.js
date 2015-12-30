var displaySystem = (function() {
    var system;

    function init() {
        system = window.opener.displaySystem;
        Object.keys(system.modules).forEach(renderModuleControls);
    }

    function getArguments(f) {
        var deps = f.toString().match(/^function\s*\w*\((.*?)\)/)[1];
        return deps?deps.split(/\s*,\s*/):[];
    }

    function getValue(inp) {
        return inp.value;
    }
    function appendTo(parent) {
        return function(el) {
            parent.appendChild(el);
        };
    }
    function createInput(placeholder) {
        var inp = document.createElement('textarea');
        inp.placeholder = placeholder;
        return inp;
    }

    function sendMessage(name,action,args,values) {
        var data = {};
        args.forEach(function(arg,i) {
            data[arg] = values[i];
        });
        system.ws.sendMessage({name:name},action,data);
    }

    function renderModuleControls(name) {
        var module = system.modules[name];
        var p = document.createElement('p');
        p.innerHTML = '<label>'+name+'</label>';
        Object.keys(module).forEach(function(fn) {
            var f = module[fn];
            if (typeof f === 'function') {
                var s = p.appendChild(document.createElement('span'));
                var args = getArguments(f);
                var inps = args.map(createInput);
                var btn = document.createElement('button');
                btn.innerHTML = fn;
                btn.addEventListener('click',function() {
                    var data = inps.map(getValue);
                    if (system.ws) {
                        //handle via websocket
                        sendMessage(name,fn,args,data);
                    } else {
                        //handle directly 
                        f.apply(module,data);
                    }
                });
                inps.forEach(appendTo(s));
                s.appendChild(btn);
            }
        });
        document.body.appendChild(p);
    }

    init();
}());