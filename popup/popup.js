console.log("hello from popup");


const setToStorage = async (key, data) => {
    const obj = {}
    obj[key] = data
    await chrome.storage.local.set(obj)
}

const getFromStorage = async (key) => {
    const sres = await chrome.storage.local.get(key)
    return sres[key]
}

const qualityList = document.getElementById("quality-list")
const apply = document.getElementById('Apply')

chrome.storage.local.get(["selection"],(res)=>{
    let selectElement = document.getElementById("quality-list");
    let options=Array.from(selectElement.options)
    options.forEach(e=>{
        if(e.value == res.selection){
            e.selected=true
        }
        else{
            e.selected=false
        }
    })
})

const logSelectedValue =  async() => {
    let selectElement = document.getElementById("quality-list");
    let selectedValue = selectElement.options[selectElement.selectedIndex].value;
    return selectedValue
}
const main = async() => {
    let selectedValue=await logSelectedValue()
    await setToStorage("selection", selectedValue)
    let a = await getFromStorage("selection")
    console.log(a);
    chrome.tabs.query({active:true,currentWindow:true},(tabs)=>{
        console.log(tabs[0].url);
        chrome.tabs.sendMessage(tabs[0].id,{msg:'youtubeTvQuality'},()=>{
            console.log("message send Success");
        })
    })
}
apply.addEventListener("click", main)
    
