console.log('content script loaded')

//Emotion analyzation process restarted if user highlights text on the website again
document.addEventListener('mouseup', () => {
    chrome.runtime.sendMessage({ action: 'reanalyze' });
})

//Listener for messages from other scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('content.js: Request recieved: ', request);
    
    //Action for fetching the highlighted text from the current tab and sending it back to the sender (popoup.js)
    if (request.action === 'getHighlightedText') {
        const selection = window.getSelection().toString();
        if (selection != "") {
            console.log('Highlighted: ', selection);
            chrome.runtime.sendMessage({ action: 'displayEmotion' });
            chrome.runtime.sendMessage({ action: 'setLoading', command: true });
            chrome.runtime.sendMessage({ action: 'setErrorMessage', command: false });
            sendResponse({ text: selection });
        }
    }
});
