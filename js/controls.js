var displaySystem = (function() {
    var system;

    function init() {
        system = window.opener.displaySystem;
        Object.keys(system.modules).forEach(renderModuleControls);
    }

    function renderModuleControls(name) {
        var module = system.modules[name];
        var p = document.createElement('p');
        p.innerHTML = '<label>'+name+'</label>';
        Object.keys(module).forEach(function(fn) {
            var btn = document.createElement('button');
            btn.innerHTML = fn;
            btn.addEventListener('click',function() {
                console.log(fn);
                module[fn]();
            });
            p.appendChild(btn);
        });
        document.body.appendChild(p);
    }

    init();
}());