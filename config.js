displaySystem.config({
    //websocket host to listen to
    wsHost: "ws://localhost:13900/",
    //specify the node that is being subscribed to when using mserver
    mserverNode: "overlay",
    //optional chromakey background color
    // background: "lime",
    //modules, order determines z stacking
    modules: {
        'camera': {
            visible: true,
        },
        'clock': {
            // visible: true,
            // countdown: 20,
        },
        'time': {
            // visible: true,
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
        'css': {
            href: 'themes/rednblue.css',
            // href: 'themes/default.css',
        }
    },
    //path to the modules, can even be a full url
    modulePath: "modules"
});
