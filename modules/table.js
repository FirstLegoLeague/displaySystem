displaySystem.registerModule({
    name: 'table',
    template: `
        <table id="table" class="hidden"></table>
    `,
    style: `
        #table {
            width: calc(100% - 1em);
            color: white;
            background: black;
        }
        #table td {
            text-align: center;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            max-width: 0;
            width: 0;
        }
    `,
    /*  Add this to the style to cause the second column on each
        row to take the most space. Replace the number 2 in the selector
        for a similar effect on a different column
        table#table td:nth-child(2) {
            width:100%;
            //optional
            //text-align: left;
        }
    */
    factory: function (config, onMessage) {
        
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
            getElement().classList.add('visible');
            start();
        }
        function hide() {
            getElement().classList.add('hidden');
            getElement().classList.remove('visible');
            stop();
        }

        function setFromString(pasteFromExcel) {
            var lines = pasteFromExcel.trim().split(/[\n\r]+/);
            var data = lines.map(function (line) {
                return line.split(/\t/);
            });
            header = data.shift();
            set(data, header);
        }

        function setPage(data, header, page) {
            var pageData = data.slice(page * numberOfLines, (page + 1) * numberOfLines);
            var head = '';
            if (header) {
                head = '<thead><tr><th>' + header.join('</th><th>') + '</th></tr></thead>';
            }

            var html = pageData.slice(0, numberOfLines).map(function (row) {
                return [
                    '<tr>',
                    row.map(function (cell, i, a) {
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

        function nextPage(data, header, page) {
            var pages = Math.ceil(data.length / numberOfLines);
            var current = page;
            var next = (current + 1) % pages;
            setPage(data, header, current);
            if (pageTimer) {
                window.clearTimeout(pageTimer);
                pageTimer = null;
            }
            if (running) {
                pageTimer = window.setTimeout(function () {
                    nextPage(data, header, next);
                }, pageTimeout);
            }
        }

        function set(data, header) {
            nextPage(data, header, 0);
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
                set(config.data, config.header);
            } else {
                setFromString(config.data, config.header);
            }
        }
        if (config.visible) {
            show();
        }

        onMessage('setData', function (msg) {
            set(msg.data.data, msg.data.header);
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
