// This content_script is loaded into any active tab that matches the permissions.
// Look at manifest.json and docs to learn more about permissions if curious (http://*/*, etc)
// Whenever a message is handled, the rendered HTML (msg.html)
// is appended to the DOM. 
chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
	var sidebar = document.querySelector("#shoraq-sidebar");
	if (sidebar !== null) {
		sidebar.remove();
	} else {
		var link = document.createElement("link");
		link.href = chrome.extension.getURL("main.css");
		link.type = "text/css";
		link.rel = "stylesheet";
		document.getElementsByTagName("head")[0].appendChild(link);
		
		var newdiv = document.createElement('div');
		newdiv.setAttribute("id", "shoraq-sidebar");
		newdiv.innerHTML = msg.html;
		var parentElement = document.body;
		var firstChild = document.body.firstChild;
		parentElement.insertBefore(newdiv, firstChild);
	}
});