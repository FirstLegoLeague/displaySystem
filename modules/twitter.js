displaySystem.registerModule({
    name: 'twitter',
    template: multiline(function() {/*
        <div id="twitter" class="hidden"><span class="container"></span></div>
    */}),
    style: multiline(function() {/*
        #twitter {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            overflow: hidden;
        }

        #twitter .container {
            white-space: nowrap;
            display: inline-block;
            font-size: 0;
        }

        #twitter .tweet {
            padding-right: 1.5em;
            font-size: 6vh;
        }
    */}),
    factory: function(config,onMessage) {

        var tweetsIndex = {};
        var tweets = [];
        var visibleTweets = [];
        var div;
        var container;
        var screenWidth;
        var containerWidth;
        var firstWidth;
        var head = 0;
        var tail = 0;
        var offset = 0;
        var speed = 100;
        var seq = 0;

        function getTwitterDiv() {
            return div?div:(div=document.getElementById('twitter'));
        }

        function getContainer() {
            return container?container:(container = getTwitterDiv().firstChild);
        }

        function show() {
            getTwitterDiv().className = '';
        }

        function hide() {
            getTwitterDiv().className = 'hidden';
        }

        //sorting
        function by(key) {
            return function(a,b) {
                if (a[key]==b[key]) {
                    return 0;
                } else {
                    return (a[key]<b[key])?-1:1;
                }
            };
        }

        function add(msg) {
            var data = {
                statusId: msg.id,
                author: msg.user.screen_name,
                message: msg.text,
                created: 1*msg.timestamp_ms
            };
            tweetsIndex[data.statusId] = data;
            sequence();
        }

        function remove(msg) {
            delete tweetsIndex[msg.id];
            sequence();
        }

        function addStr(author, tweet) {
            add({
                id: seq,
                user: {screen_name: author},
                text: tweet,
                timestamp_ms: +(new Date())
            });
            seq += 1;
        }

        function remStr(index) {
            remove({
                id: 1*index
            });
        }

        var t = +(new Date());
        function tick() {
            var now = +(new Date());
            animate(now - t);
            t = now;
            window.requestAnimationFrame(tick);
        }

        render();
        tick();

        function animate(dt) {
            // speed in px per second
            offset += speed * dt / 1000;
            getContainer().style.transform = 'translateX('+ -offset +'px)';

            //add tweets if container too small
            if (containerWidth < screenWidth) {
                addNext();
            }
            //add tweets if right edge enters screen
            if (offset > (containerWidth - screenWidth)) {
                addNext();
            }
            //remove tweet if it scrolls off screen
            if(offset > firstWidth) {
                removeFirst();
            }
        }

        function renderTweet(tweet) {
            return [
                '<span class="tweet">',
                // tweet.statusId,
                '<span class="author">@',
                tweet.author,
                '</span>: ',
                '<span class="message">',
                tweet.message,
                '</span>',
                '</span>'
            ].join('');
        }

        // get the most recent set of tweets to work with
        // sorts tweets by time, keeps last 10;
        // after adding / deleting tweets
        function sequence() {
            tweets = Object.keys(tweetsIndex).map(function(statusId) {
                return tweetsIndex[statusId];
            }).sort(by('created')).slice(-10);
        }

        // rerenders the ticker html (after adding removing from it)
        function render() {
            var str = visibleTweets.map(renderTweet).join(' ');
            getContainer().innerHTML = str;
            containerWidth = getContainer().offsetWidth;
            getFirstWidth();
        }

        // adds a new tweet to the ticker end
        function addNext() {
            if (tweets.length) {
                visibleTweets.push(tweets[tail]);
                tail = (tail + 1) % tweets.length;
                render();
            }
        }
        // removes the first tweet from the ticker head
        function removeFirst() {
            visibleTweets.shift();
            head = (head + 1) % tweets.length;
            offset -= firstWidth;
            getContainer().style.transform = 'translateX('+ -offset +'px)';
            render();
        }

        function getFirstWidth() {
            var fc = getContainer().firstChild;
            if (fc) {
                firstWidth = fc.offsetWidth;
            }
        }

        function getScreenWidth() {
            screenWidth = document.body.offsetWidth;
        }
        getScreenWidth();
        window.addEventListener('resize',getScreenWidth);

        if (config.visible) {
            show();
        }
        if (config.speed) {
            speed = config.speed;
        }

        onMessage('addMessage',function(msg) {
            add(msg.data);
        });

        /**
         * TODO
         * keep "removed" tweets while they're in view, add class to hide
         * when adding a tweet add at end
         * when removing a tweet, update an offset if 
         */

        return {
            show: show,
            hide: hide,
            add: addStr,
            remove: remStr
        };
    }
});