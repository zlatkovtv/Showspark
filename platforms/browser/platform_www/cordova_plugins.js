cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/cordova-plugin-statusbar/www/statusbar.js",
        "id": "cordova-plugin-statusbar.statusbar",
        "pluginId": "cordova-plugin-statusbar",
        "clobbers": [
            "window.StatusBar"
        ]
    },
    {
        "file": "plugins/cordova-plugin-statusbar/src/browser/StatusBarProxy.js",
        "id": "cordova-plugin-statusbar.StatusBarProxy",
        "pluginId": "cordova-plugin-statusbar",
        "runs": true
    },
    {
        "file": "plugins/cordova-plugin-inappbrowser/www/inappbrowser.js",
        "id": "cordova-plugin-inappbrowser.inappbrowser",
        "pluginId": "cordova-plugin-inappbrowser",
        "clobbers": [
            "cordova.InAppBrowser.open",
            "window.open"
        ]
    },
    {
        "file": "plugins/cordova-plugin-inappbrowser/src/browser/InAppBrowserProxy.js",
        "id": "cordova-plugin-inappbrowser.InAppBrowserProxy",
        "pluginId": "cordova-plugin-inappbrowser",
        "runs": true
    },
    {
        "file": "plugins/cordova-universal-links-plugin/www/universal_links.js",
        "id": "cordova-universal-links-plugin.universalLinks",
        "pluginId": "cordova-universal-links-plugin",
        "clobbers": [
            "universalLinks"
        ]
    },
    {
        "file": "plugins/cordova-plugin-browsertab/www/browsertab.js",
        "id": "cordova-plugin-browsertab.BrowserTab",
        "pluginId": "cordova-plugin-browsertab",
        "clobbers": [
            "cordova.plugins.browsertab"
        ]
    },
    {
        "file": "plugins/cordova-plugin-buildinfo/www/buildinfo.js",
        "id": "cordova-plugin-buildinfo.BuildInfo",
        "pluginId": "cordova-plugin-buildinfo",
        "clobbers": [
            "BuildInfo"
        ]
    },
    {
        "file": "plugins/cordova-plugin-googleplus/www/GooglePlus.js",
        "id": "cordova-plugin-googleplus.GooglePlus",
        "pluginId": "cordova-plugin-googleplus",
        "clobbers": [
            "window.plugins.googleplus"
        ]
    },
    {
        "file": "plugins/cordova-plugin-device/www/device.js",
        "id": "cordova-plugin-device.device",
        "pluginId": "cordova-plugin-device",
        "clobbers": [
            "device"
        ]
    },
    {
        "file": "plugins/cordova-plugin-device/src/browser/DeviceProxy.js",
        "id": "cordova-plugin-device.DeviceProxy",
        "pluginId": "cordova-plugin-device",
        "runs": true
    },
    {
        "file": "plugins/net.ekuwang.cordova.plugin.statusbar/www/statusbar.js",
        "id": "net.ekuwang.cordova.plugin.statusbar.statusbar",
        "pluginId": "net.ekuwang.cordova.plugin.statusbar",
        "clobbers": [
            "window.statusbarTransparent"
        ]
    },
    {
        "file": "plugins/cordova-plugin-splashscreen/www/splashscreen.js",
        "id": "cordova-plugin-splashscreen.SplashScreen",
        "pluginId": "cordova-plugin-splashscreen",
        "clobbers": [
            "navigator.splashscreen"
        ]
    },
    {
        "file": "plugins/cordova-plugin-splashscreen/src/browser/SplashScreenProxy.js",
        "id": "cordova-plugin-splashscreen.SplashScreenProxy",
        "pluginId": "cordova-plugin-splashscreen",
        "runs": true
    },
    {
        "file": "plugins/cordova-plugin-spinner/www/spinner-plugin.js",
        "id": "cordova-plugin-spinner.SpinnerPlugin",
        "pluginId": "cordova-plugin-spinner",
        "clobbers": [
            "SpinnerPlugin"
        ]
    },
    {
        "file": "plugins/com.bunkerpalace.cordova.YoutubeVideoPlayer/plugins/com.bunkerpalace.cordova.YoutubeVideoPlayer/www/YoutubeVideoPlayer.js",
        "id": "com.bunkerpalace.cordova.YoutubeVideoPlayer.YoutubeVideoPlayer",
        "pluginId": "com.bunkerpalace.cordova.YoutubeVideoPlayer",
        "clobbers": [
            "YoutubeVideoPlayer"
        ]
    },
    {
        "file": "plugins/cordova-plugin-x-socialsharing/www/SocialSharing.js",
        "id": "cordova-plugin-x-socialsharing.SocialSharing",
        "pluginId": "cordova-plugin-x-socialsharing",
        "clobbers": [
            "window.plugins.socialsharing"
        ]
    },
    {
        "file": "plugins/es6-promise-plugin/www/promise.js",
        "id": "es6-promise-plugin.Promise",
        "pluginId": "es6-promise-plugin",
        "runs": true
    },
    {
        "file": "plugins/cordova-plugin-social-message/www/socialmessage.js",
        "id": "cordova-plugin-social-message.SocialMessage",
        "pluginId": "cordova-plugin-social-message",
        "clobbers": [
            "socialmessage"
        ]
    },
    {
        "file": "plugins/ionic-plugin-keyboard/www/browser/keyboard.js",
        "id": "ionic-plugin-keyboard.keyboard",
        "pluginId": "ionic-plugin-keyboard",
        "clobbers": [
            "cordova.plugins.Keyboard"
        ],
        "runs": true
    },
    {
        "file": "plugins/fr._46cl.focus/www/focus.js",
        "id": "fr._46cl.focus.focus",
        "pluginId": "fr._46cl.focus",
        "clobbers": [
            "cordova.plugins.Focus"
        ]
    },
    {
        "file": "plugins/cordova-plugin-screen-orientation/www/screenorientation.js",
        "id": "cordova-plugin-screen-orientation.screenorientation",
        "pluginId": "cordova-plugin-screen-orientation",
        "clobbers": [
            "cordova.plugins.screenorientation"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "cordova-plugin-console": "1.0.7",
    "cordova-plugin-statusbar": "2.2.4-dev",
    "cordova-plugin-whitelist": "1.2.2",
    "cordova-plugin-inappbrowser": "1.7.1",
    "cordova-universal-links-plugin": "1.2.1",
    "cordova-plugin-compat": "1.0.0",
    "cordova-plugin-browsertab": "0.2.0",
    "cordova-plugin-buildinfo": "1.1.0",
    "cordova-plugin-googleplus": "5.1.1",
    "cordova-plugin-device": "1.1.6",
    "net.ekuwang.cordova.plugin.statusbar": "1.0.0",
    "cordova-plugin-splashscreen": "4.0.3",
    "cordova-plugin-customurlscheme": "4.3.0",
    "cordova-plugin-spinner": "1.1.0",
    "com.bunkerpalace.cordova.YoutubeVideoPlayer": "1.0.5",
    "cordova-plugin-crosswalk-webview": "2.3.0",
    "cordova-plugin-x-socialsharing": "5.1.8",
    "es6-promise-plugin": "4.1.0",
    "cordova-plugin-social-message": "0.4.0",
    "ionic-plugin-keyboard": "2.2.1",
    "fr._46cl.focus": "0.1.3",
    "cordova-plugin-screen-orientation": "2.0.1"
}
// BOTTOM OF METADATA
});