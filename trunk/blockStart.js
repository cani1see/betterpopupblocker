/* 
    Better Pop Up Blocker
    Copyright (C) 2010  Eric Wong	
	contact@optimalcycling.com
	http://www.optimalcycling.com

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

// Save the function pointers to the javascript functions we are going to manipulate.
// Then, set them to null. This is done at the very beginning because below, sendRequest is asynchronous
// and will let other javascript code execute while it's waiting. 
// We also remove the javascript we inject into the page using a special trick so that others cannot parse the page 
// and see our variable names in the global space that can be used to try to bypass our blocker.
// I hope Google Chrome will implement the canLoad synchronous function that Apple Safari has so that I don't need to use the global space.
var currURL = window.location.href;
var obfusChars = "BPUB" + randomID(20);
	
var obfusPartsID = "ID_Block_First";
var obfusParts = [
	obfusChars, "windowOpen=window.open;window.open=null;",
	obfusChars, "windowShowModelessDialog=window.showModelessDialog;window.showModelessDialog=null;",
	obfusChars, "windowShowModalDialog=window.showModalDialog;window.showModalDialog=null;",
	
	obfusChars, "windowPrompt=window.prompt;window.prompt=null;", 
	obfusChars, "windowConfirm=window.confirm;window.confirm=null;", 
	obfusChars, "windowAlert=window.alert;window.alert=null;",
	
	obfusChars, "windowMoveTo=window.moveTo;window.moveTo=null;",	
	obfusChars, "windowMoveBy=window.moveBy;window.moveBy=null;",
	obfusChars, "windowResizeTo=window.resizeTo;window.resizeTo=null;",
	obfusChars, "windowResizeBy=window.resizeBy;window.resizeBy=null;",
	obfusChars, "windowScrollBy=window.scrollBy;window.scrollBy=null;",
	obfusChars, "windowScrollTo=window.scrollTo;window.scrollTo=null;",
	obfusChars, "windowBlur=window.blur;window.blur=null;",
	obfusChars, "windowFocus=window.focus;window.focus=null;",
	
	obfusChars, "documentGetSelction=document.getSelection;document.getSelection=null;",
	obfusChars, "windowGetSelection=window.getSelection;window.getSelection=null;",
	
	obfusChars, "windowOnUnLoad=window.onunload;window.onunload=null;",
	
	obfusChars, "windowPrint=window.print;window.print=null;",
	
	obfusChars, "documentCreateEvent=document.createEvent;document.createEvent=null;"
];
	
injectGlobalWithId(obfusParts.join(""), obfusChars + obfusPartsID);
chrome.extension.sendRequest({url: currURL}, coreLogic);

function coreLogic(settings) {
	if (!settings.enabled && settings.blockWindowOpen)
	{
		//blockWindowOpen();
	}
	else
	{ 
		var deblockID = "ID_Unblock_WindowOpen";
		var deblockParts = [
			"window.open=", obfusChars, "windowOpen;",
			"window.showModelessDialog=", obfusChars, "windowShowModelessDialog;",
			"window.showModalDialog=", obfusChars, "windowShowModalDialog;"
		];
		injectGlobalWithId(deblockParts.join(""), obfusChars + deblockID);		
	}
		
	if (!settings.enabled && settings.blockWindowPrompts)
	{
		//blockWindowPrompts();
	}
	else
	{  
		var deblockID = "ID_Unblock_WindowPrompts";
		var deblockParts = [
			"window.prompt=", obfusChars, "windowPrompt;",
			"window.confirm=", obfusChars, "windowConfirm;",
			"window.alert=", obfusChars, "windowAlert;"
		];
		injectGlobalWithId(deblockParts.join(""), obfusChars + deblockID);	
	}

	if (!settings.enabled && settings.blockWindowMovingAndResize)
	{
		//blockWindowMovingAndResize();
	}
	else
	{
		var deblockID = "ID_Unblock_WindowMovingAndResize";
		var deblockParts = [
			"window.moveTo=", obfusChars, "windowMoveTo;",
			"window.moveBy=", obfusChars, "windowMoveBy;",
			"window.resizeTo=", obfusChars, "windowResizeTo;",
			"window.resizeBy=", obfusChars, "windowResizeBy;",
			"window.scrollBy=", obfusChars, "windowScrollBy;",
			"window.scrollTo=", obfusChars, "windowScrollTo;",
			"window.blur=", obfusChars, "windowBlur;",
			"window.focus=", obfusChars, "windowFocus;"
		];
		injectGlobalWithId(deblockParts.join(""), obfusChars + deblockID);	
	}
	
	if (!settings.enabled && settings.blockJSSelection)
	{
		//blockJSSelection();
	}
	else
	{
		var deblockID = "ID_Unblock_JSSelection";
		var deblockParts = [
			"document.getSelection=", obfusChars, "documentGetSelection;",
			"window.getSelection=", obfusChars, "windowGetSelection;"
		];
		injectGlobalWithId(deblockParts.join(""), obfusChars + deblockID);
	}	
	
	if (!settings.enabled && settings.blockOnUnload)
	{
		//blockOnUnload();
	}
	else
	{
		var deblockID = "ID_Unblock_OnUnload";
		var deblockParts = [
			"window.onunload=", obfusChars, "windowOnUnLoad;"
		];
		injectGlobalWithId(deblockParts.join(""), obfusChars + deblockID);
	}	
	
	if (!settings.enabled && settings.blockJSPrint)
	{
		//blockJSPrint();
	}
	else
	{
		var deblockID = "ID_Unblock_JSPrint";
		var deblockParts = [
			"window.print=", obfusChars, "windowPrint;"
		];
		injectGlobalWithId(deblockParts.join(""), obfusChars + deblockID);
	}	
	
	if (!settings.enabled && settings.blockCreateEvents)
	{
		//blockCreateEvents();
	}
	else
	{
		var deblockID = "ID_Unblock_JSPrint";
		var deblockParts = [
			"document.createEvent=", obfusChars, "documentCreateEvent;"
		];
		injectGlobalWithId(deblockParts.join(""), obfusChars + deblockID);
	}	
	
	// These functions are not blocked at the very beginning because some websites use them on load or
	// while we wait for sendMessage. Done to maintain best compatibility.
	if (!settings.enabled)
	{
		if (settings.blockUnescapeEval)
			blockUnescapeEval();
		if (settings.blockJSTimers)
			blockJSTimers();
	}
			
}	

function inject(f) {
    var script = document.createElement("script");
    script.textContent = "(" + f + ")();";
    document.documentElement.appendChild(script);
}

function injectGlobal(f) {
    var script = document.createElement("script");
    script.textContent = f;
    document.documentElement.appendChild(script);
}

function injectGlobalWithId(f, id) {
    var script = document.createElement("script");
	script.id = id;
    script.textContent = f;
    document.documentElement.appendChild(script);
}

function blockWindowOpen() {
    inject(function() {
		window.open = null;					
    });
}

function blockWindowPrompts() {
    inject(function() {
		window.prompt = null;
		window.confirm = null;
		window.alert = null;		
    });
}

function blockWindowMovingAndResize() {
    inject(function() {
	    window.moveTo = null;
        window.moveBy = null;
        window.resizeTo = null;
        window.resizeBy = null;
		window.scrollBy = null;
		window.scrollTo = null;	
		window.blur = null;
		window.focus = null;		
    });
}

function blockJSSelection() {
    inject(function() {
		document.getSelection = null;
		window.getSelection = null;					
    });
}

function blockJSTimers() {
    inject(function() {
		window.setTimeout = null;
		window.setInterval = null;					
    });
}
	
function blockJSPrint() {
    inject(function() {		
		window.print = null;					
    });
}

function blockOnUnload() {
    inject(function() {		
		window.onunload = null;					
    });
}

function blockUnescapeEval() {
    inject(function() {		
		unescape = null;
		eval = null;					
    });
}
		
function blockCreateEvents() {
    inject(function() {
		document.createEvent = null;			
    });	
}

function blockCSSGetComputedStyle() {
    inject(function() {
		window.getComputedStyle = null;					
    });
}
	
// length should be >= 10 for good randomness and to avoid collisions
function randomID(length)
{
   const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_1234567890";	// total 63 characters
   generated = "";
   i = Math.floor(Math.random() * 53);
   generated += chars.charAt(i); 

   for(x=0;x<length;x++)
   {
      i = Math.floor(Math.random() * 63);
      generated += chars.charAt(i);
   }

   return generated;
}




/* Below is the hard coded and more reliable way of nulling javascript functions because it doesn't use 
sendRequest, which is asynchronous and allows some javascript to run before blocking.
It works more reliably but with the major disadvantage that you can't turn it off or have options.
The code below is for comments and reference. Or if you are a coder, you can make your own hard coded blocker.
function blockUndesirables() {
    inject(function() {
		// Blocks javascript pop up windows
		window.open = null;	
		
		// Blocks modal prompts
		window.prompt = null;
		window.confirm = null;
		window.alert = null;	

		// Blocks javascript from bringing windows to front or pushing them back
		window.blur = null;
		window.focus = null;
		
		// Blocks auto movement and resizing of windows
	    window.moveTo = null;
        window.moveBy = null;
        window.resizeTo = null;
        window.resizeBy = null;
		window.scrollBy = null;
		window.scrollTo = null;		
		
		// Blocks javascript from making the current tab go back or forth
		window.history = null;
		
		// Blocks one of the history leak exploits
		window.getComputedStyle = null;

		// Blocks javascript from seeing what you select
		document.getSelection = null;
		window.getSelection = null;

		// Blocks javascript timers
		//window.setTimeout = null;
		//window.setInterval = null;

		// Blocks javascript from doing something when you leave a page
		window.onunload = null;	

		// Blocks the unescape and eval functions frequently used by exploits
		unescape = null;
		eval = null;

		// Blocks javascript from simulating text input and mouse clicks, amongst other things
		document.createEvent = null;

		// Blocks javascript from setting the current window url. However, many sites use this.
		//window.location = null;
		
		// Blocks javascript writes into a page. Recommended to use appendChild instead
		//document.write = null;					
		//document.writeln = null;

		window.print = null;
    });
}

blockUndesirables();

*/
