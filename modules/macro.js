displaySystem.registerModule({
    name: 'macro',
    factory: function(config) {

        function wait(seconds){
            return new Promise(function(resolve) {
                setTimeout(resolve, (seconds || 0) * 1000);
            });
        }

        function sequence(pending, fn) {
            return pending.then(fn);
        }

        function execute(macro){
            macro.map(createHandler).reduce(sequence, Promise.resolve());
        }

        function createHandler(str) {
            return new Function('return displaySystem.modules.'+str);
        }

        function init(){
            var expose = {};
            expose['wait'] = wait;

            Object.keys(config).forEach(function(m) {
                expose[m] = function() {
                    execute(config[m]);
                }
            });

            return expose;
        }

        return init();
    }
});