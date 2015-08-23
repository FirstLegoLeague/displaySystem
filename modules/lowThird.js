displaySystem.registerModule({
    name: 'lowThird',
    template: multiline(function() {/*
        <div id="lowThird" class="hidden"></div>
    */}),
    style: multiline(function() {/*
        #lowThird {
            position: absolute;
            left: 0;
            width: 100%;
            bottom: 0;
            font-size: 10vh;
        }
    */}),
    factory: function(config, onMessage) {
        var visible = false;
        var timer;

        function getElement() {
            return document.getElementById('lowThird');
        }
        function persist() {
            getElement().className = '';
            visible = true;
            if (timer) {
                clearTimeout(timer);
                timer = null;
            }
        }
        function show() {
            persist();
            timer = setTimeout(hide,5000);
        }
        function hide() {
            visible = false;
            getElement().className = 'hidden';
        }
        function setText(line1,line2) {
            if (line1 || line2) {
                getElement().innerHTML = '<div class="line line1">'+(line1||'')+'</div><div class="line line2">'+(line2||'')+'</div>';
            }
        }
        function doCommand(cmd) {
            switch(cmd) {
                case 'show': show(); break;
                case 'persist': persist(); break;
                case 'hide': hide(); break;
            }
        }
        function toggle() {
            visible ? hide() : show();
        }

        if (config.line1 || config.line2) {
            setText(config.line1,config.line2);
        }
        if (config.visible) {
            persist();
        }

        onMessage('show',function(msg) {
            if (msg && msg.data) {
                setText.apply(null,Object.keys(msg.data).slice(0,2).map(function(key) {
                    return msg.data[key];
                });
            }
            show();
        });
        onMessage('hide',function() {
            hide();
        });

        return {
            show: show,
            hide: hide,
            persist: persist,
            toggle: toggle,
            set: setText
        };
    }
});
