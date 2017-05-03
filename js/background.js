/**
 * Created by Nick on 4/29/2017.
 */

chrome.app.runtime.onLaunched.addListener(

    function() {
        // Center window on screen.
        var screenWidth = screen.availWidth;
        var screenHeight = screen.availHeight;
        var width = 960;
        var height = 625;

        chrome.app.window.create('robotman.html', {
            id: "RobotmanID",
            outerBounds: {
                minWidth: width,
                minHeight: height,
                left: Math.round((screenWidth - width) / 2),
                top: Math.round((screenHeight - height) / 2)
            },
            resizable: false,
            frame: {
                type: 'chrome',
                color: '#1B609B',
                inactiveColor: '#15E0EF'
            }
        });
    });