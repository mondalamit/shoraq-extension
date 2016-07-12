var currTemplate = "";

// Register the event for clicking the browser action.
// Sends a message to the iframe sandbox.html, referenced from within eventpage.html
chrome.browserAction.onClicked.addListener(function() {
  var path = chrome.extension.getURL('/');
  var iframe = document.getElementById('theFrame');
  var prods = getProducts();

  var message = {
    command: 'render',
    context: {thing: 'ShoRaq', path: path},
    contextProd: {prodCount: prods.length,
                  products: prods,
                  path: path}
  };
  iframe.contentWindow.postMessage(message, '*');
});

//returns a list of products as JSON objects
function getProducts(){
  var contextProducts = [
    {name: 'Jennifer\'s glasses',
      from: 'Joy',
      cost: '500'},

    {name: 'Bradley\'s suit',
      from: 'Joy',
      cost: '300'}
  ];
  //TODO- code to get the products given a videoID
  //using test prods for now
  return contextProducts;
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

