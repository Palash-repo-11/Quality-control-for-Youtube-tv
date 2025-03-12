console.log("hello from content Script");

const setToStorage = async (key, data) => {
    const obj = {}
    obj[key] = data
    await chrome.storage.local.set(obj)
}

const getFromStorage = async (key) => {
    const sres = await chrome.storage.local.get(key)
    return sres[key]
}

const urlCheck = () => {
    if (window.location.href.includes('https://tv.youtube.com/watch')) return true
    return false
}
const changeQuality = (quality) => {
    console.log("controller start");
    let settingBtn = document.querySelector('[aria-label="Settings (s)"]')
    settingBtn.click()
    let videoSetting = document.querySelector('.ytp-panel-menu')
    let videoSettinglist = videoSetting.querySelectorAll('.ytp-menuitem-label')
    let qualitySetting = videoSettinglist[videoSettinglist.length - 1]
    console.log(qualitySetting, "quality settings");
    console.log(qualitySetting.textContent.includes('Quality'))
    if (qualitySetting.textContent.includes('Quality')) {
        qualitySetting.click()
        let all_buttons = document.querySelectorAll('.ytp-quality-menu .ytp-menuitem-label')
        for (let i = 0; i < all_buttons.length; i++) {
            const e = all_buttons[i];
            console.log(e);
            if (e.textContent.includes(quality)) {
                e.click()
                return;
            }
        }
        let highestEl = all_buttons[0]
        console.log(highestEl);
        let highestQuality = highestEl.textContent
        console.log(highestQuality);
        if (highestQuality.includes('Premium')) {
            highestEl = all_buttons[1]
            highestQuality = highestEl.textContent
            if (highestQuality.includes('Premium')) {
                highestEl = all_buttons[2]
                highestQuality = highestEl.textContent
            }
        }
        if (!highestQuality.includes(quality)) {
            highestEl.click()
        }
    }
    else{
        qualitySetting.click()
        let all_buttons = document.querySelectorAll('.ytp-menuitem-label')
        console.log(all_buttons);
        let highestEl = all_buttons[0]
        console.log(highestEl);
        highestEl.click()
    }
}

const main = async () => {
    let checkUrl = urlCheck()
    if (checkUrl) {
        let quality = await getFromStorage("selection")
        console.log(quality);
        changeQuality(quality)
    }
}
chrome.runtime.onMessage.addListener((message, sender, sendResponce) => {
    console.log(message);
    if (message.msg === "youtubeTvQuality") {
        main()
    }
})