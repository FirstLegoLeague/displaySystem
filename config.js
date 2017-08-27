displaySystem.config({
    //websocket host to listen to
    wsHost: "localhost:13900/",
    //host to listen to in case of a secure connection
    wssHost: "localhost.daplie.com:13900/",
    //specify the node that is being subscribed to when using mserver
    mserverNode: "default",
    //modules, order determines z stacking
    modules: {
        'background': {
            visible: false,
            color: 'black',
            //optional chromakey background color
            // color: "lime",
        },
        'camera': {
            visible: false,
            // audio: true,
        },
        'gallery': {
            visible: false,
            transition: 'fade',
            size: 'cover',
            timeout: 4,
            images: [
                'http://lorempixel.com/640/480/people/1',
                'http://lorempixel.com/640/480/people/2',
                'http://lorempixel.com/640/480/people/3',
                'http://lorempixel.com/640/480/people/4'
            ],
            pages: [
                // 'http://www.fll-tools.com/'
            ],
        },
        'clock': {
            visible: false,
            // countdown: 20,
        },
        'time': {
            visible: false,
            // format: "MM:ss",
        },
        'twitter': {
            // visible: true,
            // speed: 500,
        },
        'lowThird': {
            visible: false,
            line1: '❤️ press \'C\'',
            line2: 'to show the control window',
        },
        'list': {
            // visible: true,
            header: 'results round 1',
            data: [
                ['🇳🇱 just try', 1],
                ['🇳🇱 to copy', 2],
                ['🇪🇬 and paste', 3],
                ['🇪🇬 some cells', 4],
                ['🇪🇬 from excel', 5],
                ['🇺🇸 into the control', 6],
                ['🇺🇸 window! You\'ll be', 7],
                ['🇺🇸 amazed!', 8],
                ['🇳🇱 It even has', 8],
                ['🇳🇱 automatic', 8],
                ['🇳🇱 paging', 8],
            ],
            timer: 5000,
            lines: 12
        },
        'sprite': {
            visible: true,
            texts: [{
                data:'2017 Regional, Modiin'
            }
            ],
            sprites: [{
                side: 'top',
                id: 'FIRST',
                alias: 'firstLegoLeague',
                imgClass: 'firstLogo',
            },
            {
                side: 'top',
                id: 'challenge',
                alias: 'challengeTheme',
                imgClass: 'challengeLogo'

            }, {
                side: 'top',
                id: 'LEGOEd',
                alias: 'legoEducation',
                imgClass: 'legoLogo',
            },
            {
                side: 'bottom',
                id: 'sponsor1',
                alias: 'sponsor1',
                imgClass: 'sponsor1Img',
            }, {
                side: 'bottom',
                id: 'sponsor2',
                alias: 'sponsor2',
                imgClass: 'sponsor2Img',

            }]
        },
        'table': {
            visible: true,
            header: ['rank', 'NO.', 'name', 'best', '1', '2', '3'],
            data: [
                ['--', '--', '   ', '--', '--', '--', '--'],

            ],
            timer: 10000,
            lines: 8
        },
        'css': {
            href: [
                'themes/fll/flltable.css',
                // 'themes/rednblue-plus/rednblue-plus-mod-rtl.css',
                // 'themes/rednblue-plus/rednblue-plus-mod-opaque.css'
            ],
            // href: [
            //     'themes/rednblue/rednblue.css',
            //     // 'themes/rednblue/rednblue-mod-rtl.css'
            // ],
            // href: 'themes/default/default.css',
            // gist: '9c7e4efaba9dbbc4831b'
        },
        'geometry': {
            zoom: 1,
            aspect: 'native',
            rotation: 0,
            overscan: [0, 0, 0, 0]
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
            'y': 'table.show()',
            'h': 'table.hide()',
            'c': 'controls.open()',
            // 'c': function() {
            //     window.open('controls.html','fllDisplayControlWindow','resize=yes,width=800,height=350');
            // }
        },
        'controls': {
            //url: <your own control window>
        },
        'emojione': {
            // displays emoji characters
            selector: '.line1, .list-cell, .tweet'
        }
    },
    //path to the modules, can even be a full url
    modulePath: "modules"
});
