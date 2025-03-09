function storeProduct(product_name,product_price,product_image,product_description){
    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://localhost:3000/products');
    xhr.setRequestHeader('Content-Type', 'application/json');
    var productData = {
        name:product_name,
        price:product_price,
        imageUrl:product_image,
        description:product_description,
      };         
    xhr.onload = function() {
        console.log(xhr.status)
        if (xhr.status == 200) {   
            Swal.fire({
                title: "ایجاد محصول",
                text: "محصول با موفقیت اضافه شد",
                icon: "success"
                });     
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
    xhr.send(JSON.stringify(productData));
}

function validateName(name) {
    return name.length >= 6 && name.length <=20;
  }

function validateImage(file) {
    if(file)
      return (file.type.startsWith('image/')); 
    else
      return true
  }
  function validateFileSize(file, maxSize) {
    return file.size <= maxSize;
}

function validatePrice(price) {
    var regex = /^\d+(\.\d{1,2})?$/;
    return regex.test(price);
  }

function validateDescription(description) {
    return description.length >= 10 && description.length <=60;
  }

function validateForm(){
    var name=document.getElementById("product-name").value;
    var price = document.getElementById("product-price").value;
    var input = document.getElementById('product-image');
    var file = input.files[0];
    var description = document.getElementById("product-description").value;
 
    if(!validateName(name))
        Swal.fire({
            text: "نام وارد شده باید حداقل 6 کاراکتر و حداکثر 20 کاراکتر باشد",
            icon: "warning",
            confirmButtonText: "بازگشت",
            confirmButtonColor: "#3085d6",
        });
    else if(!validatePrice(price))
        Swal.fire({
            text: "قیمت وارد شده در فرمت صحیح و عددی نیست",
            icon: "warning",
            confirmButtonText: "بازگشت",
            confirmButtonColor: "#3085d6",
        });
    else if(!validateImage(file))
        Swal.fire({
            text: "فایل انتخابی باید در فرمت تصویر باشد",
            icon: "warning",
            confirmButtonText: "بازگشت",
            confirmButtonColor: "#3085d6",
        });    
    else if(!validateFileSize(file,60000))
        Swal.fire({
            text: "سایز تصویر باید کمتر از 60 کیلوبایت باشد",
            icon: "warning",
            confirmButtonText: "بازگشت",
            confirmButtonColor: "#3085d6",
        });        
    else if(!validateDescription(description))
        Swal.fire({
            text: "توضیحات باید حداقل شامل 10 کاراکتر و حداکثر 60 کاراکتر باشد",
            icon: "warning",
            confirmButtonText: "بازگشت",
            confirmButtonColor: "#3085d6",
        });       
    else { 
            if(file){
                  var reader = new FileReader();
                  reader.onload = function() {
                     var base64Image = reader.result;
                     storeProduct(name, price,base64Image,description);
                    };
                  reader.readAsDataURL(file);
            }
            else{
                storeProduct(name, price,'',description);
            }
          
       }    
  }
  
  