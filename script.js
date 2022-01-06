let data = []

function selectFile(){
    let file = document.getElementById('chooseFile')
    let reader = new FileReader()
    if(file.files[0]){
        reader.addEventListener('load',function(event){
            const result = JSON.parse(reader.result)
            console.log(result)
            data =result
            localStorage.setItem('list',JSON.stringify(data))
        })
        reader.readAsText(file.files[0])
    }else{                                                                                                              
        alert('Please choose a file :)')
    }
    file.value = ''
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
        let dataStr = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data))
        downloadBtn.setAttribute('href','data:' + dataStr)
    }
    
}

// Input List
let form = document.getElementById('myForm')
let msg =document.querySelector('.msg')
let customerName = document.getElementById('name')
let companyInput = document.getElementById('company')
let productInput = document.getElementById('product')
let quantityInput= document.getElementById('quantity')
let result = document.getElementById('result')

form.addEventListener('submit',function(event){
    event.preventDefault()
    try{
        if(customerName.value === '' || companyInput.value===''|| productInput.value===''||quantityInput.value==='' ) throw 'Please enter all fields'
        else createList(customerName.value.trim(), companyInput.value.trim(),productInput.value.trim(),quantityInput.valueAsNumber)
    }catch(error){
        msg.classList.add('err')
        msg.textContent= error
    }finally{
        setTimeout(()=>{
            msg.textContent = ''
            msg.className= 'msg'
        },2000)
    }
})

readList()
function readList(){
    data= JSON.parse(localStorage.getItem('list')||'[]')
    addList()
    }
class ToBuyList{
    constructor (customerName,companyInput,productInput,quantityInput){
        this.customerName = customerName
        this.company = companyInput
        this.product = productInput
        this.quantity = quantityInput
    }
    
}

function createList (customerName, companyInput,productInput,quantityInput){
    let storeItems = new ToBuyList(customerName,companyInput,productInput,quantityInput)
    data.push(storeItems)
    localStorage.setItem('list',JSON.stringify(data))
    addList()
}
function addList(){
    let list=''
    for(let n =0; n<data.length;n++){
        list+='<li class="item">'+data[n].customerName+`<button i=${n} class="delete">-</button></li>`
    }
    result.innerHTML = list
}

function nameList(){
    let obj ={
        sort:[],
        map:{}
    }
    for(let list of data){
        if(!obj.map[list.customerName]){
            obj.sort.push(list.customerName)
            obj.map[list.customerName]={
                sort:[],
                map:{}
            }
        }
        obj.sort.sort()
        let mapCompany = obj.map[list.customerName].map
        if(!mapCompany[list.company]){
            obj.map[list.customerName].sort.push(list.company)
            obj.map[list.customerName].sort.sort()
            mapCompany[list.company]={'product':[list.product],'quantity':[list.quantity]}
        }else{
            if(mapCompany[list.company].product.indexOf(list.product)>=0){
                let i = mapCompany[list.company].product.indexOf(list.product)
                mapCompany[list.company].quantity[i]+=list.quantity
            }else{
               mapCompany[list.company].product.push(list.product) 
               mapCompany[list.company].quantity.push(list.quantity)
            }
        }
    }
    return obj
}
nameList()

function totalList(){
    let obj ={
        sort:[],
        map:{}
    }
    for(let list of data){
        if(!obj.map[list.company]){
            obj.sort.push(list.company)
            obj.map[list.company]={
                sort:[],
                map:{}
            }
        }
        obj.sort.sort()
        let mapCompany = obj.map[list.company].map
        if(!mapCompany[list.product]){
            obj.map[list.company].sort.push(list.product)
            obj.map[list.company].sort.sort()
            mapCompany[list.product]={'customerName':[list.customerName],'quantity':[list.quantity]}
        }else{
            if(mapCompany[list.product].customerName.indexOf(list.customerName)>=0){
                let i = mapCompany[list.product].customerName.indexOf(list.customerName)
                mapCompany[list.product].quantity[i]+=list.quantity
            }else{
               mapCompany[list.product].customerName.push(list.customerName) 
               mapCompany[list.product].quantity.push(list.quantity)
            }
        }
    }
    console.log(obj)
    return obj
}
totalList()

