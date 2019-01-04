const { BrowserWindow, app, ipcMain, nativeImage } = require("electron")

const path = require("path")
const fs = require('fs')
const ip = require('ip');
const cp = require('child_process')
const expressA = require('express')
const express = expressA()

let win

function createWindow(){
    win = new BrowserWindow({
        width: 800,
        height: 600
    })

    win.loadFile(`front-src/index.html`)

    win.setIcon(nativeImage.createFromPath(path.join(__dirname, `assets/dcube.png`)))
    win.setTitle("D-Zone")

    win.on("closed", () => {
        win = null
    })
}

app.on("ready", () => {
    createWindow()
})

app.on("activate", () => {
    if(win === null){
        createWindow()
    }
})

ipcMain.on("asynchronous-message", (e, data) => {
    console.log(data)

    fs.writeFileSync('./dzone-src/.env', `token=${data.token}`, function (err) {
        if (err) throw err;
        console.log('Created the env file with the token');
    });
    fs.writeFileSync('./dzone-src/discord-config.json', `{"url": "http://localhost:8081","infoCommand": "${data.prefix  ? data.prefix : "!"}d-zone","servers": [{"id": "${data.server}","default": true, "ignoreChannels": []}]}`, function (err) {
        if (err) throw err;
        console.log('Created the discord-config file with the token and server');
    })
    fs.writeFileSync('./dzone-src/socket-config.json', `{"address": "${ip.address()}","port": "8080"}`, function (err) {
        if (err) throw err;
        console.log('Created the socket-config file with the token');
    })
    cp.exec(`npm run-script eris-build`, function (error, stdout) {
        if (error) throw error;
        console.log('Building')
        console.log(stdout)
    })
    cp.exec(`node dzone-src/index.js`, function (error, stdout) {
        if (error) throw error;
        console.log('Started')
        console.log(stdout)
    })
    win.loadFile('./front-src/dzone.html')
})

express.use('/', expressA.static('dzone-src/web'))

express.listen(8080, () => console.log(`Listening to port ${8080}`))
