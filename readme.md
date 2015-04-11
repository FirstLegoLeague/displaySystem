Display Systems
================

This is a general purpose, configurable system for data display. It currently contains 4 modules, which are explained further on.

All modules can be controlled via [websockets](http://en.wikipedia.org/wiki/WebSocket). In particular, we support [mserver](https://github.com/poelstra/mserver), which was made for this purpose and supports a higher level of messaging, routing, relaying and clustering. In any case, ordinary websocket is supported, as long as it delivers messages in the format described in the modules.

Also, all modules can be controlled via a javascript interface, so you can write your own scripts to interface with them. Lastly, we provide a control panel that can be opened in a separate screen to control the modules.

Get it running
-------

### Get is locally

Either:

- If you know what `git` is: clone the repository: `git clone https://github.com/FirstLegoLeague/displaySystem.git` and check out the branch `gh-pages`.
- Otherwise, just download the zip from: <https://github.com/FirstLegoLeague/displaySystem/archive/master.zip> and unpack.
- Also, you can just use it [online](http://firstlegoleague.github.io/displaySystem/), however, you can't really customize anything. It is a nice way to check it out though.

There are a few ways to use this package

### As a simple display in the browser

1. Double click `index.html`. This shows a white screen. Don't worry.
1. Open the console by pressing `F12` and selecting the `console` tab.
1. Type `displaySystem.modules.time.show()` and hit `enter`.

Ok, some clarification. All modules are hidden by default. Also, all modules are accessible to javascript, which makes it possible to control them. In step 3, you just executed some javascript to show the time. Let's do this some more:

- `displaySystem.modules.time.hide()`
- `displaySystem.modules.clock.show()`
- `displaySystem.modules.click.start()`

You probably do not want to do this every time you load the display. So, open `config.js` and replace

    'clock': {},

by

    'clock': {
        visible: true
    },

And reload the page. Voilà, the clock is visible by default. You can also do this with other modules.

### Using the control window

Since the display can be controlled by javascript, you could create a control window with buttons and such to control everything. You may set this up with two monitors, one facing the audience and one facing you. This way, you can control the screen without having buttons visible.

However, we have already done this for you, but there is a catch. The control window does not work when you are using the display system directly from the file system (if this is the case, the address bar starts with `file:///`). There are a few ways to solve this:

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

The control window shows buttons for all commands that the modules have. Try and use this to display the time or the clock (for instance in the [online version](http://firstlegoleague.github.io/displaySystem/)).

Configuration
--------------

All basic configuration is done in the config.js file. The configuration options are:

- `wsHost`: Websocket host to connect to, if any
- `mserverNode`: Node to subscribe to when using [mserver](https://github.com/poelstra/mserver), can be omitted otherwise
- `background`: Background color of the application. Can be used for chromakeying. If omitted, the background color is not defined, which can mean transparent in for instance a [casparCG HTML producer](http://www.casparcg.com/)
- `modules`: Array of modules to load. These should correspond to names of js files in the modules folder
- `modulePath`: Path to load the modules from, defaults to `modules`. Can even be an url to another domain, since everything is loaded as a normal JavaScript file.

Styling
-----------

This repository provides basic styling, a git submodule, `graphicsPack` is included and provides images and generic stylesheets. For FirstLegoLeague purposes, this submodule is updated every year. in any case, you can provide your own styling and imagery. Basic css is defined in the modules, but you can create your own to override or amend it.

Modules
------------

Extensibility
-------------

You can write your own modules. The displaySystem API provides the following methods:

- config(configuration)
- registerModule(definition)

The registerModule method expects a definition object with the following keys:

- `name`: Name to register the module under. If omitted, the module is not registered and cannot be accessed programatically
- `template`: HTML to insert in the page. This should be a JS string.
- `style`: CSS to insert in the page. This should be a JS string. Note that the CSS is inserted at the front of the head. So any custom CSS in the head will override module defaults.
- `factory`: JS to execute when the module is loaded. If the factory returns something, it is registered under the module's name and can be accessed via `displaySystem.modules.<name>`

For string input, you can use [multiline](https://github.com/sindresorhus/multiline) which is included for convenience

