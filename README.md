use tag a to build download buttom
`let dataStr = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data,null, 2))
downloadBtn.setAttribute('href','data:' + dataStr)`   


