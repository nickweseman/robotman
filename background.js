/**
 * Created by Nick on 4/29/2017.
 */

chrome.app.runtime.onLaunched.addListener(

    function() {
        // Center window on screen.
        var screenWidth = screen.availWidth;
        var screenHeight = screen.availHeight;
        var width = 500;
        var height = 300;

        chrome.app.window.create('flappy.html', {
            id: "FlappyBirdID",
            outerBounds: {
                width: width,
                height: height,
                left: Math.round((screenWidth-width)/2),
                top: Math.round((screenHeight-height)/2)
            }
        });
    });