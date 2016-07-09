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

// due to changes in manifest.json (run_at: document_idle), this will load
// BEFORE "load" event, but after DOM is ready!
// this solves the issue of it not being able to find the video element in some cases.

// Get video ID.

var url = document.URL;
// believe in the regex O.o
var regex = /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#\&\?]*).*/;
var match = url.match(regex);
var yt_id = match[1]; // get the resulting token
console.log(yt_id);

// Get current time.
var video = document.getElementsByTagName('video')[0];
window.setInterval(function() {
  if (video) {
    if (!video.paused) {
      console.log(new Date(video.currentTime * 1000).toISOString().substr(11, 8));
    }
  } else {
    // Something went wrong when getting the video element. Try again.
    video = document.getElementsByTagName('video')[0];
  }
}, 1000);






