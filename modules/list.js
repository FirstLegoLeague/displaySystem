displaySystem.registerModule({
    name: 'list',
    template: `
        <div id="list" class="hidden"></div>
    `,
    style: `
        #list {
            width: calc(100% - 1em);
            color: white;
            display: grid;
            grid-auto-columns: auto;
            grid-auto-rows: auto;
        }
    `,
    factory: function(config,onMessage) {
        var numberOfLines = 8;
        var pageTimeout = 5000;
        var pageTimer;
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
            start();
        }
        function hide() {
            getElement().classList.add('hidden');
            stop();
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
            var colTypes = (pageData[0]||[]).map(cell => {
                return typeof cell;
            });
            var head = '';
            if (header) {
                head = `<div class="list-head list-row list-row-odd" style="grid-column: 1 / span ${colTypes.length}; grid-row: 1"></div>`;
                let style = `grid-column: 1 / span ${colTypes.length}; grid-row: 1;`;
                head += `<div class="list-row-odd list-head list-cell" style="${style}">${header}</div>`;
            }

            //crude estimation of width fractions by string length
            var widths = data.reduce(function(res,row) {
                row.forEach(function(cell,i) {
                    res[i] = Math.max(res[i]||0,cell.toString().length);
                });
                return res;
            },[]);
            var totalWidth = widths.reduce(function(all,w) {return all+w;},0);

            var html = pageData.slice(0,numberOfLines).map((cells, row) => {
                let rowClass = (row%2)?'list-row-odd':'list-row-even';
                let r = header? row+2: row+1;
                return [
                    `<div class="list-row ${rowClass}" style="grid-column: 1 / span ${cells.length}; grid-row: ${r + 1}"></div>`,
                    cells.map((cell,column) => {
                        let style = `grid-column: ${column + 1}; grid-row: ${r + 1};`;
                        let cellClass = colTypes[column];
                        return `<div class="list-cell ${rowClass} ${cellClass}" style="${style}">${cell}</div>`;
                    }).join(''),
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

        onMessage('setArray',function(msg) {
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
