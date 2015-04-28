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
    factory: function(config,onMessage) {

        var offset = 0;
        var div;

        function pad(nr) {
            return ((nr<10)?'0':'')+nr;
        }

        function getElement() {
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
            getElement().innerHTML = hh+':'+mm;
            window.setTimeout(time,500);
        }

        function show() {
            getElement().className = '';
        }

        function hide() {
            getElement().className = 'hidden';
        }

        time();

        if (config.visible) {
            show();
        }
        onMessage('show',function() {
            show();
        });
        onMessage('hide',function() {
            hide();
        });

        return {
            show: show,
            hide: hide,
            set: setMsgTime
        };
    }
});
