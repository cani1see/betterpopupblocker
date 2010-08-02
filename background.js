function performCommand(event)
{
	if (SAFARI)
	{
		if (event.command === "browserAction") {
			config.set('globalAllowAll', !config.get('globalAllowAll'));
			//alert(config.get('globalAllowAll'));
			
			var currentURL = event.target.browserWindow.activeTab.url;
			
			if (currentURL)
			{
				// Add or remove from whitelist
				
				var itemArray = safari.extension.toolbarItems;
				for (var i = 0; i < itemArray.length; ++i) {
					var item = itemArray[i];
					if (item.identifier === "browserActionButton")
					{
						if (config.get('globalAllowAll') || isWhitelisted(currentURL))
							item.image = safari.extension.baseURI + "IconAllowed.png";
						else
							item.image = safari.extension.baseURI + "IconForbidden.png";
							
						break;
					}			
				}

				event.target.browserWindow.activeTab.url = currentURL;			
			}
			
			/*
			for (var i = 0; i < safari.extension.toolbarItems.length; ++i) {
				var button = safari.extension.toolbarItems[i];

				if (button.browserWindow == tab.browserWindow) {

					var image = wot.geticon(this.getmaskicon(this.geticon(data)),
										16, wot.prefs.get("accessible"))
					button.image = safari.extension.baseURI + image;
				}
			}*/			
		}
	}
}
function validateCommand(event)
{
	if (SAFARI)
	{
		if (event.command === "browserAction") {
			event.target.disabled = !event.target.browserWindow.activeTab.url;
		}
	}
}

chrome.extension.onRequest.addListener(function(msg, src, send) {

	var urlInWhiteList = isWhitelisted(msg.url);
	var urlsGloballyAllowed = config.get('globalAllowAll');    
	
	send({enabled: (urlInWhiteList || urlsGloballyAllowed), 
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
		
		blockCreateEvents: config.get('blockCreateEvents')});			
});
