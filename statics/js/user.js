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
    console.log(searchText)
    var url = 'http://localhost:3000/users';
    if(searchText!='')
       url += '?username=' + encodeURIComponent(searchText);
    xhr.open('GET',url, true); 
    xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
       var response = JSON.parse(xhr.responseText);
       var userTableBody =document.getElementById('user-table').getElementsByTagName('tbody')[0];
       userTableBody.innerHTML = "";
       for(i=0;i<response.length;i++){
          var row='<tr>'+
                     '<td>'+response[i].id+'</td>'+
                     '<td>'+response[i].username+'</td>'+
                     '<td>'+response[i].name+'</td>'+
                     '<td>'+response[i].phonenumber+'</td>'+
                     '<td>'+response[i].email+'</td>'+
                     '<td>'+response[i].password+'</td>'+
                     '<td> <button class="delete-btn" onclick="deleteRow(this)">حذف</button>'+
                     '<button class="update-btn" onclick="updateRow(this)">ویرایش</button>' +
                     '<button class="detail-btn" onclick="detail(this)">جزئیات</button> </td>'+
                  '</tr>' 
          userTableBody.innerHTML+=row;        
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

function validatePersianName(name) {
        return name.length >= 6 && name.length <=20;
      }
    
function validateUsername(username) {
        var regex = /^[a-zA-Z0-9_]+$/;
        return regex.test(username) && username.length >= 6 && username.length <=20;;
      }
function validateEmail(email) {
        var regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
      }
function validatePassword(password) {
        return password.length >= 8 && password.length <=32;
      }  
function validateTelephone(telephone) {
        var regex = /^09\d{9}$/;
        return regex.test(telephone);    
      }
    
function checkvalidate(cells){

    if(!validatePersianName(cells[2].innerHTML))
        Swal.fire({
            text: "نام وارد شده باید حداقل 6 کاراکتر و حداکثر 20 کاراکتر باشد",
            icon: "warning",
            confirmButtonText: "بازگشت",
            confirmButtonColor: "#3085d6",
        });
    else if(!validateUsername(cells[1].innerHTML))
        Swal.fire({
            text: "نام کاربری وارد شده باید حداقل 6 کاراکتر و حداکثر 20 کاراکتر باشد "+
                 " و شامل حروف بزرگ وکوچک واعداد انگلیسی و _ باشد",
            icon: "warning",
            confirmButtonText: "بازگشت",
            confirmButtonColor: "#3085d6",
        });
    else if(!validateEmail(cells[4].innerHTML))
        Swal.fire({
            text: "فرمت ایمیل وارد شده صحیح نیست",
            icon: "warning",
            confirmButtonText: "بازگشت",
            confirmButtonColor: "#3085d6",
        });       

    else if(!validatePassword(cells[5].innerHTML))
        Swal.fire({
            text: "رمز عبور وارد شده باید حداقل 8 کاراکتر و حداکثر 32 کاراکتر باشد",
            icon: "warning",
            confirmButtonText: "بازگشت",
            confirmButtonColor: "#3085d6",
        });
    else if(!validateTelephone(cells[3].innerHTML))
        Swal.fire({
            text: "شماره تلفن باید با 09 شروع شود وشامل 11 رقم باشد",
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
            title: "آپدیت کاربر",
            text: "آیااز آپدیت کاربر اطمینان دارید؟",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "آپدیت",
            cancelButtonText: 'لغو',
        }).then((result) => {
            if (result.isConfirmed) { 
                var xhr = new XMLHttpRequest();
                url='http://localhost:3000/users/'+cells[0].innerHTML;
                xhr.open('PUT',url,true);
                xhr.setRequestHeader('Content-Type', 'application/json');
                var userData = {
                    username:cells[1].innerHTML,
                    password:cells[5].innerHTML,
                    name:cells[2].innerHTML,
                    phonenumber:cells[3].innerHTML,
                    email:cells[4].innerHTML
                };      
                xhr.onload = function() {
                    if (xhr.status === 200) {   
                        var response=JSON.parse(xhr.responseText) 
                        console.log(xhr.status)
                        if(response.status==400){
                            Swal.fire({
                                text: "این نام کاربری تکراری است",
                                icon: "warning",
                                confirmButtonText: "بازگشت",
                                confirmButtonColor: "#3085d6",
                            });
                        }
                        else{
                            Swal.fire({
                                title: "آپدیت کاربر",
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
                                }
                                else {
                                    Swal.fire({
                                        icon: "error",
                                        text: JSON.parse(xhr.responseText).error
                                    });}};
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
        title: "حذف کاربر",
        text: "از حذف کاربر اطمینان دارید؟",
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
            xhr.open('DELETE', 'http://localhost:3000/users/' + id);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.onload = function() {
                if (xhr.status === 200) {
                    Swal.fire({
                        title: "حذف کاربر",
                        text: "کاربر با موفقیت حذف شد",
                        icon: "success"
                    });
                row.parentNode.removeChild(row);    
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
    var url = 'http://localhost:3000/users/'+encodeURIComponent(id);
    xhr.open('GET',url, true); 
    xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
       var response = JSON.parse(xhr.responseText);
       Swal.fire({
        title: 'اطلاعات کاربر',
        html: `<div>
                  <div class="detail-row"> 
                    شناسه: <strong>${response.id}</strong>
                  </div>
                  <div class="detail-row"> 
                    نام کاربری: <strong>${response.username}</strong>
                  </div>
                  <div class="detail-row"> 
                 نام: <strong>${response.name}</strong>
                  </div>
                  <div class="detail-row"> 
                  ایمیل: <strong>${response.email}</strong>
                  </div>
                  <div class="detail-row"> 
                  رمز عبور: <strong>${response.password}</strong>
                  </div>
                  <div class="detail-row"> 
                  تلفن: <strong>${response.phonenumber}</strong>
                  </div>
                 </div>`,
        icon: 'info'
      });

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