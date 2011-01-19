require("./config")
require("./default")
require.paths.push(__dirname+"/lib")
//var mysql = require("mysql")
//var connect = require("connect")
var Database = require("./database")
var EventEmitter = require("events").EventEmitter
global.runtime = {}

function Wiki(config) {
    if(this instanceof Wiki) {
        EventEmitter.call(this)
        var self = this
        self.modules = {}
        runtime.modules = self.modules
        //connect to database
        databaseClient = mysql.client(config.db)
        databaseClient.connect(function onDatabaseConnection(err) {
            if(err) {
                self.emit("error",err)
            }
            else {
                var db = new Database(databaseClient)
                runtime.db = db.controller(databaseClient)
                
                //load up our renderer
                require("./template")
                
                //freeze the global
                Object.freeze(global)
                //freeze the runtime
                Object.freeze(runtime)
                
                //load modules
                //Sync for setup
                fs.readdirSync("modules").forEach(function(moduleName){
                    self.modules[moduleName] = require(path.join(".","modules",moduleName))
                })
                
                if(config.router) {
                    runtime.router = config.router.call(this,function () {
                        
                    })    
                }
            }
        })
    }
    else {
        return new Wiki(config)    
    }
}
Wiki.prototype = new EventEmitter
Wiki.prototype.constructor = Wiki

Wiki.prototype.generateHandler = function generateHandler(req,res,next) {
    return function handler(req,res,next) {
        if(runtime.router) {
            runtime.router.call(req,res,function onDefaultRequestBehavior() {
                req.end(
                    this.modules.Viewer.render(route)
                )   
            })
        }
    }
}

//Fire it up
//Connect.createServer(Wiki(config).generateHandler()).listen(80)