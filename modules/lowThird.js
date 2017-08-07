displaySystem.registerModule({
    name: 'lowThird',
    template: `
        <div id="lowThird" class="hidden"></div>
    `,
    style: `
        #lowThird {
            position: absolute;
            left: 0;
            width: 100%;
            bottom: 0;
            font-size: 10vh;
        }
    `,
    factory: function(config, onMessage) {
        var visible = false;
        var timer;
        var line1text;
        var line2text;

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
            line1text = line1||line1text;
            line2text = line2||line2text;
            update();
        }
        function update() {
            getElement().innerHTML = '<div class="line line1">'+(line1text||'')+'</div><div class="line line2">'+(line2text||'')+'</div>';
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

        onMessage('line1',function(msg) {
            console.log(msg);
            if (msg && msg.data) {
                line1text = msg.data;
                update();
            }
        });
        onMessage('line2',function(msg) {
            if (msg && msg.data) {
                line2text = msg.data;
                update();
            }
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
