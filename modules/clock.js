displaySystem.registerModule({
    name: 'clock',
    template: multiline(function() {/*
        <div id="clock" class="hidden">02:30</div>
    */}),
    style: multiline(function() {/*
        @import url('fonts/lcd-bold.css');

        #clock {
            position: absolute;
            top: 0.5em;
            right: 0.5em;
            color: white;
            font-size: 96px;
        }
    */}),
    factory: function(config) {
        var div;
        var bgColor = 'black';
        var state = 'stopped hidden';
        var time = 150000;
        var pauseTime = false;
        var armTime = 150;
        var tenths = false;
        var size = 340;
        var pos = {
            x: 0,
            y: 0
        };

        function getElement() {
            return div?div:(div=document.getElementById('clock'));
        }

        function pad(str) {
            str = ''+str;
            if (str.length<2) {
                str = '0'+str;
            }
            return str;
        }

        function setTime(msec,hundreds) {
            var secs = Math.floor(msec/1000);
            var hsec = Math.floor((msec/100)) % 10;
            var sec = secs % 60;
            var min = Math.floor((secs-sec)/60);
            var str = pad(min)+':'+pad(sec);
            if (hundreds) {
                // str += '.'+hsec;
                str = pad(sec)+'.'+hsec;
            }
            getElement().innerHTML = str;
            getElement().className = state;
        }

        var arm = function(countdown) {
            armTime = (1*countdown)||armTime;
            tenths = false;
            pauseTime = false;
            time = armTime*1000;
            state = 'armed';
            show();
            setTime(time,tenths);
        };

        var playPause = function(pauseStamp) {
            pauseStamp = pauseStamp||(+new Date());
            if (state === 'started') {
                var startTime = (pauseTime||armTime);
                var t = (startTime*1000) - (pauseStamp - (startStamp||pauseStamp));
                time = t;
                state = 'paused';
                pauseTime = t/1000;
            } else {
                start(false,pauseStamp);
            }
        };

        var start = function(countdown,startTime) {
            if (countdown) {
                arm(countdown);
            }
            startStamp = (1*startTime)||(+(new Date()));
            tenths = false;
            state = 'started';
            tick();
        };

        var stop = function() {
            state = 'stopped';
            pauseTime = false;
            getElement().className = state;
            window.setTimeout(hide,3000);
        };

        var zero = function() {
            time = 0;
            stop();
            setTime(time,tenths);
        };

        var toggle = function() {
            if (state == 'started') {
                stop();
            } else {
                start();
            }
        };

        var mode = function() {
            tenths = !tenths;
        };

        var tick = function() {
            if (state === 'started') {
                var now = +(new Date());
                var startTime = (pauseTime||armTime);
                time = (startTime*1000) - (now - startStamp);
                if (time < 10000) {
                    tenths = true;
                }
                if (time < 0) {
                    zero();
                    return;
                }
                setTime(time,tenths);
                window.requestAnimationFrame(tick);
            }
        };

        function show() {
            getElement().classList.remove('hidden');
        }

        function hide() {
            getElement().classList.add('hidden');
        }

        if (config.countdown) {
            armTime = config.countdown;
            setTime(armTime*1000,tenths);
        }
        if (config.visible) {
            show();
        }

        return {
            show: show,
            hide: hide,
            arm: arm,
            start: start,
            stop: stop,
            pause: playPause
        };
    }
});