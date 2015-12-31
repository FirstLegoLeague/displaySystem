displaySystem.registerModule({
    name: 'list',
    template: multiline(function() {/*
        <div id="list" class="hidden"></div>
    */}),
    style: multiline(function() {/*
        #list {
            position: absolute;
            left: 25vw;
            top: 10vh;
            width: 50vw;
            font-size: 6vh;
            box-sizing: border-box;
        }
        #list .cell {
            display: inline-block;
            box-sizing: border-box;
        }
    */}),
    factory: function(config) {
        var numberOfLines = 8;
        var pageTimer = 5000;
        var running = true;

        function getElement() {
            return document.getElementById('list');
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
        }
        function hide() {
            getElement().classList.add('hidden');
        }

        function setFromString(pasteFromExcel,header) {
            var lines = pasteFromExcel.trim().split(/[\n\r]+/);
            var data = lines.map(function(line) {
                return line.split(/\t/);
            });
            set(data,header);
        }

        function setPage(data,header,page) {
            var pageData = data.slice(page*numberOfLines,(page+1)*numberOfLines);
            var head = '';
            if (header) {
                head = '<div class="header"><span>'+header+'</span></div>';
            }

            var html = pageData.slice(0,numberOfLines).map(function(row) {
                return [
                    '<div class="row">',
                    row.map(function(cell,i,a) {
                        return [
                            '<div class="cell" style="width:',
                            i?(25/(a.length-1)+'vw'):'25vw',
                            '">',
                            '<span>',
                            cell,
                            '</span>',
                            '</div>'
                        ].join('');
                    }).join(''),
                    '</div>'
                ].join('');
            }).join('');
            getElement().innerHTML = head + html;
        }

        function nextPage(data,header,page) {
            var pages = Math.ceil(data.length / numberOfLines);
            var current = page;
            var next = (current+1) % pages;
            setPage(data,header,current);
            window.setTimeout(function() {
                nextPage(data,header,next);
            },pageTimer);
        }

        function set(data,header) {
            nextPage(data,header,0);
        }

        function start() {
            running = true;
        }

        function stop() {
            running = false;
        }

        function setTimer(seconds) {
            pageTimer = seconds * 1000;
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

        return {
            show: show,
            hide: hide,
            set: setFromString,
            timer: setTimer,
            lines: setLines
        };
    }
});