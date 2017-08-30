displaySystem.registerModule({
    name: 'controls',
    factory: function(config) {
        var system = displaySystem;

        function init(document) {
            Object.keys(system.modules).forEach(function(name) {
                renderModuleControls(name,document)
            });
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

        function renderModuleControls(name, document) {
            var module = system.modules[name];
            if (module.hidden) {
                return;
            }
            var p = document.createElement('p');
            p.innerHTML = '<label>'+name+'</label>';
            Object.keys(module).forEach(function(fn) {
                var f = module[fn];
                if (typeof f === 'function' && !f.hidden) {
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

        var html = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <link rel="stylesheet" href="css/style.css">
                <title>Overlay controls</title>
            </head>
            <body class="controls">
                <p class="instructions">
                    For instructions, visit <a href="https://github.com/FirstLegoLeague/displaySystem#modules" target="_new">our Github readme</a>.
                </p>
            </body>
            </html>
        `

        function open() {
            if (config.url) {
                //we have a completely custom control window supplied by the user, do not bother rendering
                var win = window.open(config.url,'fllDisplayControlWindow','resize=yes,width=800,height=550');
            } else {
                var win = window.open('','fllDisplayControlWindow','resize=yes,width=800,height=550');
                if (win.document.body.innerHTML) {
                    // do not render, as the window has already been filled with html.
                    // Just rendering would add more html to the existing screen
                    // Rerendering would lose page state
                    return;
                }
                win.document.write(html);
                init(win.document);
            }
        }

        return {
            hidden: true,
            open: open
        }
    }
});
