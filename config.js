displaySystem.config({
    //websocket host to listen to
    // wsHost: "",
    //specify the node that is being subscribed to when using mserver
    // mserverNode: "overlay",
    //optional chromakey background color
    // background: "lime",
    //use a usb or built in camera as background video
    // useCamera: true,
    //modules, order determines z stacking
    modules: {
        'clock': {
            // visible: true
        },
        'time': {
            // visible: true
        },
        // 'twitter': {
            // visible: true
        // },
        // 'lowThird': {
            // visible: true
        // }
    },
    //path to the modules, can even be a full url
    modulePath: "modules"
});
