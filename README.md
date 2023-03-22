# chatgpt_bot
Note that this version only test on chatgpt plus account.
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
