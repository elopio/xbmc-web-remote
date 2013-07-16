/**
 * Settings Javascript
 * @author: Karthik VJ
 **/

if(ENABLE_CONSOLE == false)
{
    var console = console || {};
    console.log = function() {};
}

var Settings = function()
{
    var thisObject = this;

    this.hostName;
    this.port;
    var popout = 0;

    this.init = function()
    {
        var loc = window.location.toString();
        console.log("loc, " + loc);
        popout = Utils.findPropertyFromString(loc, "popout");
        if(popout == undefined)
        {
            popout = 0;
        }

        $("#" + SettingsElementID.BACK_BUTTON).click(function(event)
        {
            window.location.href = "remote.html?popout=" + popout + "&removecheck=1";
            event.preventDefault();
        });

        $("#" + SettingsElementID.SAVE_BUTTON).click(function(event)
        {
            thisObject.hostname = thisObject.getIPValue();
            thisObject.port = thisObject.getPortValue();
            if(thisObject.port == "")
            {
                thisObject.port = PORT_DEFAULT;
            }

            if(thisObject.hostname == "" || thisObject.port == "")
            {
                console.log("enter details");
                messages.showMissingData();
                return;
            }

            messages.showWaitMessage();
            //localData.storeData(thisObject.hostname, thisObject.port);
            socket.connect(thisObject.hostname, thisObject.port, thisObject);
            event.preventDefault();
        });

        localData.getHostName(thisObject.setIPValue);
        localData.getPort(thisObject.setPortValue);


    };

    this.localDataChanged = function(host, port)
    {
        console.log("local data changed, " + host + ", " + port);

        thisObject.setIPValue(host);
        thisObject.setPortValue(port);
    };

    this.getIPValue = function()
    {
        var value = document.getElementById(SettingsElementID.IP_TEXTFIELD).value;
        return value;
    };

    this.setIPValue = function(value)
    {
        if(value == undefined)
            return;

        var host = document.getElementById(SettingsElementID.IP_TEXTFIELD);
        host.value = value;
    };

    this.getPortValue = function()
    {
        var value = document.getElementById(SettingsElementID.PORT_TEXTFIELD).value;
        return value;
    };

    this.setPortValue = function(value)
    {
        if(value == undefined || value == "")
            return;

        var port = document.getElementById(SettingsElementID.PORT_TEXTFIELD);
        port.value = value;
    };

    this.onConnect = function()
    {
        messages.showConnectionSuccess();

        // store to local data
        localData.storeData(thisObject.hostname, thisObject.port);

    };

    this.onMessage = function(data)
    {
        console.log("settings, onMessage " + data);
    };

    this.onClose = function()
    {
        messages.showConnectionFail();
    };
};

var Messages = function()
{
    var thisObject = this;

    this.showConnectionSuccess = function()
    {
        thisObject.hideAll();
        var msg = document.getElementById(SettingsElementID.MESSAGE_SUCCESS);
        msg.style.display = "block";
    };

    this.showMissingData = function()
    {
        thisObject.hideAll();
        var msg = document.getElementById(SettingsElementID.MISSING_DATA);
        msg.style.display = "block";
    };

    this.showConnectionFail = function()
    {
        thisObject.hideAll();
        var msg = document.getElementById(SettingsElementID.MESSAGE_FAIL);
        var portMsg = document.getElementById(SettingsElementID.MESSAGE_PORT_ERROR);
        var portValue = settings.getPortValue();

        portMsg.style.display = "none";

        if(portValue == "80" || portValue == "8080")
        {
            var portMessageText = PORT_ERROR_MESSAGE;
            portMessageText = portMessageText.replace("$port", settings.getPortValue());

            portMsg.innerHTML = portMessageText;
            portMsg.style.display = "block";
        }


        msg.style.display = "block";
    };

    this.showWaitMessage = function()
    {
        thisObject.hideAll();
        var msg = document.getElementById(SettingsElementID.MESSAGE_WAIT);
        msg.style.display = "block";

    };


    this.hideAll = function()
    {
        var msg = document.getElementById(SettingsElementID.MESSAGE_SUCCESS);
        msg.style.display = "none";

        msg = document.getElementById(SettingsElementID.MISSING_DATA);
        msg.style.display = "none";

        msg = document.getElementById(SettingsElementID.MESSAGE_FAIL);
        msg.style.display = "none";

        msg = document.getElementById(SettingsElementID.MESSAGE_WAIT);
        msg.style.display = "none";
    };
};


var settings = new Settings();
var messages = new Messages();
var socket = new XBMCSocket();
var localData = new LocalData(settings);


////////////////

window.addEventListener("load", loadComplete, false);
window.addEventListener("contextmenu", onContextMenu, false);

function onContextMenu(e)
{
    e.preventDefault();     // cancel default menu
}

function loadComplete()
{
    if(settings)
    {
        settings.init();
    }

    if(localData)
    {
        localData.init();
    }

}