cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/com.ionic.keyboard/www/keyboard.js",
        "id": "com.ionic.keyboard.keyboard",
        "clobbers": [
            "cordova.plugins.Keyboard"
        ]
    },
    {
        "file": "plugins/com.phonegap.plugins.sqlite/www/SQLitePlugin.js",
        "id": "com.phonegap.plugins.sqlite.SQLitePlugin",
        "clobbers": [
            "SQLitePlugin"
        ]
    },
    {
        "file": "plugins/org.apache.cordova.device/www/device.js",
        "id": "org.apache.cordova.device.device",
        "clobbers": [
            "device"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "com.ionic.keyboard": "0.0.1",
    "com.phonegap.plugins.sqlite": "1.0.0",
    "org.apache.cordova.console": "0.2.9",
    "org.apache.cordova.device": "0.2.10"
}
// BOTTOM OF METADATA
});