var currTemplate = "";
var currentTime = null;
var videoID = null;
// Register the event for clicking the browser action.
// Sends a message to the iframe sandbox.html, referenced from within eventpage.html
chrome.browserAction.onClicked.addListener(function() {
  getProducts().then(function(prods) {
    var path = chrome.extension.getURL('/');
    var iframe = document.getElementById('theFrame');
    var message = {
      command: 'render',
      context: {thing: 'ShoRaq', path: path},
      contextProd: {
        prodCount: prods.length, 
        products: prods, 
        path: path
      }
    };
    iframe.contentWindow.postMessage(message, '*');
    });
});

// Listen for the URL and video time from the content script.
chrome.runtime.onConnect.addListener(function(port) {
  console.assert(port.name == "timeurl");
  port.onMessage.addListener(function(msg) {
    currentTime = msg.time;
    videoID = msg.id;
  });
});

//returns a Promise for a list of products.
function getProducts() {
  return new Promise(function(resolve, reject) {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://localhost:3000/api/products');
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = function() {
      if (xhr.status === 200) {
        resolve(JSON.parse(xhr.responseText));
      }
    };
    xhr.send(JSON.stringify({
      videoID: videoID
    }));
    xhr.onerror = reject;
  });
}

// Event handler for the event from sandbox.html
// Sandbox -> eventpage.js -> content_script.js
// Sends a message to the content_script.js with the rendered HTML.
window.addEventListener('message', function(event) {
    if (event.data.base) {
      currTemplate = event.data.base;
      homeTemplate = event.data.home;
      productsTemplate = event.data.products;
      cartTemplate = event.data.cart;
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        var activeTab = tabs[0];
        chrome.tabs.sendMessage(activeTab.id, {
          "html": currTemplate,
          "home": homeTemplate,
          "products": productsTemplate,
          "cart": cartTemplate
        });
      });
    }
});

