displaySystem.config({
    //websocket host to listen to
    wsHost: "ws://192.168.0.102:13900",
    //specify the node that is being subscribed to when using mserver
    mserverNode: "overlay",
    //optional chromakey background color
    // background: "lime",
    //modules, order determines z stacking
    modules: [
        'clock',
        'time',
        'twitter',
        'lowThird'
    ],
    //path to the modules, can even be a full url
    modulePath: "modules"
});
