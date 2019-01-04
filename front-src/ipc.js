const { ipcRenderer } = require('electron');

const dataObject = {
    "token": "",
    "server": "",
    "prefix": ""
}

document.getElementById("confirmation").addEventListener("click", () => {
    if (document.getElementById("token").value && document.getElementById("sid").value && (document.getElementById("prefix").value) ? document.getElementById("prefix").value : "!"){
        dataObject.token = document.getElementById("token").value
        dataObject.server = document.getElementById("sid").value
        dataObject.prefix = (document.getElementById("prefix").value) ? document.getElementById("prefix").value : "!"

        ipcRenderer.send("asynchronous-message", dataObject)
    }
})