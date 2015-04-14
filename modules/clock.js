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
            font-family: lcdbold;
            color: #ffd204;
            -webkit-text-fill-color: #ffd204;
            -webkit-text-stroke-width: 1px;
            -webkit-text-stroke-color: black;
            transition: top 0.3s;
        }

        #clock.hidden {
            top: -2em;
        }
        #clock.stopped {
            color: red;
            -webkit-text-fill-color: #c41425;
        }
        #clock.armed {
            color: blue;
            -webkit-text-fill-color: #0066b3;
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

        function getClockDiv() {
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
            if (msec < 0) {
                zero();
                return;
            }

            var secs = Math.floor(msec/1000);
            var hsec = Math.floor((msec/100)) % 10;
            var sec = secs % 60;
            var min = Math.floor((secs-sec)/60);
            var str = pad(min)+':'+pad(sec);
            if (hundreds) {
                // str += '.'+hsec;
                str = pad(sec)+'.'+hsec;
            }
            getClockDiv().innerHTML = str;
            getClockDiv().className = state;
        }

        var arm = function(countdown) {
            armTime = (1*countdown)||armTime;
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
                start(pauseStamp);
            }
        };

        var start = function(startTime,countdown) {
            if (countdown) {
                arm(countdown);
            }
            startStamp = (1*startTime)||(+(new Date()));
            state = 'started';
            tick();
        };

        var stop = function() {
            state = 'stopped';
            pauseTime = false;
            getClockDiv().className = state;
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
                setTime(time,tenths);
                window.requestAnimationFrame(tick);
            }
        };

        function show() {
            getClockDiv().classList.remove('hidden');
        }

        function hide() {
            getClockDiv().classList.add('hidden');
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
            stop: stop
        };
    }
});