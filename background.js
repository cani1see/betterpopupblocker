/*
Safari only. Carries out the whitelist/delisting when the browser button is pressed. Also calls up the options page.
*/
function performCommand(event)
{
	if (SAFARI)
	{
		if (event.command === "browserAction") {
			// Find out what the core domain of the URL is first
			var currentURL = event.target.browserWindow.activeTab.url;
			var splitURL = currentURL.toLowerCase().match(/^http[s]?:\/\/[^\.]+\.[^\/]+/i);
			var coreWebsiteAddress = null;
			if (splitURL != null && splitURL.length > 0)
			{
				coreWebsiteAddress = splitURL[0];
			}
			
			currentURL = coreWebsiteAddress;
			
			if (currentURL)
			{		
				if (isAllowed(currentURL))
				{
					revokeUrl(currentURL);
				}	
				else
				{
					permitUrl(currentURL);
				}			
			
				var iconAllowed = safari.extension.baseURI + "IconAllowed.png";
				var iconForbidden = safari.extension.baseURI + "IconForbidden.png";
				
				var itemArray = safari.extension.toolbarItems;
				for (var i = 0; i < itemArray.length; ++i) {
					var item = itemArray[i];

					if (item.browserWindow.activeTab.url && item.identifier === "com.optimalcycling.safari.betterpopupblocker-E6486QF2HJ browserActionButton")
					{
						var oldImage = item.image;
						if (urlsGloballyAllowed || isAllowed(item.browserWindow.activeTab.url))
						{
							if (item.image != iconAllowed)
							{
								item.image = iconAllowed;
								item.browserWindow.activeTab.url = item.browserWindow.activeTab.url;
							}
						}	
						else	// forbidden
						{
							if (item.image != iconForbidden)
							{
								item.image = iconForbidden;
								item.browserWindow.activeTab.url = item.browserWindow.activeTab.url;
							}
						}	
					}			
				}
			}
			
		}
		else if (event.command === "showOptions")
		{
			var optionsURL = safari.extension.baseURI + "options.html";
			// First close any other open BPUB options windows
			for (var i = 0; i < safari.application.browserWindows.length; i++)
			{
				var currWindow = safari.application.browserWindows[i];
				for (var j = 0; j < currWindow.tabs.length; j++)
				{
					if (currWindow.tabs[j].url === optionsURL)
					{
						currWindow.tabs[j].close();
					}	
				}			
			}
			var newTab = safari.application.activeBrowserWindow.openTab();
			newTab.url = optionsURL;
		}
	}
}

/*
Safari only. Function is called by the browser when switching tabs or an even the requires a browser update.
*/
function validateCommand(event)
{
	if (SAFARI)
	{		
		if (event.command === "browserAction") {
			// Don't think we ever need to disable the browser button
			//event.target.disabled = !event.target.browserWindow.activeTab.url;
			var currentURL = event.target.browserWindow.activeTab.url;
		
			if (currentURL)
			{
				var itemArray = safari.extension.toolbarItems;
				
				for (var i = 0; i < itemArray.length; ++i) {
					var item = itemArray[i];
					
					if (item.browserWindow.activeTab === event.target.browserWindow.activeTab 
						&& item.identifier === "com.optimalcycling.safari.betterpopupblocker-E6486QF2HJ browserActionButton")
					{
						if (urlsGloballyAllowed || isAllowed(currentURL))
							item.image = safari.extension.baseURI + "IconAllowed.png";
						else
							item.image = safari.extension.baseURI + "IconForbidden.png";
							
						break;
					}			
				}		
			}
			
		}
	}
}

/*
For Safari only. Used to direct messages for functions like canLoad.
*/
function handleMessage(event)
{
	if (SAFARI)
	{
		switch (event.name) {
			case "canLoad":
				var data = event.message;
				if (data.type === "get settings block start")
				{				
					event.message = generateAllSettings(data.url, event.target.url);
				}
				break;
		}
	}
}

