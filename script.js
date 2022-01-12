'use strict';
let data = []
let openDetail = []
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
    OpenDetailBox()
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
        let index = 0
        let i = 0
        for(let company of total.sort){
            let newStringcompany = removeSpecialChar(company)
            list.innerHTML+=`
            <div class='companyName'>
                <span>${company}</span>
                <button class="delete" onclick='deleteCompanyBtn(this)' company='${newStringcompany}'>&#215</button>
            </div>
            `
            list.innerHTML+=`
            <div class="result">
                <div class="listTable ${newStringcompany}">
                    <div class="head">
                        <div>product</div>
                        <div>quantity</div>
                        <div></div>
                        <div></div>
                    </div>
                </div>
            </div>
            `
            for(let product of total.map[company].sort){
                let listTable=document.querySelector('.'+newStringcompany)
                let newStringProduct = removeSpecialChar(product)
                let number = total.map[company].map[product].quantity.reduce((pre,cur)=>pre+cur,0)
                listTable.innerHTML+= `
                <div class="productlist ${newStringcompany} ${newStringProduct}">
                    <button class="add" onclick='addBtn(this)'>+add</button>
                    <div>${product}</div>
                    <div>${number}</div>
                    <input type="checkbox" class="detailBtn" id="${newStringcompany+newStringProduct}" onclick='addOpenDetail(this)'>
                    <label for="${newStringcompany+newStringProduct}"><span class="down"></span></label>
                    <button class="delete" onclick='deleteTotalBtn(this)'>&#215</button>
                </div>`
                let customer = total.map[company].map[product].customerName
                let qty = total.map[company].map[product].quantity
                let productlist=document.querySelector('.productlist.'+newStringcompany+'.'+newStringProduct)
                let detailList= `<div class="detail">`
                for(let i=0;i<customer.length;i++){
                    let customerDetail = `
                    <div class="customerDetail">
                        <div>${customer[i]}</div>
                        <div>${qty[i]}</div>
                        <button class="edit" onclick='editBtn(this)' index='${index}'>Edit</button>
                        <button class="delete" onclick='deleteDetailBtn(this)' index='${index++}'>&#215</button>
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
function removeSpecialChar(str){
    return str.replace(/[^A-Z0-9]+/ig,'_')
}

function deleteTotalBtn(element){
    
    let companyName = element.parentNode.parentNode.parentNode.previousElementSibling.firstElementChild.textContent
    let productName=element.parentNode.children[1].textContent
    console.log(companyName,productName)
    let text = `Do you want to delete all ${productName}?`
    if(confirm(text)){
        data = data.filter((el)=> {
            return el.company !== companyName || el.product!== productName
        })
        createTotalList(customerNameList(),totalList())
    }
    localStorage.setItem('list',JSON.stringify(data))
}

function addOpenDetail(element){
    let detailBtnId = element.getAttribute('id')
    let index = openDetail.indexOf(detailBtnId)
    if(index===-1){
        openDetail.push(detailBtnId)
        openDetail.sort((a, b) => a - b)
    }else{
        openDetail.splice(index,1)
    }
    OpenDetailBox()
    console.log(openDetail)
}
function OpenDetailBox(){
    for (let i = 0;i<openDetail.length;i++){
        let openDetailBox = document.getElementById(openDetail[i])
        openDetailBox.checked= true
    }
}

function deleteDetailBtn(element){
    let customerName=element.parentNode.firstElementChild.textContent
    let companyName= element.parentNode.parentNode.parentNode.parentNode.parentNode.previousElementSibling.firstElementChild.textContent
    let productName= element.parentNode.parentNode.parentNode.children[1].textContent
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
            OpenDetailBox()
        })
    }
    localStorage.setItem('list',JSON.stringify(data))
}
function editBtn(element){
    let index = element.getAttribute('index')
    let selectBtn = document.querySelectorAll('.customerDetail')[index]
    let customer= selectBtn.firstElementChild
    let quantity= selectBtn.children[1]
    let cancelBtn = selectBtn.children[3]
    let quantityValue = quantity.textContent
    let customerName = customer.textContent
    customer.innerHTML=`<input type="text" style='text-align: center;'>`
    let customerSelect = selectBtn.firstElementChild.firstElementChild
    customerSelect.setAttribute('value',customerName)
    customerSelect.focus()
    quantity.innerHTML=`<input type="number" style='width: 60px; text-align: center;' value='${quantity.textContent}' min= '1'>`
    element.textContent = 'Cancel'
    cancelBtn.textContent= 'Done'
    let encode = encodeURI(`${customerName}`)
    element.setAttribute('onclick','cancelEdit(this,"'+encode+'",'+quantityValue+')')
    element.setAttribute('class','cancel')
    cancelBtn.setAttribute('onclick','doneEdit(this,"'+encode+'",'+quantityValue+')')
    cancelBtn.setAttribute('class','done')
}

function doneEdit(element,encodeName,oldQuantity){
    let index = element.getAttribute('index')
    encodeName = decodeURI(encodeName)
    let selectBtn = document.querySelectorAll('.customerDetail')[index]
    let customer= selectBtn.firstElementChild
    let quantity= selectBtn.children[1]
    let editBtn = selectBtn.children[2]
    let companyName= selectBtn.parentNode.parentNode.parentNode.parentNode.previousElementSibling.firstElementChild.textContent
    let productName= selectBtn.parentNode.parentNode.children[1].textContent
    let customerNewName = selectBtn.firstElementChild.firstElementChild.value.trim()
    customerNewName=textFirstUpper(customerNewName)
    let quantityNewValue= selectBtn.children[1].firstElementChild.valueAsNumber
    if(oldQuantity!==quantityNewValue || encodeName!== customerNewName){
        new Promise(function(resolve,reject){
            data = data.filter((el)=> {
                return el.company !== companyName || el.product!== productName || el.customerName !== encodeName
            })
            resolve(data)
        }).then(function(){
            let storeItem = new ToBuyList(customerNewName,companyName,productName,quantityNewValue)
            data.push(storeItem)
        }).then(function(){
            localStorage.setItem('list',JSON.stringify(data))
            createTotalList(customerNameList(),totalList())
        }).then(function(){
            OpenDetailBox()
        })
    }else{
        customer.innerHTML=encodeName
        quantity.innerHTML=oldQuantity
        editBtn.textContent ='Edit'
        editBtn.setAttribute('onclick','editBtn(this)')
        element.innerHTML = '&#215'
        element.setAttribute('onclick','deleteDetailBtn(this)')
        element.setAttribute('class','delete')
    }
}
function cancelEdit(element,encodeName,oldQuantity){
    let index = element.getAttribute('index')
    encodeName = decodeURI(encodeName)
    let selectBtn = document.querySelectorAll('.customerDetail')[index]
    let customer= selectBtn.firstElementChild
    let quantity= selectBtn.children[1]
    let deletBtn = selectBtn.children[3]
    customer.innerHTML=encodeName
    quantity.innerHTML=oldQuantity
    element.innerHTML='Edit'
    element.setAttribute('onclick','editBtn(this)')
    deletBtn.innerHTML = '&#215'
    deletBtn.setAttribute('onclick','deleteDetailBtn(this)')
    deletBtn.setAttribute('class','delete')
}

function deleteCompanyBtn(element){
    let companyName= element.previousElementSibling.textContent 
    let text = `Do you want to delete all product in ${companyName}?`
    if(confirm(text)){
        data = data.filter((el)=> {
            return el.company !== companyName
        })
        createTotalList(customerNameList(),totalList())
    }
    localStorage.setItem('list',JSON.stringify(data))
}

function addBtn(element){
    let addBtnClass = element.parentNode.getAttribute('class').split(' ')
    let companyClassName = addBtnClass[1].trim()
    let productClassName = addBtnClass[2].trim()
    let companyName = element.parentNode.parentNode.parentNode.previousElementSibling.firstElementChild.textContent
    let productName = element.nextElementSibling.textContent
    let checkBoxId = companyClassName+productClassName
    let checkbox= document.getElementById(checkBoxId)
    new Promise((resolve,reject)=>{
        if(!checkbox.checked){
            addOpenDetail(checkbox)
            OpenDetailBox()
        }
        setTimeout(function(){
            resolve(true)
        },750)
    }).then(function(){
        let CustomerName = prompt(`Please enter the cutomer name you want to add in ${productName}: `);
        let quantity = 0
        if(CustomerName){
            quantity = prompt(`Please enter the quantity of ${productName}: `)
            while(quantity==='' || isNaN(quantity) || parseInt(quantity)<=0){
                quantity = prompt(`Please enter a number larger than 0 :)\nPlease enter the quantity of ${productName}: `) 
            }
            if(CustomerName!=null && quantity!=null){
                quantity = parseInt(quantity)
                CustomerName= textFirstUpper(CustomerName)
                let storeItem = new ToBuyList(CustomerName,companyName,productName,quantity)
                data.push(storeItem)
                localStorage.setItem('list',JSON.stringify(data))
                createTotalList(customerNameList(),totalList())
            }
        }else{
            return false
        }
    }).then(function(){
        OpenDetailBox() 
    })
    
}
console.log(data)