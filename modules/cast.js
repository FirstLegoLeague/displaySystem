displaySystem.registerModule({
    name: 'cast',
    scripts: [
        '//www.gstatic.com/cv/js/sender/v1/cast_sender.js',
        // '//firstlegoleague.github.io/castDeck/js/senderApplication.js'
    ],
    factory: function(config,onMessage) {

        var session;
        var url;

        function cast(cb) {
            console.log('cast');
            chrome.cast.requestSession(function(_session) {
                console.log('has session',arguments);

                session = _session;

                session.sendMessage(
                    'urn:x-cast:org.firstlegoleague.castDeck',
                    'hello world',
                    function() {
                        console.log('msg sent');
                    },
                    function() {
                        console.log('msg err');
                    }
                );
                session.addMessageListener(
                    'urn:x-cast:org.firstlegoleague.castDeck',
                    function() {
                        console.log('got msg',arguments);
                    }
                );
                if (cb) {
                    cb();
                }
            }, function() {
                console.log('has error',arguments);
            });
        }

        function sendMessage(obj) {
            var str = JSON.stringify(obj);
            session.sendMessage(
                'urn:x-cast:org.firstlegoleague.castDeck',
                str,
                function() {
                    console.log('update sent');
                },
                function() {
                    console.log('update err');
                }
            );
        }

        function sendUpdate() {
            sendMessage({
                url: url,
            });
        }

        function stop() {
            console.log('stop');
            session.stop();
        }

        function updateUrl() {
            url = document.getElementById('url').value;
            sendUpdate();
        }

        function initCast() {
            console.log('cast api');
            var sessionRequest = new chrome.cast.SessionRequest('4EC978AD');
            var apiConfig = new chrome.cast.ApiConfig(sessionRequest,
                function(_session) {
                    console.log('existing session',arguments);
                    session = _session;
                },
                function() {
                    console.log('receiverListener',arguments);
                }
            );
            chrome.cast.initialize(apiConfig,
                function() {
                    console.log('init success');
                }, function() {
                    console.log('init error');
                }
            );
        }

        window['__onGCastApiAvailable'] = function(loaded, errorInfo) {
            if (loaded) {
                initCast();
            } else {
                console.log(errorInfo);
            }
        };

        function startCast() {
            console.log(displaySystem)
            console.log('start cast, forward all commands');
            //start the cast
            console.log(window.chrome.cast);
            cast.call(displaySystem.controlWindow,function() {
                //chromecast connected, send yourself
                console.log('cast ready');
                url = window.location.href;
                sendUpdate();
            });

        }

        function stopCast() {
            console.log('stop cast');
            stop();
        }

        return {
            cast: startCast,
            stop: stopCast
        };
    }
});