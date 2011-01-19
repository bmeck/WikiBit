var tags = {}
var renderer = runtime.renderer = function pistachioRender(str) {
    return str
}
//cb(String innerContent) -> String
renderer.registerTag = function registerTag(tagName,cb) {
    tags[tagName] = cb
}