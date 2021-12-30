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
document.getElementById('import').addEventListener('click',function(){
    selectFile()
})


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
    
})