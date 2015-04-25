displaySystem.registerModule({
    name: 'time',
    template: multiline(function() {/*
        <div id="time" class="hidden">12:00</div>
    */}),
    style: multiline(function() {/*
        @import url('fonts/lcd-bold.css');

        #time {
            position: absolute;
            top: 0.5em;
            left: 0.5em;
            color: white;
            font-size: 96px;
        }
    */}),
    factory: function(config) {

        var offset = 0;
        var div;

        function pad(nr) {
            return ((nr<10)?'0':'')+nr;
        }

        function getTimeDiv() {
            return div?div:(div=document.getElementById('time'));
        }

        function setMsgTime(timestamp) {
            var time = new Date(timestamp).getTime(); //parse?
            offset = time - (new Date());
        }

        function time() {
            var now = new Date((offset||0) + (new Date()).getTime());
            var hh = pad(now.getHours());
            var mm = pad(now.getMinutes());
            getTimeDiv().innerHTML = hh+':'+mm;
            window.setTimeout(time,500);
        }

        function showTime() {
            getTimeDiv().className = '';
        }

        function hideTime() {
            getTimeDiv().className = 'hidden';
        }

        time();

        if (config.visible) {
            showTime();
        }

        return {
            show: showTime,
            hide: hideTime,
            set: setMsgTime
        };
    }
});
