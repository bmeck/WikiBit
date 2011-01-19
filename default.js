var defaults = {
    router : function router(app) {
        app.get("/page/:page_id",function(req,res){
            this.modules.Viewer(req.params.page_id)
        })
        app.post("/page/:page_id",function(req,res){
            this.modules.Page(req.params.page_id).SaveText(req.body)
        })
        app.get("/page/:page_id/edit",function(req,res){
            this.modules.Editor(req.params.page_id)
        })
    }
}
for(var k in defaults) {
    if(!config[k]) {
        config[k] = defaults[k]    
    }
}