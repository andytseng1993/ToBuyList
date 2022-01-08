'use strict';
let data = []

function selectFile(){
    let file = document.getElementById('chooseFile')
    let reader = new FileReader()
    if(file.files[0]){
        reader.addEventListener('load',function(event){
            const result = JSON.parse(reader.result)
            data =result
            localStorage.setItem('list',JSON.stringify(data))
            // createTotalList(customerNameList(),totalList())
        })
        reader.readAsText(file.files[0])
    }else{                                                                                                              
        alert('Please choose a file :)')
    }
    file.value = ''
}

function saveFile(){
    if(Object.keys(data).length === 0 && data.constructor === Object){
        alert('Empty')
    }else{
        let downloadBtn = document.getElementById('download')
        let dataStr = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data,null,2))
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
        else {
            let customerText = textUpper(customerName.value.trim())
            let companyText = textUpper(companyInput.value.trim())
            let productText = textUpper(productInput.value.trim())
            createList(customerText, companyText,productText,quantityInput.valueAsNumber)
        }
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

function textUpper(text){
    let changeText = text[0].toUpperCase()+text.slice(1).toLowerCase()
    return changeText
}

readList()
function readList(){
    data= JSON.parse(localStorage.getItem('list')||'[]')
    let nameList = customerNameList()
    let total =totalList()
    // createTotalList(nameList,total)
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
    let nameList = customerNameList()
    let total =totalList()
    createTotalList(nameList,total)
}
function createTotalList(nameList,total){
    nameBtn.innerHTML='<button>Total</button>'
    for(let name of nameList.sort){
        let nameBtn = document.getElementById('nameBtn')
        nameBtn.innerHTML+= `<button>${name}</button>`
    }
    let customer= `<h3 id="customerName">Total</h3>`
    let list = document.getElementById('list')
    list.innerHTML=''
    list.innerHTML+=customer
    for(let comapany of total.sort){
        list.innerHTML+=`<div id=companyName>Company: ${comapany}</div>`
        list.innerHTML+=`
        <div id="result">
            <div class="listTable ${comapany}">
                <div class="head">
                    <div>product</div>
                    <div>quantity</div>
                    <div></div>
                    <div></div>
                </div>
            </div>
        </div>
        `
        for(let product in total.map[comapany].map){
            
            let listTable=document.querySelector('.'+comapany)
            let number = total.map[comapany].map[product].quantity.reduce((pre,cur)=>pre+cur,0)
            listTable.innerHTML+= `
            <div class="productlist">
                <div>${product}</div>
                <div>${number}</div>
                <button class="edit">Edit</button>
                <button class="delete" onclick='deleteTotalBtn(this)'>&#215</button>
            </div>
            `
        }
    }
}

function customerNameList(){
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
        let mapProduct = obj.map[list.company].map[list.product]
        if(!mapCompany[list.product]){
            obj.map[list.company].sort.push(list.product)
            obj.map[list.company].sort.sort()
            mapCompany[list.product]={'customerName':[list.customerName],'quantity':[list.quantity]}
        }else{
            if(mapProduct.customerName.indexOf(list.customerName)>=0){
                let i = mapProduct.customerName.indexOf(list.customerName)
                mapProduct.quantity[i]+=list.quantity
            }else{
               mapProduct.customerName.push(list.customerName) 
               mapProduct.quantity.push(list.quantity)
            }
        }
    }
    return obj
}

function deleteTotalBtn(element){
    let productName=element.parentNode.firstElementChild.textContent
    let companyName=element.parentNode.parentNode.parentNode.previousElementSibling.textContent.split(':')[1]
    companyName = companyName.trim()
    let text = 'Do you want to delete this item?'
    if(confirm(text)){
        data = data.filter((el)=> {
            return el.company !== companyName || el.product!== productName
        })
        createTotalList(customerNameList(),totalList())
    }
    localStorage.setItem('list',JSON.stringify(data))
    console.log(data)

}
console.log(data)