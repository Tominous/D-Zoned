const fs = require("fs")
const ipFinder = require("ip").address()
const terminal = require("child_process")

class DZone {
    constructor () {

        this.basicDiscordConfig = {
            "url": "",
            "infoCommand": "",
            "servers": [
                {
                    "id": "",
                    "default": true,
                    "ignoreChannels": []
                }
            ]
        }

        this.basicSocketConfig = {
            "address": ipFinder,
            "port": ""
        }

        this.terminal = terminal.spawn("cmd")

        this.terminal.stdout.on("data", data => {
            //console.log(data)
        }) 
        
        this.terminal.on("exit", code => {
            console.log("Child Process ended with code " + code)
        })
    }

    createTokenEnv (token) {
        fs.writeFileSync('./assets/d-zone/.env', `token=${token}`, function (err) {
            if (err) throw err
            else return "Created the env file with the token"
        })
    }

   // `{"url": "http://localhost:8081","infoCommand": "${data.prefix  ? data.prefix : "!"}d-zone","servers": [{"id": "${data.server}","default": true, "ignoreChannels": []}]}`
   
   createDiscordConfig (prefix, server, port) {
        this.basicDiscordConfig.url = "localhost:" + port
        this.basicDiscordConfig.infoCommand = `${prefix ? prefix : "!"}d-zone`
        this.basicDiscordConfig.servers[0].id = server

        fs.writeFileSync('./assets/d-zone/discord-config.json', JSON.stringify(this.basicDiscordConfig), function (err) {
            if (err) throw err;
            else return "Created the discord-config file with the token and server"
        })
    }

    createSocketConfig (port) {
        this.basicSocketConfig.port = port ? port : "8080"
        fs.writeFileSync('./assets/d-zone/socket-config.json', JSON.stringify(this.basicSocketConfig), function (err) {
            if (err) throw err;
            else return "Created the socket-config file with the token"
        })
    }

    async buildFiles (end = false) {
        console.log("Building")
        await this.terminal.stdin.write("npm run-script eris-build \n", err => {
            if (err) throw err
        })
        if (end === true) this.terminal.stdin.end()
        return console.log("Finished Building")

    }

    async serveFiles (end = false) {
        console.log("Starting server")
        await this.terminal.stdin.write("node ./assets/d-zone/index.js \n", err => {
            if (err) throw err
        })
        if (end === true) this.terminal.stdin.end()
        return console.log("Server started successfully")
    }

    async kill () {
        this.terminal.stdin.end()
        return console.log("Killed off")
    }

}


module.exports = DZone