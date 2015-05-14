displaySystem.registerModule({
    name: 'camera',
    template: multiline(function() {/*
        <video id="camera" class="hidden" autoplay></video>
    */}),
    style: multiline(function() {/*
        #camera {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
        }

        #camera.hidden {
            display: none;
        }
    */}),
    factory: function(config,onMessage) {
        var el;
        var useAudio = false;

        function getElement() {
            return el?el:(el=document.getElementById('camera'));
        }

        function init() {
            navigator.getUserMedia  = navigator.getUserMedia ||
                          navigator.webkitGetUserMedia ||
                          navigator.mozGetUserMedia ||
                          navigator.msGetUserMedia;

            var video = document.querySelector('video');

            if (navigator.getUserMedia) {
                navigator.getUserMedia({audio: useAudio, video: true}, function(stream) {
                    video.src = window.URL.createObjectURL(stream);
                }, function() {
                    console.log('could not capture video');
                });
            } else {
                console.log('no user video possible in this browser');
            }
        }

        function show() {
            getElement().className = '';
        }

        function hide() {
            getElement().className = 'hidden';
        }

        if (config.audio) {
            useAudio = true;
        }
        if (config.visible) {
            show();
        }
        onMessage('show',function() {
            show();
        });
        onMessage('hide',function() {
            hide();
        });

        init();

        return {
            show: show,
            hide: hide
        };
    }
});