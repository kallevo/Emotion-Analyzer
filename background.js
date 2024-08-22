//Listener for messages from other scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    //This action fetches the primary emotion from a python server and sends it to popup.js via an action
    if (request.action === 'analyzeText') {
        console.log('Request recieved for text:', request.text);
        fetch('http://localhost:5000/getemotion', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },body: JSON.stringify({
                textToBeScanned: request.text,
              })
            })
            .then(response => response.json())
            .then(data => {
                // Handling the data
                console.log(data);
                chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                    chrome.runtime.sendMessage({action: 'displayEmotion', emotion: data.primaryEmotion});
                    chrome.runtime.sendMessage({action: 'setErrorMessage', command: false});
                    chrome.runtime.sendMessage({ action: 'setLoading', command: false });
                })
            })
            .catch(error => {
                // Handling the error
                console.error(error);
                chrome.runtime.sendMessage({action: 'setErrorMessage', command: true});
                chrome.runtime.sendMessage({action: 'setLoading', command: false});
            });
    }
})

// Runs when the extension is installed or updated
chrome.runtime.onInstalled.addListener(() => {
    // Query all open tabs
    chrome.tabs.query({}, (tabs) => {
        for (let tab of tabs) {
            // Inject the content script into each tab
            injectContentScript(tab.id);
        }
    });
});

// Checks for the marker and injects the content script if necessary
function injectContentScript(tabId) {
    chrome.scripting.executeScript({
        target: { tabId: tabId },
        func: () => {
            if (!window.hasOwnProperty('contentScriptInjected')) {
                window.contentScriptInjected = true;
                return false; // Not yet injected
            } else {
                return true;  // Already injected
            }
        }
    }, (results) => {
        if (!results[0].result) {
            // Inject content script since it isn't injected yet
            chrome.scripting.executeScript({
                target: { tabId: tabId },
                files: ['content.js']
            });
        }
    });
}