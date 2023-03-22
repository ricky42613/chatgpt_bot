// if you checked "fancy-settings" in extensionizr.com, uncomment this lines

// var settings = new Store("settings", {
//     "sample_setting": "This is how you use Store.js to remember values"
// });


console.log('start service')

//example of using a message handler from the inject scripts
chrome.runtime.onMessage.addListener(
  function(msg, sender, sendResponse) {
    if (msg['type'] == 'save_msg') {
      let headers = {
        "Content-Type": "application/json",
        "Accept": "application/json",
      }
    
      fetch('http://127.0.0.1:5000/save', {
          method: "POST",
          headers: headers,
          body: JSON.stringify(msg['data'])
      }).then(response => response.text()).then(text => {
        console.log(text)
        sendResponse('finish')
      });
      sendResponse('ok');
    }
    return true
  }
);