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
            createTotalList(customerNameList(),totalList())
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
            let customerText = textFirstUpper(customerName.value.trim())
            let companyText = textFirstUpper(companyInput.value.trim())
            let productText = textFirstUpper(productInput.value.trim())
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

function textFirstUpper(text){
    let changeText = text[0].toUpperCase()+text.slice(1).toLowerCase()
    return changeText
}

readList()
function readList(){
    data= JSON.parse(localStorage.getItem('list')||'[]')
    let nameList = customerNameList()
    let total =totalList()
    createTotalList(nameList,total)
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
    if(total.sort.length > 0){
        let nameBtn = document.getElementById('nameBtn')
        nameBtn.innerHTML='<button>Total</button>'
        for(let name of nameList.sort){
            nameBtn.innerHTML+= `<button>${name}</button>`
        }
        let customer= `<h3 id="customerName">All Shopping List</h3>`
        let list = document.getElementById('list')
        list.innerHTML=''
        list.innerHTML+=customer
        for(let comapany of total.sort){
            list.innerHTML+=`
            <div class='companyName'>Company: ${comapany}
                <button class="delete" onclick='deleteCompanyBtn(this)' company='${comapany}'>&#215</button>
            </div>
            `
            list.innerHTML+=`
            <div class="result">
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
            let index = 0
            for(let product of total.map[comapany].sort){
                let listTable=document.querySelector('.'+comapany)
                let number = total.map[comapany].map[product].quantity.reduce((pre,cur)=>pre+cur,0)
                listTable.innerHTML+= `
                <div class="productlist ${comapany} ${product}">
                    <div>${product}</div>
                    <div>${number}</div>
                    <input type="checkbox" class="detailBtn" id="${comapany+product}">
                    <label for="${comapany+product}"><span class="down"></span></label>
                    <button class="delete" onclick='deleteTotalBtn(this)'>&#215</button>
                </div>`
                let customer = total.map[comapany].map[product].customerName
                let qty = total.map[comapany].map[product].quantity
                let productlist=document.querySelector('.productlist.'+comapany+'.'+product)
                let detailList= `<div class="detail">`
                for(let i=0;i<customer.length;i++){
                    let customerDetail = `
                    <div class="customerDetail">
                        <div>${customer[i]}</div>
                        <div>${qty[i]}</div>
                        <button class="edit" onclick='editBtn(this)' index='${index++}'>Edit</button>
                        <button class="delete" onclick='deleteDetailBtn(this)'>&#215</button>
                    </div>
                    `
                    detailList+= customerDetail
                }
                productlist.innerHTML+= detailList
            }
        }
    }else{
        nameBtn.innerHTML='Please submit the form :)'
        list.innerHTML=''
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
               mapProduct.customerName.sort()
               let n = mapProduct.customerName.indexOf(list.customerName)
               mapProduct.quantity.splice(n,0,list.quantity)
            }
        }
    }
    return obj
}

function deleteTotalBtn(element){
    let productListSelect=element.parentNode.getAttribute('class').split(' ')
    let companyName = productListSelect[1].trim()
    let productName=productListSelect[2].trim()
    let text = `Do you want to delete all ${productName}?`
    if(confirm(text)){
        data = data.filter((el)=> {
            return el.company !== companyName || el.product!== productName
        })
        createTotalList(customerNameList(),totalList())
    }
    localStorage.setItem('list',JSON.stringify(data))
}
function deleteDetailBtn(element){
    let customerName=element.parentNode.firstElementChild.textContent
    let productListSelect=element.parentNode.parentNode.parentNode.getAttribute('class').split(' ')
    let companyName= productListSelect[1].trim()
    let productName= productListSelect[2].trim()
    let checkBoxId = companyName+productName
    let text = `Do you want to delete this item?`
    if(confirm(text)){
        new Promise(function(resolve,reject){
            data = data.filter((el)=> {
                return el.company !== companyName || el.product!== productName || el.customerName !== customerName
            })
            resolve(data)
        }).then(function(){
            createTotalList(customerNameList(),totalList())
        }).then(function(){
            let checkbox= document.getElementById(checkBoxId)
            if(checkbox){
                checkbox.checked = true
            }
        })
    }
    localStorage.setItem('list',JSON.stringify(data))
}
function editBtn(element){
    let index = element.getAttribute('index')
    let selectBtn = document.querySelectorAll('.customerDetail')[index]
    let customer= selectBtn.firstElementChild
    let quantity= selectBtn.children[1]
    let customerName = customer.textContent
    customer.innerHTML=`<input type="text" style='text-align: center;'>`
    let customerSelect = selectBtn.firstElementChild.firstElementChild
    customerSelect.setAttribute('value',customerName)
    customerSelect.focus()
    quantity.innerHTML=`<input type="number" style='width: 60px; text-align: center;' value='${quantity.textContent}'>`
    element.textContent = 'Done'
    let encode = encodeURI(`${customerName}`)
    element.setAttribute('onclick','doneEdit(this,"'+encode+'")')
}

function doneEdit(element,encodeName){
    let index = element.getAttribute('index')
    encodeName = decodeURI(encodeName)
    let selectBtn = document.querySelectorAll('.customerDetail')[index]
    let productListSelect = selectBtn.parentNode.parentNode.getAttribute('class').split(' ')
    let companyName= productListSelect[1].trim()
    let productName= productListSelect[2].trim()
    let checkBoxId = companyName+productName
    let customerValue = selectBtn.firstElementChild.firstElementChild.value.trim()
    customerValue=textFirstUpper(customerValue)
    let quantityValue= selectBtn.children[1].firstElementChild.valueAsNumber

    new Promise(function(resolve,reject){
        data = data.filter((el)=> {
            return el.company !== companyName || el.product!== productName || el.customerName !== encodeName
        })
        resolve(data)
    }).then(function(){
        let storeItem = new ToBuyList(customerValue,companyName,productName,quantityValue)
        data.push(storeItem)
    }).then(function(){
        localStorage.setItem('list',JSON.stringify(data))
        createTotalList(customerNameList(),totalList())
    }).then(function(){
        let checkbox= document.getElementById(checkBoxId)
        if(checkbox){
            checkbox.checked = true
        }
    })
}
function deleteCompanyBtn(element){
    let companyName= element.getAttribute('company')   
    let text = `Do you want to delete all product in ${companyName}?`
    if(confirm(text)){
        data = data.filter((el)=> {
            return el.company !== companyName
        })
        createTotalList(customerNameList(),totalList())
    }
    localStorage.setItem('list',JSON.stringify(data))
}