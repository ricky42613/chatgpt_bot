# chatgpt_bot
Note that this version only test on chatgpt plus account.
Professor didn't tell me that I need to share this extension to labmate, so I ignore the maintenance and user experience when I develop it. If the extension has some inconvinient part, I'm sorry about that but cannot fix it before I have oral defense.
# Some part you need to modify by yourself
* In Inject.js
  * Copy the `alt` attribute in \<img\> tag show below and Paste it to `usr_name` variable.
  <img width="974" alt="截圖 2023-03-22 上午11 15 53" src="https://user-images.githubusercontent.com/49410953/226795300-99df7196-1e24-41fa-8c6a-7d9b27e509ee.png">
  
  * Change the default prompt in `default_prompt` variable if you want
  * Change the way the extension parse the file you uploaded in `reader.onload` function
  
# Usage
* Clone the repo: `git clone https://github.com/ricky42613/chatgpt_bot.git`
* Open the extension management page in browser (note that this version only support chromium based browser)
  * Turn on `developer mode`
  * Click `load unpack` button and select the repo directory to load.
* Start the python server(`server/server.py`)
* Start to use
## Note
* upload format:
`{'id1': ['sentence1', 'sentence2'], 'id2': ['sentence1', 'sentence2']}`
  * The extension concat the sentence by `\n` for each key, and each time send the concat result for one key.
    * Make sure that the length your concat result is not longer than the limit set by ChatGPT
  * Message send by ChatGPT: `<your_prompt>\n<sentence1 in id1>\n<sentence2 in id1>....`
