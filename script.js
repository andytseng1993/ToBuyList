let data = {}
function selectFile(){
    let file = document.getElementById('chooseFile').files[0]
    let reader = new FileReader()
    if(file){
        reader.addEventListener('load',function(event){
            const result = JSON.parse(reader.result)
            console.log(result)
            data =result
        })
        reader.readAsText(file)
    }else{
        alert('Please choose a file :)')
    }
}



document.getElementById('click').addEventListener('click',function(){
    if(data){
        for(let member of data.members){
            console.log(member.name)
            let name = `<li>${member.name}</li>`
            let result=document.getElementById('result')
            result.innerHTML += name
        }
        console.log(data)
    }
    data.active='123'
    
})
function saveFile(){
    console.log(data)
    if(Object.keys(data).length === 0 && data.constructor === Object){
        alert('Empty')
    }else{
        let downloadBtn = document.getElementById('download')
        let dataStr = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data,null, 2))
        downloadBtn.setAttribute('href','data:' + dataStr)
    }
    
}