/*
Safari only. Updates the browser button for the tabs having the url of "currentURL".
*/
function updateButtons(currentURL)
{
	if (SAFARI)
	{	
		if (currentURL)
		{
			var itemArray = safari.extension.toolbarItems;
			
			for (var i = 0; i < itemArray.length; ++i) {
				var item = itemArray[i];
				
				if (item.browserWindow.activeTab.url === currentURL 
					&& item.identifier === "com.optimalcycling.safari.betterpopupblocker-E6486QF2HJ browserActionButton")
				{
					if (urlsGloballyAllowed || isAllowed(currentURL))
						item.image = safari.extension.baseURI + "IconAllowed.png";
					else
						item.image = safari.extension.baseURI + "IconForbidden.png";
				}			
			}		
		}
	}
}

/*
Reloads the tabs that match the pattern "urlPattern"
urlPattern: The urlPattern pattern we just whitelisted or removed to be matched with the urlPatterns in the tabs.
	Specifying "***NOTINWHITELIST***" will result in only urls not whitelisted being reloaded.
*/
function refreshTabs(urlPattern)
{
	chrome.windows.getAll({populate: true}, function(windowsArray) {
		for (var i = 0; i < windowsArray.length; i++)
		{
			var currWindow = windowsArray[i];
			for (var j = 0; j < currWindow.tabs.length; j++)
			{
				if (urlPattern === "***NOTINWHITELIST***")
				{
					if (currWindow.tabs[j].url && !isAllowed(currWindow.tabs[j].url))
					{
						//chrome.tabs.update(currWindow.tabs[j].id, {url: currWindow.tabs[j].url});
						
						// Reloading by chrome.tabs.executeScript(...). Works with or without javascript enabled.
						chrome.tabs.executeScript(currWindow.tabs[j].id, {code:"if(window.location.href.indexOf('http') == 0) {window.location.reload();}"});						
					}
				}
				else
				{
					if (currWindow.tabs[j].url && urlPattern && patternMatches(currWindow.tabs[j].url, urlPattern))
					{
						//chrome.tabs.update(currWindow.tabs[j].id, {url: currWindow.tabs[j].url});
						
						// Reloading by chrome.tabs.executeScript(...). Works with or without javascript enabled.
						chrome.tabs.executeScript(currWindow.tabs[j].id, {code:"if(window.location.href.indexOf('http') == 0) {window.location.reload();}"});								
					}
				}
			}		
		}
	});
}

/*
Generates a json object with all the applicable settings for a website of "url".
*/
function generateAllSettings(url, topWindowUrl)
{
	var theSettings = {enabled: (isAllowed(url) || urlsGloballyAllowed), 
		blockWindowOpen: config.get('blockWindowOpen'),  
		closeAllPopUpWindows: config.get('closeAllPopUpWindows'), 
		
		blockWindowPrompts: config.get('blockWindowPrompts'), 
		blockJSContextMenuAndClickIntercept: config.get('blockJSContextMenuAndClickIntercept'),
		blockWindowMovingAndResize: config.get('blockWindowMovingAndResize'), 
		blockUnescapeEval: config.get('blockUnescapeEval'), 
		blockJSSelection: config.get('blockJSSelection'), 
		blockJSTimers: config.get('blockJSTimers'), 
		blockJSPrint: config.get('blockJSPrint'), 
		blockOnUnload: config.get('blockOnUnload'),
		blockWindowTargets: config.get('blockWindowTargets'),
		
		extendedTooltips: config.get('extendedTooltips'),
		stripJSFromLinkLocations: config.get('stripJSFromLinkLocations'),
		
		blockCreateEvents: config.get('blockCreateEvents')};
		
		// We use the more restrictive of the two policies for iframes compared to the top window
		if (url !== topWindowUrl)
		{
			if (!urlsGloballyAllowed && theSettings.enabled && !isAllowed(topWindowUrl))
			{
				theSettings.enabled = false;
			}
		}

	return theSettings;
}

/*
Listens for requests from the content scripts on both the Google Chrome and the Apple Safari extensions.
*/
chrome.extension.onRequest.addListener(function(msg, src, send) {
	if (msg.type === "get settings block start" || msg.type === "get settings block idle")
	{	
		var theSettings = generateAllSettings(msg.url, src.tab.url);
		send(theSettings);
	}
	else if (msg.type === "safari validate")
	{
		updateButtons(msg.url);
		send({});
	}
	else
	{
		send({});
	}
});


