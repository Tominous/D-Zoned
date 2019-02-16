const { BrowserWindow, app, ipcMain, nativeImage, dialog, Menu, shell, Tray } = require("electron")
const windowStateKeeper = require('electron-window-state');

const express = require('express')
const Express = express()

const dz = require("./assets/classes/DZone")
const Dzone = new dz()
const loader = require("./assets/classes/Loader.js")
const Loader = new loader()
const path = require("path")
const fs = require("fs")

let win
let tray
let menu

async function createWindow(){
    const mainWindowState = windowStateKeeper({
        defaultWidth: 1000,
        defaultHeigt: 800
    })

    win = new BrowserWindow({
        x: mainWindowState.x,
        y: mainWindowState.y,
        width: mainWindowState.width,
        height: mainWindowState.height,
        icon: nativeImage.createFromPath(path.join(__dirname, "assets/images/dcube.png")).resize({ width: 18, height: 18, quality: 'best' }),
        backgroundColor: '#717bb9'
    })

    mainWindowState.manage(win)

    win.loadFile(path.join(__dirname, "assets/front-end/initial-screen.html"))

    win.setIcon(nativeImage.createFromPath(path.join(__dirname, `assets/images/dcube.png`)))
    win.setTitle("D-Zone")
    //win.webContents.openDevTools()
    win.on("close", async () => {
        const response = await dialog.showMessageBox(
            {
                type: "question",
                title: "Exit D-Zone?",
                message: "Would you like to exit the D-Zone or keep it running on the system tray?",
                buttons: [
                    "Exit",
                    "Send to tray"
                ]
        }) 
        if(response === 0){
            await Dzone.kill()
            app.exit()
            return true;
        }else{
           win.minimize()
           return false
        }
    })

    win.on('close', function (event) {
        event.preventDefault();
        win.hide();
    });

    menu = Menu.buildFromTemplate([
        {
            label: "File",
            submenu: [
                {
                    label: "Export Current Config",
                    click () {
                        win.webContents.send("export-req", 'whoooooooh!')
                        ipcMain.on("export-res", function(e, data) {
                            dialog.showSaveDialog({
                                title: "Select a place to export the Config",
                                defaultPath: "./",
                                buttonLabel: "Export",
                                filters: [{
                                    name: "Dzone Configs",
                                    extensions: ["json"]
                                }]
                            }, function (filePaths, bookMarks) {
                                if(!filePaths) return 
                                Loader.export(data.token, data.server, data.prefix, filePaths)
                            })
                        })
                    },
                    accelerator: "CmdOrCtrl+S"
                },
                {
                    label: "Import Config",
                    click() {
                        dialog.showOpenDialog(
                            {
                                title: "Select a Config to Import",
                                defaultPath: "./",
                                buttonLabel: "Import",
                                filters: [
                                    { name: "Dzone Configs", extensions: ["json"]}
                                ]
                        }, function(filePaths, bookMarks) {
                            if(!filePaths) return
                            fs.readFile(filePaths[0].replace(/\\/g, "/"), "utf8", (err, data) => {
                                data = JSON.parse(data)
                                if (err) throw err
                                win.webContents.send("import-req", data)
                            })
                        })
                    },
                    accelerator: "CmdOrCtrl+O"
                },
                {
                    type: "separator"
                },
                {
                    label: "Reload",
                    click () {
                        win.reload()
                    },
                    accelerator: "CmdOrCtrl+R"
                },
                {
                    type: "separator"
                },
                {
                    label: "Exit",
                    async click () {
                        await Dzone.kill()
                        app.exit()
                        return true
                    },
                    accelerator: "CmdOrCtrl+Shift+W"
                }
            ]
        },
        { 
            label: 'Edit',
            submenu: [
                { role: 'undo' },
                { role: 'redo' },
                { type: 'separator' },
                { role: 'cut' },
                { role: 'copy' },
                { role: 'paste' },
                { role: 'pasteandmatchstyle' },
                { role: 'delete' },
                { role: 'selectall' }
            ]
        },
        {
            label: "Info",
            submenu: [
                {
                    label: "Github",
                    click () {
                        shell.openExternal("https://github.com/Chrominix/D-Zoned")
                    },
                    icon: nativeImage.createFromPath(path.join(__dirname, "/assets/images/GithubLogo.png")).resize({ width: 18, height: 18, quality: 'best' })
                },
                {
                    label: "Discord",
                    click () {
                        shell.openExternal("https://discord.gg/B97B5a9")
                    },
                    icon: nativeImage.createFromPath(path.join(__dirname, "/assets/images/DiscordLogo.png")).resize({ width: 18, height: 18, quality: 'best' })
                }
            ]
        }
    ])

    Menu.setApplicationMenu(menu)
}

app.on("ready", async function () {

    createWindow()
    tray = new Tray(nativeImage.createFromPath(path.join(__dirname, "/assets/images/dcube.png")).resize({ width: 18, height: 18, quality: 'best' }))
    const contextMenu = Menu.buildFromTemplate(
        [
            {
                label: "Github",
                click () {
                    shell.openExternal("https://github.com/axelgreavette/d-zoned")
                },
                icon: nativeImage.createFromPath(path.join(__dirname, "/assets/images/GithubLogo.png")).resize({ width: 18, height: 18, quality: 'best' })
            },
            {
                label: "Discord",
                click () {
                    shell.openExternal("https://discord.gg/B97B5a9")
                },
                icon: nativeImage.createFromPath(path.join(__dirname, "/assets/images/DiscordLogo.png")).resize({ width: 18, height: 18, quality: 'best' })
            },
            {
                type: "separator"
            },
            {
                label: "Exit",
                async click() {
                    app.exit()
                    await Dzone.kill()
                }
            },
            
        ]
    )
    tray.setToolTip('D-Zoned')
    tray.setContextMenu(contextMenu)

    tray.on('click', () => {
        win.isVisible() ? win.hide() : win.show()
    });
})



app.on("activate", () => {
    if(win === null){
        createWindow()
    }
})
app.on("exit", async function () {
    await Dzone.kill()
    app.exit()
    return true;
})

app.on('window-all-closed', app.exit);

ipcMain.on("asynchronous-message", async (e, data) => {
    Dzone.createTokenEnv(data.token)
    Dzone.createDiscordConfig(data.prefix ? data.prefix : null, data.server, 8080)
    Dzone.createSocketConfig("8080")
    await Dzone.buildFiles()
    await Dzone.serveFiles()   

    win.loadFile(path.join(__dirname, "assets/front-end/d-zone.html"))
})

Express.use('/', express.static('assets/d-zone/web'))

Express.listen(8080, () => console.log("Listening to port 8080"))
