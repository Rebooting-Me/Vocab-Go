# Vocab Go Extension (!Beta)
## A utility based vocabulary extension 
Have you ever felt frustrated before when you couldn't understand a word of the article you are reading on Web and have to look it up elsewhere? The irritation to look it up many times kills the desire to even learn new words anymore.
This extension attempts to tackle this very problem of yours!
1. Select a word you want to look up.
2. Just click the extension icon.

A manifest file is created whose attributes are :
```
{
    "name": "Vocab Go",
    "description": "Build an Extension!",
    "version": "1.0.0",
    "manifest_version": 3,
    "action": {
        "default_icon": {
          "16": "16.png",
          "32": "32.png",
          "64": "64.png",
          "128": "128.png"
        },

        "default_popup": "index.html",
        "default_title": "Vocab Go"
        
    },

    "externally_connectable": {
        "ids": ["fepopbgajpglddmoflgpdddlfamebkfe"],
        "matches": ["<all_urls>"]
    },

    "icons" : {
        "16": "16.png",
        "32": "32.png",
        "64": "64.png",
        "128": "128.png"
    },
    
    "commands": {
    "open-popup": {
      "suggested_key": {
        "default": "Ctrl+Shift+Q",
        "mac": "MacCtrl+Shift+Q"
      },
      "description": "Open the popup with word definitions"
    }
  },

    "content_scripts": [{
        "matches": ["<all_urls>"],
        "js": ["content.js"]
    }],

    "accepts_tls_channel_id": false,

    "background": {
        "service_worker": "background.js"
    },
    
    "permissions": ["storage", "activeTab", "declarativeContent", "https://api.dictionaryapi.dev/api/v2/entries/en/", "https://dictionaryapi.dev/"]
    
}

``` 

And you are done! The vocabulary card will display the meaning on the very same page where you are reading it!
