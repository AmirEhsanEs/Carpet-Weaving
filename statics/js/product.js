window.onload = initial;

function initial(){
    createTable()
}
function empty(){
    var searchText=document.getElementsByClassName("search-text")[0].value;
    console.log(searchText)
    if(searchText=='')
       createTable()
}
function createTable() {
    var xhr = new XMLHttpRequest();
    var searchText=document.getElementsByClassName("search-text")[0].value;
    var url = 'http://localhost:3000/products';
    if(searchText!='')
       url += '?name=' + encodeURIComponent(searchText);
    xhr.open('GET',url, true); 
    xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
       var response = JSON.parse(xhr.responseText);
       if(response.status==400){
          Swal.fire({
             text: "محصولی یافت نشد",
             icon: "info",
             confirmButtonText: "بازگشت",
             confirmButtonColor: "#3085d6",
          });
       }
       else{
        var productTableBody =document.getElementById('product-table').getElementsByTagName('tbody')[0];
        productTableBody.innerHTML = "";
        for(i=0;i<response.content.length;i++){
            var row='<tr>'+
                        '<td>'+response.content[i].id+'</td>'+
                        '<td>'+response.content[i].name+'</td>'+
                        '<td>'+response.content[i].price+'</td>'+
                        '<td>'+response.content[i].description+'</td>'+
                        '<td> <button class="delete-btn" onclick="deleteRow(this)">حذف</button>'+
                        '<button class="update-btn" onclick="updateRow(this)">ویرایش</button>' +
                        '<button class="detail-btn" onclick="detail(this)">جزئیات</button> </td>'+
                    '</tr>' 
            productTableBody.innerHTML+=row;   
        }     
       }
      }
      };
    xhr.onerror = function() {
        Swal.fire({
            icon: "error",
            text: xhr.responseJSON.error
        });
       };    
    xhr.send();
    }
  
function updateRow(button) {
    var row = button.parentNode.parentNode;
    var cells = row.getElementsByTagName("td");
    
    for (var i = 1; i < cells.length - 1; i++) {
           cells[i].setAttribute("contenteditable", "true");         
            }
    button.innerHTML = "ثبت";
    button.classList.add("ok-button");
    cells[1].focus()
    button.onclick = function() { 
        saveChanges(this); };
    }


function validateName(name) {
    return name.length >= 6 && name.length <=20;
      }
    
function validatePrice(price) {
    var regex = /^\d+(\.\d{1,2})?$/;
    return regex.test(price);
      }
    
function validateDescription(description) {
    return description.length >= 10 && description.length <=60;
      }
    
function checkvalidate(cells){
    if(!validateName(cells[1].innerHTML))
      Swal.fire({
        text: "نام وارد شده باید حداقل 6 کاراکتر و حداکثر 20 کاراکتر باشد",
        icon: "warning",
        confirmButtonText: "بازگشت",
        confirmButtonColor: "#3085d6",
    });
    else if(!validatePrice(cells[2].innerHTML))
        Swal.fire({
            text: "قیمت وارد شده در فرمت صحیح و عددی نیست",
            icon: "warning",
            confirmButtonText: "بازگشت",
            confirmButtonColor: "#3085d6",
        });

    else if(!validateDescription(cells[3].innerHTML))
        Swal.fire({
            text: "توضیحات باید حداقل شامل 10 کاراکتر و حداکثر 60 کاراکتر باشد",
            icon: "warning",
            confirmButtonText: "بازگشت",
            confirmButtonColor: "#3085d6",
    });       
   else {
       return true
    }    
}    

function saveChanges(button) { 
    var row = button.parentNode.parentNode;
    var cells = row.getElementsByTagName("td");
    if(checkvalidate(cells)){  
        Swal.fire({
            title: "آپدیت محصول",
            text: "آیااز آپدیت محصول اطمینان دارید؟",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "آپدیت",
            cancelButtonText: 'لغو',
        }).then((result) => {
            if (result.isConfirmed) { 
                var xhr = new XMLHttpRequest();
                url='http://localhost:3000/products/'+cells[0].innerHTML;
                xhr.open('PUT',url,true);
                xhr.setRequestHeader('Content-Type', 'application/json');
                var userData = {
                    name:cells[1].innerHTML,
                    price:cells[2].innerHTML,
                    imageurl:'',
                    description:cells[3].innerHTML,
                };      
                xhr.onload = function() {
                    if (xhr.status === 200) {   
                        var response=JSON.parse(xhr.responseText) 
                        if(response.status==200){
                            Swal.fire({
                                title: "آپدیت محصول",
                                text: "آپدیت با موفقیت انجام شد",
                                icon: "success"
                            });
                            for (var i = 1; i < cells.length - 1; i++) {
                                cells[i].setAttribute("contenteditable", "false");
                            }
                            button.classList.remove("ok-button");
                            button.innerHTML = "ویرایش";
                            button.onclick = function() { updateRow(this); };      
                                }
                        else {
                            Swal.fire({
                                icon: "error",
                                text: JSON.parse(xhr.responseText).error
                                    });}
                                };
                            };
                xhr.onerror = function() {
                    Swal.fire({
                        icon: "error",
                        text: "An error occurred while making the request"
                    });
                };
                xhr.send(JSON.stringify(userData));         
            }
});
}
}

function deleteRow(button){
    Swal.fire({
        title: "حذف محصول",
        text: "از حذف محصول اطمینان دارید؟",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "حذف",
        cancelButtonText: 'لغو',
    }).then((result) => {
        if (result.isConfirmed) {
            var row = button.parentNode.parentNode;
            var id = row.getElementsByTagName("td")[0].innerHTML
            var xhr = new XMLHttpRequest();
            xhr.open('DELETE', 'http://localhost:3000/products/' + id);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.onload = function() {
                if (xhr.status === 200) {
                    var response=JSON.parse(xhr.responseText) 
                    console.log(response)
                    if(response.status==200){
                        Swal.fire({
                            title: "حذف محصول",
                            text: "محصول با موفقیت حذف شد",
                            icon: "success"
                        });
                        row.parentNode.removeChild(row);   
                    }
                } else {
                    Swal.fire({
                        icon: "error",
                        text: JSON.parse(xhr.responseText).error
                    });
                }
            };
            xhr.onerror = function() {
                Swal.fire({
                    icon: "error",
                    text: "An error occurred while making the request"
                });
            };
            xhr.send();
        }
    });
}

function detail(button){
    var row = button.parentNode.parentNode;
    var id = row.getElementsByTagName("td")[0].innerHTML
    var xhr = new XMLHttpRequest();
    var url = 'http://localhost:3000/products/'+encodeURIComponent(id);
    xhr.open('GET',url, true); 
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
        var response = JSON.parse(xhr.responseText);
        console.log(response.content)
        if(response.status){
            Swal.fire({
                title: 'اطلاعات محصول',
                html: `<div>
                        <div style="direction: rtl"> 
                        <img  src=" ${response.content.imageurl}" alt="">
                        </div>
                        <div style="direction: rtl"> 
                        شناسه: <strong>${response.content.id}</strong>
                        </div>
                        <divstyle="direction: rtl"> 
                        نام: <strong>${response.content.name}</strong>
                        </div>
                        <div style="direction: rtl"> 
                        قیمت: <strong>${response.content.price}</strong>
                        </div>
                        <div style="direction: rtl"> 
                        توضیحات: <strong>${response.content.description}</strong>
                        </div>
                        </div>
                        `,
            });
        }
        }
        };
    xhr.onerror = function() {
        Swal.fire({
            icon: "error",
            text: xhr.responseJSON.error
        });
       };    
    xhr.send();
}