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
		document.head.appendChild(link);
		
		var sidebarContainer = document.createElement('div');
		sidebarContainer.setAttribute("id", "shoraq-sidebar");
		sidebarContainer.innerHTML = msg.html;
		var firstChild = document.body.firstChild;
		document.body.insertBefore(sidebarContainer, firstChild);
	}
});

// due to changes in manifest.json (run_at: document_idle), this will load
// BEFORE "load" event, but after DOM is ready!
// this solves the issue of it not being able to find the video element in some cases.

// Get video ID.

var url = document.URL;
// believe in the regex O.o
var regex = /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#\&\?]*).*/;
var match = url.match(regex);

// Important! //
var yt_id = match[1]; // Youtube video ID
var time = null; // Current time of Youtube video; updating every 1 second.
// Important! //

// Get current time.
var video = document.getElementsByTagName('video')[0];
window.setInterval(function() {
  if (video) {
    if (!video.paused) {
      time = new Date(video.currentTime * 1000).toISOString().substr(11, 8);
    }
  } else {
    // Something went wrong when getting the video element. Try again.
    video = document.getElementsByTagName('video')[0];
  }
}, 1000);



