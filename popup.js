//Listener for messages from other scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('popoup.js: request recieved', request);

    //Action for displaying the primary emotion recieved from background.js as an emoji in the popup
    if (request.action === 'displayEmotion') {
        console.log('popup.js: Emotion:', request.emotion);
        const displayElement = document.getElementById('emotion');
        let emoji;
        if (request.emotion != undefined) {
            switch (request.emotion) {
                case 'anger':
                    emoji = '&#x1F621';
                    break;
                case 'disgust':
                    emoji = '&#x1F922';
                    break;
                case 'fear':
                    emoji = '&#x1F631';
                    break;
                case 'joy':
                    emoji = '&#x1F600';
                    break;
                case 'neutral':
                    emoji = '&#x1F610';
                    break;
                case 'sadness':
                    emoji = '&#x1F622';
                    break;
                case 'suprise':
                    emoji = '&#x1F632';
            }
            displayElement.style.display = 'block';
            displayElement.innerHTML = emoji;
        } else {
            displayElement.style.display = 'none';
        }
        
    //Action for setting the error message visibility
    } else if (request.action === 'setErrorMessage') {
        const errorMessage = document.getElementById('error-message');
        if (request.command === true) {
            errorMessage.style.display = 'block';
        } else if (request.command === false) {
            errorMessage.style.display = 'none'
        }

    //Action for setting the loading icon visibility
    } else if (request.action === 'setLoading') {
        const loadingIcon = document.getElementById('loading');
        if (request.command === true) {
            loadingIcon.style.display = 'block';
        } else if (request.command === false) {
            loadingIcon.style.display = 'none'
        }

    //Action for restarting the analyzation
    } else if (request.action === 'reanalyze') {
        analyzeText();
    }
});

document.addEventListener('DOMContentLoaded', analyzeText);

/*A function for getting the highlighted text on the webpage from content.js and 
sending it via a message to background.js for analyzation*/
function analyzeText() {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'getHighlightedText'}, (response) => {
            if (response && response.text) {
                const text = response.text;     //Taking highlighted text from the response
                console.log('Sending message to background script...')
                chrome.runtime.sendMessage({ action: 'analyzeText', text: text });      // Sending text to background.js for analysis
            } else{
                console.error('Highlighted text was not recieved by popup.js');
                document.getElementById('loading').style.display = 'none';
            }
        })         
    });
}        
     
                   

  
