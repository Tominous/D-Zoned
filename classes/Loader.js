const fs = require("fs")
const path = require("path")

class Loader {
    constructor () {
        this.basicExport = {
            "token": "",
            "server": "",
            "prefix": ""
        }
    }

    export (token, server, prefix, pathTo) {
        this.basicExport.token = token
        this.basicExport.server = server
        this.basicExport.prefix = prefix
        fs.writeFileSync(path.join(pathTo), JSON.stringify(this.basicExport), (err) => {
            if(err) return err
            else return console.log("Successfully exported")
        })

        console.log("yay")
    }
}

module.exports = Loader