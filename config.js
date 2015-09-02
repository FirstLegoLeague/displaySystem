displaySystem.config({
    //websocket host to listen to
    wsHost: "ws://localhost:13900/",
    //specify the node that is being subscribed to when using mserver
    mserverNode: "overlay",
    //optional chromakey background color
    // background: "lime",
    //modules, order determines z stacking
    modules: {
        'background': {
            color: 'black',
            // visible: false
        },
        'camera': {
            visible: true,
            // audio: true,
        },
        'clock': {
            // visible: true,
            // countdown: 20,
        },
        'time': {
            // visible: true,
            // format: "MM:ss",
        },
        'twitter': {
            // visible: true,
            // speed: 500,
        },
        'lowThird': {
            visible: true,
            line1: 'press \'C\'',
            line2: 'to show the control window',
        },
        'list': {
            // visible: true,
            header: 'results round 1',
            data: [
                ['just try',1],
                ['to copy',2],
                ['and paste',3],
                ['some cells',4],
                ['from excel',5],
                ['into the control',6],
                ['window! You\'ll be',7],
                ['amazed!',8],
            ]
        },
        'css': {
            href: 'themes/rednblue.css',
            // href: 'themes/default.css',
            // gist: '9c7e4efaba9dbbc4831b'
        },
        'keybindings': {
            'q': 'time.show()',
            'a': 'time.hide()',
            'w': 'clock.show()',
            's': 'clock.hide()',
            'e': 'lowThird.show()',
            'd': 'lowThird.hide()',
            'r': 'twitter.show()',
            'f': 'twitter.hide()',
            't': 'list.show()',
            'g': 'list.hide()',
            'c': function() {
                window.open('controls.html','fllDisplayControlWindow','resize=yes,width=600,height=300');
            }
        }
    },
    //path to the modules, can even be a full url
    modulePath: "modules"
});
