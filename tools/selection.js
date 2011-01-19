//
// SetSelected
// -Text Selection Utility
//
// Sets the window's selection to whatever content is provided
// Useful for canvas work with selections
// -Content should not already be tied to a parent node
//   -use cloneNode or a String
//
// - API (js.* namespace)
//   retrieve() -> String
//   select(String|DOMNode content)
//
;(function(){
    js = js || {}
    if(js.Selection) return
    
    var clipboard = document.createElement("span");
    clipboard.style.position="fixed";
    clipboard.style.left=clipboard.style.top="-1px"
    clipboard.style.width=clipboard.style.height="1px"
    clipboard.style.display="block"
    clipboard.style.overflow="hidden"
    document.body.appendChild(clipboard)    
    
    js.Selection = {
        "retrieve" : function retrieve() {
            return String(
                (window.getSelection&&window.getSelection()+"")
                ||(document.selection&&document.selection.createRange&&document.selection.createRange().text)
            )
        },
        "select" : function select(html) {
            if(html) {
                while(clipboard.childNodes.length) {
                    clipboard.removeChild(clipboard.firstChild)    
                }
                if(typeof html === "string") {
                    html = document.createTextNode(html)
                }
                if(html) {
                    clipboard.appendChild(html)
                }
                if(window.getSelection) window.getSelection().selectAllChildren(clipboard)   
                else {
                    var range = document.body.createTextRange()
                    range.moveToElementText(clipboard)
                    range.select()
                }
            }
        }
    }
    
})();