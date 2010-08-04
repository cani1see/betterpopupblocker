String.prototype.trim = function () {
    return this.replace(/^\s*/, "").replace(/\s*$/, "");
}

function $(id) { return document.getElementById(id); }
function lines(s) 
{ 
	var links = (s ? s.split('\n') : []); 
	if (links)
	{
		for (var i = 0; i < links.length; i++)
			links[i] = links[i].trim();
	}
	return links;
}

function init() {
    $('whitelist').value = config.get('whitelist').join('\n');
	
	$('blockWindowOpen').checked = config.get('blockWindowOpen');	
	$('closeAllPopUpWindows').checked = config.get('closeAllPopUpWindows');	
	
	$('blockWindowPrompts').checked = config.get('blockWindowPrompts');	
	$('blockJSContextMenuAndClickIntercept').checked = config.get('blockJSContextMenuAndClickIntercept');
		
	$('blockWindowMovingAndResize').checked = config.get('blockWindowMovingAndResize');	
	$('blockUnescapeEval').checked = config.get('blockUnescapeEval');	
	$('blockJSSelection').checked = config.get('blockJSSelection');	
	$('blockJSTimers').checked = config.get('blockJSTimers');	
	$('blockJSPrint').checked = config.get('blockJSPrint');	
	$('blockOnUnload').checked = config.get('blockOnUnload');	
	$('blockWindowTargets').checked = config.get('blockWindowTargets');	
	$('reloadCurrentTabOnToggle').checked = config.get('reloadCurrentTabOnToggle');	
	
	$('extendedTooltips').checked = config.get('extendedTooltips');	
	$('showPageActionButton').checked = config.get('showPageActionButton');
	
	if (SAFARI)
	{
		$('showPageActionButton').enabled = false;
		$('showPageActionButton').style.visibility = 'hidden';
		$('div_showPageActionButton').style.visibility = 'hidden';
	}	
	
	$('blockCreateEvents').checked = config.get('blockCreateEvents');	
	
	showReadyButtons();
}

function save() {
    config.set('whitelist', lines($('whitelist').value));
	$('whitelist').value = config.get('whitelist').join('\n');
	
	config.set('blockWindowOpen', $('blockWindowOpen').checked);	
	config.set('closeAllPopUpWindows', $('closeAllPopUpWindows').checked);
	
	config.set('blockWindowPrompts', $('blockWindowPrompts').checked);	
	config.set('blockJSContextMenuAndClickIntercept', $('blockJSContextMenuAndClickIntercept').checked);
	
	config.set('blockWindowMovingAndResize', $('blockWindowMovingAndResize').checked);
	config.set('blockUnescapeEval', $('blockUnescapeEval').checked);
	config.set('blockJSSelection', $('blockJSSelection').checked);
	config.set('blockJSTimers', $('blockJSTimers').checked);
	config.set('blockJSPrint', $('blockJSPrint').checked);
	config.set('blockOnUnload', $('blockOnUnload').checked);
	config.set('blockWindowTargets', $('blockWindowTargets').checked);	
	config.set('reloadCurrentTabOnToggle', $('reloadCurrentTabOnToggle').checked);	
	
	config.set('extendedTooltips', $('extendedTooltips').checked);	
	config.set('showPageActionButton', $('showPageActionButton').checked);	
	
	config.set('blockCreateEvents', $('blockCreateEvents').checked);	
	
	showSavedButtons();
}