module.exports = {
    render : function(page_id,cb) {
        var query = runtime.db.query("SELECT text FROM Pages WHERE id='?';",page_id)
        var count = 0
        query.on("row",function onPageQueryRow(row) {
            count++
            cb(false,runtime.renderer(row.text))
        })
        query.on("end",function onPageQueryEnd() {
            if(count > 1) {
                cb(new Error("Unable to render page, page '"+page_id+"' has duplicates (did you set up the database properly?)."))
                return
            }
            else if(count !== 1) {
                var statusPage = config.statusPage && config.statusPage[404]
                if(statusPage) {
                    return render(statusPage,cb)
                }
                cb(new Error("Unable to render page, page '"+page_id+"' not found."))
                return
            }
            //this last case is handled in onPageQueryRow
        })
    }    
}