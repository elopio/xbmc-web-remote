/**
 * @author: Karthik VJ
 **/

var LocalData = function(context)
{

    var thisObject = this;
    this.context = context;


    /**
     * Check if local storage is supported in browser
     * @return {boolean} true - supported, false - not supported
     */
    this.isSupported = function()
    {
        try {
            return 'localStorage' in window && window['localStorage'] !== null;
        } catch (e) {
            return false;
        }

    };


    /**
     * Store the host and port value to local storage
     * @param host
     * @param port
     */
    this.storeData = function(host, port)
    {
        if(!host || !port)
        {
            console.write("host or port is undefined!");
            return;
        }

        if(thisObject.isSupported())
        {
            localStorage.setItem("host", host);
            localStorage.setItem("port", port);
        }
        else
        {
            alert("local storage not supported in your browser!");
        }
    };

    /**
     * Get host or IP address from localStorage
     * @param callback
     */
    this.getHostName = function(callback)
    {

        var host;
        if(thisObject.isSupported())
        {
            host = localStorage.getItem("host");
            callback(host);
        }
        else
        {
            callback();
        }
    };

    /**
     * Get Port value from localStorgae
     * @param callback
     */
    this.getPort = function(callback)
    {
        var port;
        if(thisObject.isSupported())
        {
            port = localStorage.getItem("port");
            callback(port);
        }
        else
        {
            callback();
        }
    };

    /**
     * Clear local storage data
     */
    this.clear = function()
    {
        if(this.isSupported())
        {
            localStorage.clear();
        }
    };

};