console.log("hello from service worker");

const setToStorage = async (key, data) => {
    const obj = {}
    obj[key] = data
    await chrome.storage.local.set(obj)
}

const getFromStorage = async (key) => {
    const sres = await chrome.storage.local.get(key)
    return sres[key]
}


chrome.runtime.onInstalled.addListener(async() => {
    setToStorage("selection", "720p")
})