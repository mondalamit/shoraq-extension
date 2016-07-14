// This content_script is loaded into any active tab that matches the permissions.
// Look at manifest.json and docs to learn more about permissions if curious (http://*/*, etc)
// Whenever a message is handled, the rendered HTML (msg.html)
// is appended to the DOM. 
chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
  var sidebar = document.querySelector('#shoraq-sidebar');
  if (sidebar !== null) {
    sidebar.remove();
  } else {
    var link = document.createElement('link');
    link.href = chrome.extension.getURL('main.css');
    link.type = 'text/css';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    var sidebarContainer = document.createElement('div');
    sidebarContainer.setAttribute('id', 'shoraq-sidebar');
    sidebarContainer.innerHTML = msg.html;
    var firstChild = document.body.firstChild;
    document.body.insertBefore(sidebarContainer, firstChild);

    var mainContainer = document.getElementById('mainContainer');
    //load home by default
    mainContainer.innerHTML = msg.home;

    //click listeners for sidebar buttons
    var homeButton = document.getElementById('homeBtn');
    homeButton.addEventListener('click', function() {
      mainContainer.innerHTML = msg.home;
    });

    var productsButton = document.getElementById('productsBtn');
    productsButton.addEventListener('click', function() {
      mainContainer.innerHTML = msg.products;
    })

    var cartButton = document.getElementById('cartBtn');
    cartButton.addEventListener('click', function() {
      mainContainer.innerHTML = msg.cart;
    })
  }
});

// Set up a connection to eventpage.js
var port = chrome.runtime.connect({
  name: 'time'
});

// Do a URL comparison to determine whether to remove the sidebar on page navigation.
var oldUrl = document.URL;

// Get current time and the current videoID.
var video = document.getElementsByTagName('video')[0];
window.setInterval(function() {
  // Check if the user has switched pages; remove the sidebar or re-render it with new products.
  if (document.URL !== oldUrl) {
    var sidebar = document.querySelector('#shoraq-sidebar');
    if (sidebar == null) {
      oldUrl = document.URL;
    } else {
      sidebar.remove();
      oldUrl = document.URL;
    }
  }
  // Check if a video element exists and send a message with the current time if so.
  if (video) {
    if (!video.paused) {
      var time = new Date(video.currentTime * 1000).toISOString().substr(11, 8);
      // Send the current time.
      port.postMessage({
        time: time
      });
    }
  } else {
    // Something went wrong when getting the video element. Try again.
    video = document.getElementsByTagName('video')[0];
  }
}, 1000);