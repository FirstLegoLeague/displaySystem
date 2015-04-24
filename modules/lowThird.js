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
    factory: function(config) {
        var visible = false;
        var timer;

        function getLowerThird() {
            return document.getElementById('lowThird');
        }
        function persist() {
            getLowerThird().className = '';
            visible = true;
            if (timer) {
                clearTimeout(timer);
                timer = null;
            }
        }
        function showLowerThird() {
            persist();
            timer = setTimeout(hideLowerThird,5000);
        }
        function hideLowerThird() {
            visible = false;
            getLowerThird().className = 'hidden';
        }
        function setText(line1,line2) {
            if (line1 || line2) {
                getLowerThird().innerHTML = '<div class="line line1">'+(line1||'')+'</div><div class="line line2">'+(line2||'')+'</div>';
            }
        }
        function doCommand(cmd) {
            switch(cmd) {
                case 'show': showLowerThird(); break;
                case 'persist': persist(); break;
                case 'hide': hideLowerThird(); break;
            }
        }
        function toggle() {
            visible ? hideLowerThird() : showLowerThird();
        }

        if (config.line1 || config.line2) {
            setText(config.line1,config.line2);
        }
        if (config.visible) {
            persist();
        }

        return {
            show: showLowerThird,
            hide: hideLowerThird,
            persist: persist,
            toggle: toggle,
            set: setText,
            command: doCommand
        };
    }
});