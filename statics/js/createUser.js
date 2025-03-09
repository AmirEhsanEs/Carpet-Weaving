function storeUser(user_name,user_username,user_email,user_password,user_phone){
    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://localhost:3000/users');
    xhr.setRequestHeader('Content-Type', 'application/json');
    var userData = {
        username:user_username,
        password:user_password,
        name:user_name,
        phonenumber:user_phone,
        email:user_email
      };         
    xhr.onload = function() {
        if (xhr.status === 200) {   
            var response=JSON.parse(xhr.responseText)  
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
                    title: "ایجاد کاربر",
                    text: "کاربر با موفقیت اضافه شد",
                    icon: "success"
                });
            }
        }
         else {
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
    xhr.send(JSON.stringify(userData));
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

function validateForm(){
    var name=document.getElementById("user-name").value;
    var username = document.getElementById("user-username").value;
    var email = document.getElementById("user-email").value;
    var password = document.getElementById("user-password").value;
    var telephone = document.getElementById("user-phone").value;
   
    if(!validatePersianName(name))
        Swal.fire({
            text: "نام وارد شده باید حداقل 6 کاراکتر و حداکثر 20 کاراکتر باشد",
            icon: "warning",
            confirmButtonText: "بازگشت",
            confirmButtonColor: "#3085d6",
        });
    else if(!validateUsername(username))
        Swal.fire({
            text: "نام کاربری وارد شده باید حداقل 6 کاراکتر و حداکثر 20 کاراکتر باشد "+
                 " و شامل حروف بزرگ وکوچک واعداد انگلیسی و _ باشد",
            icon: "warning",
            confirmButtonText: "بازگشت",
            confirmButtonColor: "#3085d6",
        });
    else if(!validateEmail(email))
        Swal.fire({
            text: "فرمت ایمیل وارد شده صحیح نیست",
            icon: "warning",
            confirmButtonText: "بازگشت",
            confirmButtonColor: "#3085d6",
        });       

    else if(!validatePassword(password))
        Swal.fire({
            text: "رمز عبور وارد شده باید حداقل 8 کاراکتر و حداکثر 32 کاراکتر باشد",
            icon: "warning",
            confirmButtonText: "بازگشت",
            confirmButtonColor: "#3085d6",
        });
    else if(!validateTelephone(telephone))
        Swal.fire({
            text: "شماره تلفن باید با 09 شروع شود وشامل 11 رقم باشد",
            icon: "warning",
            confirmButtonText: "بازگشت",
            confirmButtonColor: "#3085d6",
        });    
    else {
        storeUser(name,username,email,password,telephone)
       }    
  }
  
  