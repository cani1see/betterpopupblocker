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
		try {
			localStorage[key] = JSON.stringify(value);
		} catch (e) {
			if (e == QUOTA_EXCEEDED_ERR) {
				alert('Storage quota exceeded for Better Pop Up Blocker.');
			}
		}
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
	
	blacklist: [],
	
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
	
	extendedTooltips: false,
	stripJSFromLinkLocations: true,
	
	blockCreateEvents: false,
	
	currVersion: 200000000,
	currDisplayVersion: "2.0.0",
	
	showPageActionButton: true,
	tempList: "",	// not currently used
	
	useBlacklistMode: false
});


var whitelist = config.get('whitelist');
var blacklist = config.get('blacklist');
var urlsGloballyAllowed = config.get('globalAllowAll');
var useBlacklistMode = config.get('useBlacklistMode');

function handleStorageChange(event)
{
	if (event.key === "whitelist")
	{
		whitelist = config.get('whitelist');
	}
	else if (event.key === "blacklist")
	{
		blacklist = config.get('blacklist');
	}
	else if (event.key === "globalAllowAll")
	{
		urlsGloballyAllowed = config.get('globalAllowAll');
	}
	else if (event.key === "useBlacklistMode")
	{
		useBlacklistMode = config.get('useBlacklistMode');
	}		
}

window.addEventListener("storage", handleStorageChange, false);

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
		return (url.toLowerCase().indexOf(urlPattern.toLowerCase()) == 0);
	}
}

function isAllowed(url)
{
	if (useBlacklistMode)
	{
		return !isBlacklisted(url);
	}
	else
	{
		return isWhitelisted(url);
	}
}

function revokeUrl(url)
{
	if (useBlacklistMode)
	{
		addToBlacklist(url);
	}
	else
	{
		removeFromWhitelist(url)
	}
}

function permitUrl(url)
{
	if (useBlacklistMode)
	{
		removeFromBlacklist(url);
	}
	else
	{
		addToWhitelist(url);
	}
}

function islisted(list, listName, url) {
	var isOnList = false;
	for (var i = 0; i < list.length; i++)
	{
		isOnList = patternMatches(url, list[i]);
		
		if (isOnList)
			break;
	}
	return isOnList;
}

function addToList(list, listName, url) {	
	list.push(url.toLowerCase());
	
	// This is inefficient, we are saving the entire list each time
	config.set(listName, list);	
}

function removeFromList(list, listName, url) {
	var isOnList = false;
	for (var i = 0; i < list.length; i++)
	{
		isOnList = patternMatches(url, list[i]);
		
		if (isOnList)
			list.splice(i, 1);
	}
	
	// This is inefficient, we are saving the entire list each time
	config.set(listName, list);
}

function isWhitelisted(url) {
	return islisted(whitelist, "whitelist", url);	
}

function addToWhitelist(url) {	
	addToList(whitelist, "whitelist", url);
}

function removeFromWhitelist(url) {
	removeFromList(whitelist, "whitelist", url);
}

function isBlacklisted(url) {
	return islisted(blacklist, "blacklist", url);
}

function addToBlacklist(url) {	
	addToList(blacklist, "blacklist", url);
}

function removeFromBlacklist(url) {
	removeFromList(blacklist, "blacklist", url);
}

/*
Example for http://www.google.com/something.html, this returns http://www.google.com. Returns null if no match is found.
*/
function getMainURL(currURL)
{
	var splitURL = currURL.match(/^http[s]?:\/\/[^\.]+\.[^\/]+/i);
	if (splitURL && splitURL.length > 0)
		return splitURL[0];
	else
		return null;	
}

String.prototype.chunk = function(n) {
	if (typeof n=='undefined') n=2;
	return this.match(RegExp('.{1,'+n+'}','g'));
};