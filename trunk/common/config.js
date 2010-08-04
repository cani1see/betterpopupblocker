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
		'^(http[s]?:\\/\\/[a-z0-9\\._-]+\\.|http[s]?:\\/\\/)youtube\\.[a-z]+($|\\/)', '^(http[s]?:\\/\\/[a-z0-9\\._-]+\\.|http[s]?:\\/\\/)apple\\.[a-z]+($|\\/)'],

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
	
	currVersion: 0,
	
	showPageActionButton: true,
	tempList: ""
});

/*
Used to determine if a url matches a urlPattern.
url: URL to be tested. Must be in lower case.
urlPattern: The pattern to be matched. Must be in lower case.

Returns: Returns true if url starts with urlPattern. If urlPattern starts with a "^", then regular expression matching is used.
*/
function patternMatches(url, urlPattern)
{
	if (RegExp('^\\^', 'i').test(urlPattern))
	{
		return RegExp(urlPattern, 'i').test(url);			
	}
	else
	{
		return (url.indexOf(urlPattern) == 0);
		//return RegExp('^' + urlPattern, 'i').test(url);
	}
}

function isWhitelisted(url) {
	var whitelist = config.get("whitelist");
	var isOnList = false;
	var urlLowerCase = url.toLowerCase();
	for (var i = 0; i < whitelist.length; i++)
	{
		isOnList = patternMatches(urlLowerCase, whitelist[i].toLowerCase());
		
		if (isOnList)
			break;
	}
	return isOnList;
}

function addToWhitelist(url) {
	var whitelist = config.get("whitelist");	
	whitelist.push(url.toLowerCase());
	
	// This is inefficient, we are saving the entire list each time
	config.set("whitelist", whitelist);	
}

function removeFromWhitelist(url) {
	var whitelist = config.get("whitelist");
	var urlLowerCase = url.toLowerCase();
	for (var i = 0; i < whitelist.length; i++)
	{
		isOnList = patternMatches(urlLowerCase, whitelist[i].toLowerCase());
		
		if (isOnList)
		{
			whitelist.splice(i, 1);
			isOnList = false;
		}
	}
	
	// This is inefficient, we are saving the entire list each time
	config.set("whitelist", whitelist);
}

