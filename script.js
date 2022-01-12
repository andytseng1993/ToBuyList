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
            for(let product of total.map[comapany].sort){
                let listTable=document.querySelector('.'+comapany)
                let number = total.map[comapany].map[product].quantity.reduce((pre,cur)=>pre+cur,0)
                listTable.innerHTML+= `
                <div class="productlist ${comapany} ${product}">
                    <button class="add" onclick='addBtn(this)' company='${comapany}'>+add</button>
                    <div>${product}</div>
                    <div>${number}</div>
                    <input type="checkbox" class="detailBtn" id="${comapany+product}" onclick='addOpenDetail(this)'>
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
    let productListSelect=element.parentNode.parentNode.parentNode.getAttribute('class').split(' ')
    let companyName= productListSelect[1].trim()
    let productName= productListSelect[2].trim()
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
    let productListSelect = selectBtn.parentNode.parentNode.getAttribute('class').split(' ')
    let companyName= productListSelect[1].trim()
    let productName= productListSelect[2].trim()
    let customerValue = selectBtn.firstElementChild.firstElementChild.value.trim()
    customerValue=textFirstUpper(customerValue)
    let quantityValue= selectBtn.children[1].firstElementChild.valueAsNumber
    if(oldQuantity!==quantityValue || encodeName!== customerValue){
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

function addBtn(element){
    let addBtnClass = element.parentNode.getAttribute('class').split(' ')
    let companyName = addBtnClass[1].trim()
    let productName = addBtnClass[2].trim()
    let checkBoxId = companyName+productName
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