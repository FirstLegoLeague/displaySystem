displaySystem.registerModule({
    name: 'emojione',
    factory: function(config) {

        function convertNode(node) {
            node.innerHTML = emojione.toImage(node.innerHTML);
        }

        function scan() {
            var nodes = document.querySelectorAll(config.selector);
            nodes.forEach(convertNode)
        }

        displaySystem.loadCss('https://cdn.jsdelivr.net/emojione/3.0./extras/css/emojione.min.css');
        displaySystem.loadScript('https://cdn.jsdelivr.net/emojione/3.0.3/lib/js/emojione.min.js', () => {
            let observer = new MutationObserver((records) => {
                // console.log(records);
                records.forEach(record => {
                    record.addedNodes.forEach(node => {
                        if (node.matches && node.matches(config.selector)) {
                            convertNode(node);
                        }
                    })
                })
            });
            observer.observe(document.body, {
                childList: true,
                characterData: true,
                subtree: true
            });

            scan();
        });


        return {
            scan
        }
    }
});
