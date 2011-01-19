function AspectOrientation() {
    function AspectStore() {
		var aspects = arguments
    	var l = aspects.length
		function applyAspect(item) {
			if(typeof item != "function") throw new Error("Expected function but got "+String(item))
			var executionQueue = []
    		var cbQueue = []
        	return function MetaNext($this,$arguments,cb) {
                cbQueue.push(cb)
        		if(i == executionQueue.length && cb) {
        		    cb.apply($this,$arguments)    
        		}
        		else {
        		    executionQueue[i].apply($this,$arguments)
        		}
        	}
			for(var i = 0; i < l; i++) {
    		    var aspectArguments = [].concat(aspects[i])
				var aspectCreator = AspectStore[aspectArguments[0]]
				if(aspectCreator) {
					executionQueue[i] = aspectCreator(item,(function (i) {
    				        return MetaNext(i)
						})(i+1),
    					aspectArguments
					)
				}
				else {
					throw new Error("Unknown aspect '"+aspects[i]+"'")
				}
			}
			return executionQueue[0]
		}
    	return applyAspect
	}
	AspectStore.prototype = AspectStore
	return AspectStore;
}

var Http = new AspectOrientation
Http.Post = function(fn,metanext) {
	return function(req,res,next) {
		if(req.method == "POST") {
			fn.apply(this,arguments)
		}
		else {
			metanext(this,arguments)
		}
	}
}
Http.Get = function(fn,metanext) {
	return function(req,res,next) {
		if(req.method == "GET") {
			fn.apply(this,arguments)
		}
		else {
			metanext(this,arguments)
		}
	}
}
Http.Error = function(fn,metanext,args) {
    var errorHandler = args[1]
    if(!typeof errorHandler=="function") throw new Error("Error handler must be a function not "+String(args[1]))
    return function(req,res,next) {
        metanext(this,arguments,function(err,result) {
            if(err) {
                errorHandler(
                    {status:404,msg:"Controller Not Found"}
                ).apply(this,arguments)
            }
            else {
                metanext(this,arguments)    
            }
        })
    }
}
var onError = function(err) {
    var err = err || {}
    var reply = {
        status: err.status || 500,
        msg: err.msg || "Internal Server Error"
    }
    return function(req,res,next) {
        res.writeHead(reply.status)
        res.end(reply.msg)    
    }
}

var HttpHelper = Http(["Error",onError],"Post","Get") (
   function index(req,res,next) {
       res.writeHead(200)
       res.end("Hello World!")
   }
)

require("http").createServer(HttpHelper).listen(process.env.C9_PORT)