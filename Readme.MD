Request Modifier Chrome Extension
Overview
The Request Modifier is a Chrome extension designed to modify or delete parameters in the request body JSON or form data based on specified URL patterns. This extension leverages content scripts to intercept and modify outgoing requests made via the fetch API.

Features
Intercept and modify fetch requests.
Modify or delete specific parameters in the request body.
Works with specified URL patterns.
Installation
Clone the repository:

bash

git clone https://github.com/your-repository/request-modifier.git
cd request-modifier
Load the extension in Chrome:

Open Google Chrome.
Navigate to chrome://extensions/.
Enable "Developer mode" using the toggle switch at the top right.
Click on the "Load unpacked" button.
Select the directory where you cloned the repository.
Files
manifest.json: Defines the extension's manifest, permissions, and scripts.
background.js: Handles the injection of content scripts.
content.js: Intercepts and modifies fetch requests.
test.html: A sample HTML file for testing the extension.
Usage
Serve the test.html file:

Ensure you have Node.js installed.
Install http-server globally if not already installed:
bash

npm install -g http-server
Navigate to the directory containing test.html and start the server:
bash

http-server
Open http://127.0.0.1:8080/test.html in your Chrome browser.
Test the Extension:

Open Developer Tools (Ctrl+Shift+I or Cmd+Opt+I on Mac).
Go to the "Network" tab.
Click the "Send Request" button on the test page.
Inspect the network request to verify if the phone parameter has been deleted.
Code Structure
manifest.json
Defines the extension configuration, including permissions and scripts.

json
{
  "manifest_version": 3,
  "name": "Request Modifier",
  "version": "1.0",
  "description": "Modify or delete parameters in request body JSON or form data.",
  "permissions": [
    "scripting",
    "activeTab"
  ],
  "background": {
    "service_worker": "background.js"
  },
  "host_permissions": [
    "*://*/*"
  ],
  "content_scripts": [
    {
      "matches": ["<all_urls>"],
      "js": ["content.js"],
      "run_at": "document_start"
    }
  ]
}
background.js
Handles the injection of content scripts when a tab is updated.

javascript
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    chrome.scripting.executeScript({
      target: { tabId: tabId },
      files: ['content.js']
    });
  }
});
content.js
Overrides the fetch method to intercept and modify outgoing requests.

javascript
(function() {
  const originalFetch = window.fetch;

  window.fetch = async function(resource, init) {
    if (init && init.method && init.method.toUpperCase() === "POST" && init.body) {
      try {
        const urlPatterns = ["example.com", "another-example.com"];
        if (urlPatterns.some(pattern => resource.includes(pattern))) {
          let body = JSON.parse(init.body);

          // Modify or delete parameters here
          if (body.user && body.user.phone) {
            console.log('Deleting phone field');
            delete body.user.phone;
          }

          init.body = JSON.stringify(body);
        }
      } catch (e) {
        console.error('Error modifying request body:', e);
      }
    }

    return originalFetch(resource, init);
  };
})();
test.html
A simple HTML file for testing the extension's functionality.

html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Test Request Modifier</title>
</head>
<body>
  <h1>Test Request Modifier Extension</h1>
  <button id="sendRequest">Send Request</button>

  <script>
    document.getElementById('sendRequest').addEventListener('click', function() {
      fetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user: {
            name: "sam",
            phone: 5555555
          }
        })
      })
      .then(response => response.json())
      .then(data => console.log('Response:', data))
      .catch(error => console.error('Error:', error));
    });
  </script>
</body>
</html>