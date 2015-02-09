displaySystem.registerModule({
    name: 'lowThird',
    template: multiline(function() {/*
        <div id="lowThird" class="hidden"></div>
    */}),
    style: multiline(function() {/*
        div#lowThird {
            font-family: verdana;
            font-size: 16px;
            xxbackground-image: url('lowthird.png');
            background-color: #ffd204;
            background-size: cover;
            position: absolute;
            left: 0;
            width: 100%;
            bottom: 0;
            height: 35%;
            transition: all 0.3s;
            padding: 8% 7% 2% 32%;
            font-size: 490%;
            box-sizing: border-box;
            color: #6f2c91;

        }

        div#lowThird.hidden {
            bottom: -35%;
        }
    */}),
    factory: function() {
        var visible = false;
        var timer;

        function getLowerThird() {
            return document.getElementById('lowThird');
        }
        function persist() {
            getLowerThird().className = '';
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
            getLowerThird().className = 'hidden';
        }
        function setText(txt1,txt2) {
            if (txt1 || txt2) {
                getLowerThird().innerHTML = '<b>'+(txt1||'')+'</b><br>'+(txt2||'');
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

        return {
            command: doCommand,
            set: setText,
            show: showLowerThird,
            hide: hideLowerThird,
            persist: persist,
            toggle: toggle
        };
    }
});