var currTemplate = '';
var currentTime = null;

// Register the event for clicking the browser action.
// Sends a message to the iframe sandbox.html, referenced from within eventpage.html
// gets Products for a video by scraping the ID from the url contained in the event.
chrome.browserAction.onClicked.addListener(function(event) {
  var url = event.url;
  var regex = /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#\&\?]*).*/;
  var match = url.match(regex);
  var yt_id = match[1];
  if (yt_id) {
    getProducts(yt_id).then(function(prods) {
      var path = chrome.extension.getURL('/');
      var iframe = document.getElementById('theFrame');
      var message = {
        command: 'render',
        context: {
          path: path
        },
        contextProd: {
          prodCount: prods.length,
          products: prods,
          path: path
        }
      };
      iframe.contentWindow.postMessage(message, '*');
    });
  }
});

// Listen for the URL and video time from the content script.
chrome.runtime.onConnect.addListener(function(port) {
  if (port.name == 'time') {
    port.onMessage.addListener(function(msg) {
      currentTime = msg.time;
    });
  }
});

//returns a Promise for a list of products.
function getProducts(id) {
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
      videoID: id
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
    chrome.tabs.query({
      active: true,
      currentWindow: true
    }, function(tabs) {
      var activeTab = tabs[0];
      chrome.tabs.sendMessage(activeTab.id, {
        'html': currTemplate,
        'home': homeTemplate,
        'products': productsTemplate,
        'cart': cartTemplate
      });
    });
  }
});