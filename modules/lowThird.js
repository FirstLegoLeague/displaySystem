displaySystem.registerModule({
    name: 'lowThird',
    template: multiline(function() {/*
        <div id="lowThird" class="hidden"></div>
    */}),
    style: multiline(function() {/*
        div#lowThird {
            font-family: verdana;
            background-color: #ffd204;
            background-size: cover;
            position: absolute;
            left: 0;
            width: 100%;
            bottom: 0;
            height: 30vh;
            transition: all 0.3s;
            padding: 2vh 5vw;
            font-size: 10vh;
            box-sizing: border-box;
            color: #6f2c91;

        }

        div#lowThird.hidden {
            bottom: -30vh;
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
                getLowerThird().innerHTML = '<b>'+(line1||'')+'</b><br>'+(line2||'');
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