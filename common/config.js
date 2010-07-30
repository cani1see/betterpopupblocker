var config = {
    has: function(key) {
        return key in localStorage;
    },
    get: function(key) {
        if (this.has(key)) {
            try {
                return JSON.parse(localStorage[key]);
            } catch(e) {
                return localStorage[key];
            }
        }
    },
    set: function(key, value) {
        localStorage[key] = JSON.stringify(value);
    },
    defaults: function(vals) {
        for (var key in vals) {
            if (!this.has(key)) {
                this.set(key, vals[key]);
            }
        };
    }
};

config.defaults({

    whitelist: ['http://www.hulu.com', 'http://hulu.com', '^(http[s]?:\\/\\/[a-z0-9\\._-]+\\.|http[s]?:\\/\\/)google\\.[a-z]+($|\\/)', 
		'^(http[s]?:\\/\\/[a-z0-9\\._-]+\\.|http[s]?:\\/\\/)youtube\\.[a-z]+($|\\/)', 
		'^(http[s]?:\\/\\/[a-z0-9\\._-]+\\.|http[s]?:\\/\\/)pezcyclingnews\\.[a-z]+($|\\/)'],

	/* This is the old whitelist for versions before 1.2 that have incorrectly escaped regular expressions
    whitelist: ['http://www.hulu.com', 'http://hulu.com', '^(http[s]?:\/\/[a-z0-9\._-]+\.|http[s]?:\/\/)google\.[a-z]+($|\/)', 
		'^(http[s]?:\/\/[a-z0-9\._-]+\.|http[s]?:\/\/)youtube\.[a-z]+($|\/)', '^(http[s]?:\/\/[a-z0-9\._-]+\.|http[s]?:\/\/)pezcyclingnews\.[a-z]+($|\/)'],
	*/
	
	globalAllowAll: false,
	
	blockWindowOpen: true,
	closeAllPopUpWindows: false,
	
	blockWindowPrompts: true,
	blockJSContextMenuAndClickIntercept: true,
	
	blockWindowMovingAndResize: true,
	blockUnescapeEval: false,
	blockJSSelection: true,
	blockJSTimers: false,
	blockJSPrint: true,	
	blockOnUnload: true,
	blockWindowTargets: true,
	reloadCurrentTabOnToggle: true,
	
	extendedTooltips: true,
	
	blockCreateEvents: true,
	
	currVersion: 0
});

function isWhitelisted(url) {
	var whitelist = config.get("whitelist");
	var isOnList = false;
	var urlLowerCase = url.toLowerCase();
	for (var i = 0; i < whitelist.length; i++)
	{
		if (RegExp('^\^', 'i').test(whitelist[i]))
		{
			isOnList = RegExp(whitelist[i], 'i').test(url);			
		}
		else
		{
			isOnList = (urlLowerCase.indexOf(whitelist[i].toLowerCase()) == 0);
		}
		
		if (isOnList)
			break;
	}
	return isOnList;
}

