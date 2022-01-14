1. use tag a to build download buttom
`let dataStr = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data,null, 2))
2. downloadBtn.setAttribute('href','data:' + dataStr)`   
3. .previousElementSibling
4. text[0].toUpperCase()+text.slice(1).toLowerCase() : to sure the item name in the same model
5. event.stopPropagation()