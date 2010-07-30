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
