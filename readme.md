Display Systems
================

This is a general purpose, configurable system for data display. It currently contains 5 modules, which are explained further on.

All modules can be controlled via [websockets](http://en.wikipedia.org/wiki/WebSocket). In particular, we support [mserver](https://github.com/poelstra/mserver), which was made for this purpose and supports a higher level of messaging, routing, relaying and clustering. In any case, ordinary websocket is supported, as long as it delivers messages in the format described in the modules.

Also, all modules can be controlled via a javascript interface, so you can write your own scripts to interface with them. Lastly, we provide a control panel that can be opened in a separate screen to control the modules.

Get it running
-------

### Get is locally

Either:

- If you know what `git` is: clone the repository: `git clone https://github.com/FirstLegoLeague/displaySystem.git` and check out the branch `gh-pages`.
- Otherwise, just download the zip from: <https://github.com/FirstLegoLeague/displaySystem/archive/gh-pages.zip> and unpack.
- Also, you can just use it [online](http://firstlegoleague.github.io/displaySystem/), however, you can't really customize anything. It is a nice way to check it out though.

There are a few ways to use this package

### As a simple display in the browser

1. Double click `index.html`. This shows a white screen. Don't worry.
1. Open the console by pressing `F12` and selecting the `console` tab.
1. Type `displaySystem.modules.time.show()` and hit `enter`.

Ok, some clarification. All modules are hidden by default. Also, all modules are accessible to javascript, which makes it possible to control them. In step 3, you just executed some javascript to show the time. Let's do this some more:

- `displaySystem.modules.time.hide()`
- `displaySystem.modules.clock.show()`
- `displaySystem.modules.clock.start()`

You probably do not want to do this every time you load the display. So, open `config.js` and replace

    'clock': {
        // visible: true
    },

by

    'clock': {
        visible: true
    },

And reload the page. Voilà, the clock is visible by default. You can also do this with other modules.

Also, you probably always want to use the page in full screen mode. To enable full screen, press `F11`.

### Using the control window

Since the display can be controlled by javascript, you could create a control window with buttons and such to control everything. You may set this up with two monitors, one facing the audience and one facing you. This way, you can control the screen without having buttons visible.

Luckily, we have already done this for you, but there is a catch. The control window does not work when you are using the display system directly from the file system (if this is the case, the address bar starts with `file:///`). There are a few ways to solve this:

- Use the [online version](http://firstlegoleague.github.io/displaySystem/), but as said, there is not much to customize here.
- Host it somewhere online (most hosting providers allow you to FTP the files).
- Host it locally, for this you need to install a web server. The easiest one I can think of is installed like this:
    - install nodejs from <https://nodejs.org/>
    - open a command window (from the start menu, type `cmd` and press enter)
    - install a static file server by typing `npm install -g node-static`. This will install a simple web server.
    - open the folder where you downloaded this display system (in the command window)
    - type `static`
    - you can now open the application by navigating to <http://localhost:8080>
- Lastly, you can also control the display system by other means, but this gets more complicated. More on that below.

So, the control window. To open it, press `c`

The control window shows buttons for all commands that the modules have. There are also input fields if the commands can take arguments. Try and use this to display the time or the clock (for instance in the [online version](http://firstlegoleague.github.io/displaySystem/)).

### Using as a video overlay system

If you want to use the display system as an overlay to a video feed (which is the original purpose), you need to get rid of the white background and replace it with live video. There are several ways to do this

- Use the browser as your video mixer. To do this, use the `camera` module. By feeding in a video signal (for instance using a usb camera), you can create a composite output. You may want to set the `background` configuration to black if the screen size does not match the video size. If you have a webcam, you may already have discovered this in the [online version](http://firstlegoleague.github.io/displaySystem/).
- Give the background a special color, and use a separate video mixer with [chroma key](http://en.wikipedia.org/wiki/Chroma_key) capabilities to mix the overlay over a video feed. Use the `background` configuration option to do this.
- Use more advanced software video mixing software, like [caspar CG](http://www.casparcg.com/). In the newest versions, you can use a `HTML producer` to overlay a webpage (like this display system) over a video. Make sure, you set the `background` configuration off to have a transparent background. Also, from within Caspar, you can create JavaScript functions to control the modules, much like we have done manually from the console.

### Controlling the modules via websockets

If the display system is configured to listen to a websocket server, which can be [mserver](https://github.com/poelstra/mserver) or some other websocket server, it expects messages of the form:

    {
        "topic": <module:action>,
        "data": {}
    }

For example:

    {
        "topic": "twitter:add",
        "data": {
            "statusId": 123,
            "author": "FLL",
            "message": "FLL is great!"
        }
    }

Since websockets only support text transfer, the above object should be serialized to JSON. It is automatically deserialized and passed to the apropriate module. To get mserver running, follow [the instructions](https://github.com/poelstra/mserver). In short:

Install:

    git clone https://github.com/poelstra/mserver
    cd mserver
    npm install
    npm run build

Start:

    npm start

Send a message:

    //*nix
    node dist/src/client -n default -t twitter:add -d '{"statusId":123,"author":"FLL","message":"FLL is great"}'
    //windows
    node dist/src/client -n default -t twitter:add -d "{""statusId"":123,""author"":""FLL"",""message"":""FLL is great""}"

In your config.js, make sure you have the following options:

    wsHost: "ws://localhost:13900",
    mservernode: "default"

### Adding a twitter feed to your display.

Being able to send messages via websockets is nice, but it would be even more nice to connect a twitter feed to the whole lot, right? Luckily there is a command line application to read a twitter stream: [node-tweet-cli](https://github.com/voronianski/node-tweet-cli)

Install it like so:

    npm install -g node-tweet-cli

Login (see [the instructions](https://github.com/voronianski/node-tweet-cli) if it is not clear):

    tweet login

Now test your twitter stream in the console:

    tweet stream lego --json

This would start streaming live twitter messages in your console. You are now one step away from connecting everything:

    tweet stream lego --json | node dist/src/client -n default -t twitter:add -i json

This command uses [pipes](http://en.wikipedia.org/wiki/Pipeline_(Unix)) to take the output of the `tweet` utility and *pipe* it into the `mserver` client.


Configuration
--------------

All basic configuration is done in the config.js file. The configuration options are:

- `wsHost`: Websocket host to connect to, if any
- `mserverNode`: Node to subscribe to when using [mserver](https://github.com/poelstra/mserver), can be omitted otherwise
- `background`: Background color of the application. Can be used for chromakeying. If omitted, the background color is not defined, which can mean transparent in for instance a [casparCG HTML producer](http://www.casparcg.com/)
- `modules`: Object of modules to load. The keys should correspond to names of js files in the modules folder, the values can be an empty object or some configuration, see the modules section for configuration options per module. The config already contains all options, but some are commented out. Enable them by removeing the comments.
- `modulePath`: Path to load the modules from, defaults to `modules`. Can even be an url to another domain, since everything is loaded as a normal JavaScript file.

Styling
-----------

This repository provides basic styling, a git submodule, `graphicsPack` is included and provides images and generic stylesheets. For FirstLegoLeague purposes, this submodule is updated every year. in any case, you can provide your own styling and imagery. Basic css is defined in the modules, but you can create your own to override or amend it.

Modules
------------

This bits list the available configuration options for the modules (that you can use in `config.js`). Also, it lists the available javascript functions you can call. Use the following code in the console (behind `F12`):

    displaySystem.modules.<module>.<function>()

For example:

    displaySystem.modules.time.show()

### camera

Shows attached camera stream as the background

Configuration options:

- `visible`: initial visibility

Exposed api:

- `show`: show the video
- `hide`: hide the video

### clock

A simple countdown clock. This is the same clock as available on <https://github.com/FirstLegoLeague/clock>

Configuration options:

- `visible`: initial visibility
- `countdown`: initial time in seconds

Exposed api:

- `show`: show the clock
- `hide`: hide the clock
- `arm`: arm the clock. By default it arms to 2:30 minutes. You can arm to a different time by passing in seconds. Hence `arm(10)` arms the clock to 10 seconds
- `start`: starts the clock
- `stop`: stops the clock

### time

Shows the current system time. Or some other time if you wish

Configuration options:

- `visible`: initial visibility

Exposed api:

- `show`: show the time
- `hide`: hide the time
- `set`: sets the time (and ticks along). Pass in a unix timestamp. Eg `set('2015-02-07T13:00')` or `set(1423314000000)`

### lowThird

Configuration options:

- `visible`: initial visibility
- `line1`: initial first line
- `line2`: initial second line

Exposed api:

- `show`: show the bar (and hides after 5 seconds)
- `hide`: hide the bar
- `persist`: shows the bar and never hides, until `hide()` is called
- `toggle`: toggles the visibility of the bar
- `set`: sets the text of the bar, you can pass in two strings: `set('hello','world')`

### twitter

Configuration options:

- `visible`: initial visibility

Exposed api:

- `show`: show the twitter bar
- `hide`: hide the twitter bar

### css

To include custom styling, create a custom stylesheet to override a default style. Use this for instance to customize fonts, text sizes, colors or background images. You can host it somewhere yourself or serve it up with `static`, as described above.

Configuration options:

- `href`: url to a stylesheet, can be local, or hosted somewhere

Exposed api:

- `set`: set the stylesheet, passing in the `href` parameter


Extensibility
-------------

You can write your own modules. The displaySystem API provides the following methods:

- config(configuration)
- registerModule(definition)

The registerModule method expects a definition object with the following keys:

- `name`: Name to register the module under. If omitted, the module is not registered and cannot be accessed programatically
- `template`: HTML to insert in the page. This should be a JS string.
- `style`: CSS to insert in the page. This should be a JS string. Note that the CSS is inserted at the front of the head. So any custom CSS in the head will override module defaults.
- `factory`: JS to execute when the module is loaded. If the factory returns something, it is registered under the module's name and can be accessed via `displaySystem.modules.<name>`. The factory receives the configuration defined in `config.js`.

For string input, you can use [multiline](https://github.com/sindresorhus/multiline) which is included for convenience

