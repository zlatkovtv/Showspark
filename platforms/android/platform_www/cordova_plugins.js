cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "id": "com.bunkerpalace.cordova.YoutubeVideoPlayer.YoutubeVideoPlayer",
        "file": "plugins/com.bunkerpalace.cordova.YoutubeVideoPlayer/plugins/com.bunkerpalace.cordova.YoutubeVideoPlayer/www/YoutubeVideoPlayer.js",
        "pluginId": "com.bunkerpalace.cordova.YoutubeVideoPlayer",
        "clobbers": [
            "YoutubeVideoPlayer"
        ]
    },
    {
        "id": "cordova-plugin-browsertab.BrowserTab",
        "file": "plugins/cordova-plugin-browsertab/www/browsertab.js",
        "pluginId": "cordova-plugin-browsertab",
        "clobbers": [
            "cordova.plugins.browsertab"
        ]
    },
    {
        "id": "cordova-plugin-buildinfo.BuildInfo",
        "file": "plugins/cordova-plugin-buildinfo/www/buildinfo.js",
        "pluginId": "cordova-plugin-buildinfo",
        "clobbers": [
            "BuildInfo"
        ]
    },
    {
        "id": "cordova-plugin-customurlscheme.LaunchMyApp",
        "file": "plugins/cordova-plugin-customurlscheme/www/android/LaunchMyApp.js",
        "pluginId": "cordova-plugin-customurlscheme",
        "clobbers": [
            "window.plugins.launchmyapp"
        ]
    },
    {
        "id": "cordova-plugin-device.device",
        "file": "plugins/cordova-plugin-device/www/device.js",
        "pluginId": "cordova-plugin-device",
        "clobbers": [
            "device"
        ]
    },
    {
        "id": "cordova-plugin-googleplus.GooglePlus",
        "file": "plugins/cordova-plugin-googleplus/www/GooglePlus.js",
        "pluginId": "cordova-plugin-googleplus",
        "clobbers": [
            "window.plugins.googleplus"
        ]
    },
    {
        "id": "cordova-plugin-inappbrowser.inappbrowser",
        "file": "plugins/cordova-plugin-inappbrowser/www/inappbrowser.js",
        "pluginId": "cordova-plugin-inappbrowser",
        "clobbers": [
            "cordova.InAppBrowser.open",
            "window.open"
        ]
    },
    {
        "id": "cordova-plugin-spinner.SpinnerPlugin",
        "file": "plugins/cordova-plugin-spinner/www/spinner-plugin.js",
        "pluginId": "cordova-plugin-spinner",
        "clobbers": [
            "SpinnerPlugin"
        ]
    },
    {
        "id": "cordova-plugin-splashscreen.SplashScreen",
        "file": "plugins/cordova-plugin-splashscreen/www/splashscreen.js",
        "pluginId": "cordova-plugin-splashscreen",
        "clobbers": [
            "navigator.splashscreen"
        ]
    },
    {
        "id": "cordova-plugin-statusbar.statusbar",
        "file": "plugins/cordova-plugin-statusbar/www/statusbar.js",
        "pluginId": "cordova-plugin-statusbar",
        "clobbers": [
            "window.StatusBar"
        ]
    },
    {
        "id": "net.ekuwang.cordova.plugin.statusbar.statusbar",
        "file": "plugins/net.ekuwang.cordova.plugin.statusbar/www/statusbar.js",
        "pluginId": "net.ekuwang.cordova.plugin.statusbar",
        "clobbers": [
            "window.statusbarTransparent"
        ]
    },
    {
        "id": "cordova-universal-links-plugin.universalLinks",
        "file": "plugins/cordova-universal-links-plugin/www/universal_links.js",
        "pluginId": "cordova-universal-links-plugin",
        "clobbers": [
            "universalLinks"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "com.bunkerpalace.cordova.YoutubeVideoPlayer": "1.0.5",
    "cordova-plugin-compat": "1.0.0",
    "cordova-plugin-browsertab": "0.2.0",
    "cordova-plugin-buildinfo": "1.1.0",
    "cordova-plugin-console": "1.0.7",
    "cordova-plugin-customurlscheme": "4.3.0",
    "cordova-plugin-device": "1.1.6",
    "cordova-plugin-googleplus": "5.1.1",
    "cordova-plugin-inappbrowser": "1.7.1",
    "cordova-plugin-spinner": "1.1.0",
    "cordova-plugin-splashscreen": "4.0.3",
    "cordova-plugin-statusbar": "2.2.4-dev",
    "net.ekuwang.cordova.plugin.statusbar": "1.0.0",
    "cordova-plugin-whitelist": "1.3.2",
    "cordova-universal-links-plugin": "1.2.1"
};
// BOTTOM OF METADATA
});