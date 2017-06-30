displaySystem.registerModule({
    name: 'geometry',
    style: `
        #mainContainer {
            position: absolute;
            left: 50vw;
            top: 50vh;

        }
    `,
    factory: function(config) {
        var el;

        function getContainer() {
            return el?el:(el=document.getElementById('mainContainer'));
        }

        function getScale() {
            return config.zoom||1;
        };
        function getViewport() {
            var overscan = config.overscan || [0,0,0,0];
            var w = document.body.clientWidth-overscan[1]-overscan[3];
            var h = document.body.clientHeight-overscan[0]-overscan[2];
            return {
                w: w,
                h: h,
                a: w/h
            };
        };
        function getAspect() {
            if (typeof config.aspect==='number') {
                return config.aspect;
            } else {
                return getViewport().a;
            }
        };

        function redraw() {
            var vp = getViewport();
            var scale = getScale();
            var scaleX = vp.a*scale/getAspect();
            var scaleY = scale;
            //pixel size of the viewport (scaled)
            var bw = vp.w/scaleX;
            var bh = vp.h/scaleY;
            //size of the rotated viewport
            var width = ((config.rotation%180)===90)?bh:bw;
            var height = ((config.rotation%180)===90)?bw:bh;

            var style = '';
            var rotate = 'rotate('+(config.rotation||0)+'deg)';
            var scaleX = 'scaleX('+scaleX+')';
            var scaleY = 'scaleY('+scaleY+')';
            var transform = scaleX+' '+scaleY+' '+rotate+';';
            style += '-webkit-transform: '+transform;
            style += '-moz-transform: '+transform;
            style += 'transform: '+transform;
            style += 'width:'+width+'px;';
            style += 'height:'+height+'px;';
            //center
            style += 'margin-left:'+(-width/2)+'px;';
            style += 'margin-top:'+(-height/2)+'px;';
            getContainer().style = style
        }

        function right() {
            config.rotation = (config.rotation + 90) % 360;
            redraw();
        }
        function left() {
            config.rotation = (config.rotation + 270) % 360;
            redraw();
        }

        function zoomin() {
            config.zoom += 0.1;
            redraw();
        }

        function zoomout() {
            config.zoom -= 0.1;
            redraw();
        }

        function zoomreset() {
            config.zoom = 1;
            redraw();
        }

        redraw();

        return {
            left,
            right,
            zoomin,
            zoomout,
            zoomreset

        };
    }
});
