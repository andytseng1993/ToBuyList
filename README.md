1. use <a> with `encodeURIComponent` to build download buttom
`let dataStr = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data,null, 2))`
2. `downloadBtn.setAttribute('href','data:' + dataStr)`   
3. .previousElementSibling to get the HTML content of the previous sibling of a list item.
4. `text[0].toUpperCase()+text.slice(1).toLowerCase()` : to sure the item name in the same model
5. `event.stopPropagation()` to prevent bubbling up to parent elements.
6. `str.replace(/[^A-Z0-9]+/ig,'_') ` to prevent special synbol in input.
7. use requestAnimationFrame(callback) to create smooth scrolling.