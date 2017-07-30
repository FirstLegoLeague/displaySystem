displaySystem.registerModule({
    name: 'table',
    template: multiline(function() {/*
        <table id="table" class="hidden"></table>
    */}),
    style: multiline(function() {/*
        #table {
            color: white;
            margin: 20vh auto;
            font-size: 30px;
        }
        #table.hidden {
            display: none;
        }
    */}),
    factory: function(config,onMessage) {
        var numberOfLines = 8;
        var pageTimeout = 5000;
        var pageTimer;
        var running = true;

        function getElement() {
            return document.getElementById('table');
        }
        function persist() {
            getLowerThird().className = '';
            visible = true;
            if (timer) {
                clearTimeout(timer);
                timer = null;
            }
        }
        function show() {
            getElement().classList.remove('hidden');
            start();
        }
        function hide() {
            getElement().classList.add('hidden');
            stop();
        }

        function setFromString(pasteFromExcel) {
            var lines = pasteFromExcel.trim().split(/[\n\r]+/);
            var data = lines.map(function(line) {
                return line.split(/\t/);
            });
            header = data.shift();
            set(data,header);
        }

        function setPage(data,header,page) {
            var pageData = data.slice(page*numberOfLines,(page+1)*numberOfLines);
            var head = '';
            if (header) {
                head = '<tr><th>'+header.join('</th><th>')+'</th></tr>';
            }

            var html = pageData.slice(0,numberOfLines).map(function(row) {
                return [
                    '<tr>',
                    row.map(function(cell,i,a) {
                        return [
                            '<td>',
                            cell,
                            '</td>'
                        ].join('');
                    }).join(''),
                    '</tr>'
                ].join('');
            }).join('');
            getElement().innerHTML = head + html;
        }

        function nextPage(data,header,page) {
            var pages = Math.ceil(data.length / numberOfLines);
            var current = page;
            var next = (current+1) % pages;
            setPage(data,header,current);
            if (pageTimer) {
                window.clearTimeout(pageTimer);
                pageTimer = null;
            }
            if (running) {
                pageTimer = window.setTimeout(function() {
                    nextPage(data,header,next);
                },pageTimeout);
            }
        }

        function set(data,header) {
            nextPage(data,header,0);
        }

        function start() {
            running = true;
        }

        function stop() {
            running = false;
            if (pageTimer) {
                window.clearTimeout(pageTimer);
                pageTimer = null;
            }
        }

        function setTimer(seconds) {
            pageTimeout = seconds * 1000;
        }

        function setLines(lines) {
            numberOfLines = lines;
        }

        if (config.timer) {
            setTimer(config.timer / 1000);
        }
        if (config.lines) {
            setLines(config.lines);
        }
        if (config.data) {
            if (config.data instanceof Array) {
                set(config.data,config.header);
            } else {
                setFromString(config.data,config.header);
            }
        }
        if (config.visible) {
            show();
        }

        onMessage('setData',function(msg) {
            set(msg.data.data,msg.data.header);
        });

        return {
            show: show,
            hide: hide,
            set: setFromString,
            timer: setTimer,
            lines: setLines
        };
    }
});