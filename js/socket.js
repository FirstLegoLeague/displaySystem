var ws = (function() {
    var ws = new WebSocket(host);
    ws.onopen=function() {
        ws.send(JSON.stringify({
            type: "subscribe",
            node: "overlay"
        }));
    };
    ws.onerror=function(e){
        console.log("error", e);
    };
    ws.onclose = function() {
        console.log("close");
    };

    return ws;
}());