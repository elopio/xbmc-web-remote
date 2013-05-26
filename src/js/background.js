/**
 * @author: Karthik VJ
 **/

var windowID = -1;
var isPopupOpen = false;

function handelPopup() {

    //console.log("popup");
    // linux
    //var defaultRes = {width: 340, height: 540};
    //var winRes = {width: 350, height: 600};

    var selectedRes = {width: 340, height: 540};

    if(navigator.platform === "Win32") {
        selectedRes = winRes;
    }

    var obj = { url: "remote.html?popout=1", focused: true, type: "popup", width: selectedRes.width, height: selectedRes.height };

    if(windowID === -1) {
       openPopup(obj);
    }
    else {
       switchWindow();
    }

}

function openPopup(obj) {

    chrome.windows.create(obj, function(response) {
        //console.log("response, " + JSON.stringify(response));
        windowID = response.id;
        //console.log(response);
        isPopupOpen = true;

        // remove popup from browser action
        var data = {};
        data.popup = ""; // empty string to remove remove popup
        chrome.browserAction.setPopup(data);

    });
}
function switchWindow() {

    chrome.windows.update(windowID, {focused: true}, function(){
        //console.log("switch done");
        isPopupOpen = true;
    });
}

function onWindowClose(id) {

    if(id === windowID) {
        windowID = -1;
        isPopupOpen = false;

        var data = {};
        data.popup = "remote.html";
        chrome.browserAction.setPopup(data);
    }
}

function onActionIconClicked(tab) {

    if(isPopupOpen === true) {
        switchWindow();
    }
}

chrome.windows.onRemoved.addListener(onWindowClose);
chrome.browserAction.onClicked.addListener(onActionIconClicked);
