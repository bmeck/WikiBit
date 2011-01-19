var path = require("path")
var fs = require("fs")

function Database(client) {
    this.client = client
    this.schemas = fs.readDirSync("sql").map(function(schemaFileName) {
        return {
            name: schemaFileName,
            module: require(path.join("sql",schemaFileName))
        }
    })
}
Database.prototype.install = function install() {
    this.schemas.forEach(function(schema){
        schema.module.install()
    })    
}
Database.prototype.uninstall = function install() {
    this.schemas.forEach(function(schema){
        schema.module.uninstall()
    })    
}
Database.prototype.controller = function controller() {
    this.schemas.map(function(schema){
        return [schema.name,schema.module.controller]
    })
}
module.exports = Database