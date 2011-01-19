//
// Structured Preloader
//
// - API (js.* namespace)
// new PreLoader()
// new PreLoader().loaded
//   -map of all the preloaded resources to cached values, can be used to grab resources
// PreLoader.prototype.load(String[] resource_urls,Function(Number loaded, Number total) callback,Boolean reload_ok)
//   -resource_urls : relative or absolute paths to resources (should work cross domain)
//   -callback : callback whenever a resource is done loading
//     -loaded : number of resources in chain that have been loaded
//     -total : total number of resources that were requested
//     -reload_ok : if you should attempt to reload a resource
// PreLoader.prototype.registerHandler(String mime,Function(String resource_url,Function(loadedResource) callback) handler)
//   -mime : mime type to match, including wildcards like "*/*","text/*","text/javascript"
//   -handler : means to load the resource once it has been requested
//     -resource_url : relative or absolute path to resource
//     -callback : means to notify PreLoader that you are done loading a resource and give it a value
//       -loadedResource : a reference to the resource you have loaded
//
//
// - Usage
// var preloader = new PreLoader
// preloader.load(["http://path/to/img.gif","http://path/to/script.js"],function(loaded,total){
//   if(var img = preloader.loaded["http://path/to/img.gif"]) {
//     document.body.appendChild(img)
//   }
//   if(loaded == total) {
//     //execute done loading procedure
//   }
// },true)
// // it is often appropriate to include a timer if loading should be considered failed after a certain amount of time
//
;(function(){
    js = js || {}
    if(js.PreLoader) return
    function PreLoader() {
        this.handlers = this.handlers || {}    
        this.loaded = {}
    }
    PerLoader.prototype.getFileExtension = function getFileExtension(str) {
        return String(str).match(/([^/#?]*[.]?)+([^#?]*)$/)[1]
    }
    
    PreLoader.prototype.load = function(resources,cb,reload_ok) {
        var self = this
        var loaded = 0;
        var l = resource.length
        for(var i = 0; i < l; i++) {
            var resource = String(resources[i])
            if(!reload_ok && this.loaded[resource]) {
                loaded++
                if(cb) cb(loaded,l)
                continue
            }
            var type = this.mime[getFileExtension(resource)]
            var handler
            if(type) {
               handler = this.handlers[type]
            }
            if(!handler) handler = this.handlers[type = type.replace(/[/][\s\S]*$/,"/*")]
            if(!handler) handler = this.handlers[type = type.replace(/^[\s\S]*[/]/,"*/")]
            if(!handler) throw new Error("Cannot find handler for "+resource)
            else handler.call(this,resource,(function (resource) {
                return function(obj) {
                    self.loaded[resource] = obj
                    loaded++
                    if(cb) cb(loaded,l)
                }
            })(resource))
        }
    }
    PreLoader.prototype.registerHandler = function registerHandler(mime,handler) {
        this.handlers[mime] = handler
        return this
    }
    PreLoader.prototype.mime = {
        "js":"text/javascript",
        "gif":"image/gif",
        "png":"image/png",
        "jpg":"image/jpeg",
        "jpeg":"image/jpeg"
    }
    
    ;(PreLoader.prototype = new PreLoader()).registerHandler("text/javascript",function(resource,callback) {
        var script = document.createElement("script")
        script.src = resource
        var done = false
        script.onreadystatechange = function() {
            if(script.readyState === "complete") {
                if(!done) {
                    done = true
                    callback(script)
                }
            }    
        }
        script.onload = function() {
            if(!done) {
                done = true
                callback(script)
            }
        }
        document.appendChild(script)
    })
    .registerHandler("image/*",function(resource,callback) {
        var img = new Image()
        img.src = resource
        img.onload = function() {callback(img)}
    })
    .registerHandler("audio/*",function(resource,callback) {
        var snd = new Audio()
        snd.src = resource
        snd.onload = function() {callback(snd)}
    })
    .registerHandler("video/*",function(resource,callback) {
        var avi = document.createElement("video")
        avi.src = resource
        avi.onload = function() {callback(avi)}
    })
    js.PreLoader = PreLoader
    delete PreLoader
})();