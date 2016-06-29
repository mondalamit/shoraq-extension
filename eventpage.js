var currTemplate = "";

// Register the event for clicking the browser action.
// Sends a message to the iframe sandbox.html, referenced from within eventpage.html
chrome.browserAction.onClicked.addListener(function() {
  var iframe = document.getElementById('theFrame');
  var message = {
    command: 'render',
    context: {thing: 'ShoRaq'}
  };
  iframe.contentWindow.postMessage(message, '*');
});

// Event handler for the event from sandbox.html
// Sandbox -> eventpage.js -> content_script.js
// Sends a message to the content_script.js with the rendered HTML.
window.addEventListener('message', function(event) {
  if (event.data.html) {
    currTemplate = event.data.html;
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      var activeTab = tabs[0];
      chrome.tabs.sendMessage(activeTab.id, {"html": currTemplate});
    });
  }
});

