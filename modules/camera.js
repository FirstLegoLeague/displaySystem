displaySystem.registerModule({
    name: 'camera',
    template: `
        <div id="camera" class="hidden">
            <video id="camera" autoplay></video>
            <div id="cameraError"></div>
        </div>
    `,
    style: `
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

        #cameraError {
            display: none;
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 30vh;
            padding-top: 30vh;
            text-align: center;
            font-size: 3vh;
            color: black;
            text-shadow:
               -1px -1px 0 #fff,  
                1px -1px 0 #fff,
               -1px  1px 0 #fff,
                1px  1px 0 #fff;
            }

        }
    `,
    factory: function(config) {
        var el;
        var useAudio = false;

        function getElement() {
            return el?el:(el=document.getElementById('camera'));
        }

        function showError(msg) {
            var el = document.getElementById('cameraError');
            msg = 'The camera module could not be initialized<br>' + msg;
            msg += '<br>You may want to disable the camera module';
            el.innerHTML = msg;
            el.style.display = 'block';
        }

        function init() {
            navigator.getUserMedia  = navigator.getUserMedia ||
                          navigator.webkitGetUserMedia ||
                          navigator.mozGetUserMedia ||
                          navigator.msGetUserMedia;

            var video = document.querySelector('#camera video');

            if (navigator.getUserMedia) {
                navigator.getUserMedia({
                    audio: useAudio,
                    video: true
                }, function(stream) {
                    video.src = window.URL.createObjectURL(stream);
                }, function(error) {
                    console.log(error);
                    switch(error.name) {
                        case "PermissionDeniedError":
                            // The user or browser denied permission to the camera
                            showError("Please enable camera permissions in your browser");
                            break;
                        case "NotSupportedError":
                            // e.g. if we want audio and the browser doesn't support thats
                            showError("The requested acces to the camera is not supported");
                            break;
                        case "ConstraintNotSatisfiedError":
                            // e.g. audio or video
                            showError("No media tracks of the requested types were found");
                            break;
                        case "DevicesNotFoundError":
                        case "NotFoundError":
                            showError("The camera can not be found");
                            break;
                        case "AbortError":
                            showError("The operation was aborted");
                            break;
                        default:
                            showError(error.name + ", message: " + (error.message||'no message'));
                    }
                });
            } else {
                showError('no user video possible in this browser');
            }
        }

        function show() {
            getElement().classList.remove('hidden');
            getElement().classList.add('visible');
        }

        function hide() {
            getElement().classList.add('hidden');
            getElement().classList.remove('visible');
        }

        if (config.audio) {
            useAudio = true;
        }
        if (config.visible) {
            show();
        }

        init();

        return {
            show: show,
            hide: hide
        };
    }
});
