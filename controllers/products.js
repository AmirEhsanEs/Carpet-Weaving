var connection = require('../utils/database');
const controller = {};

controller.search=(req,res)=>{
    const { name } = req.query;
    const query1='SELECT * FROM products WHERE name ILIKE $1 ORDER BY id'
    const query2='SELECT * FROM products ORDER BY id';
    const value1=[`%${name}%`]
    if(name){
       connection.query(query1,value1)
          .then(result => {
             if (result.rows.length == 0) {
                return res.send({ status: 400, message: 'محصولی  یافت نشد' });
             }
             else{
                res.send({status:200,content:result.rows})
             }
             })
          .catch(error => {
             console.error(error);
             res.send({ status: 500, message: 'مشکلی برای سرور رخ داده است' });
          });  
    }
    else {
       connection.query(query2)
          .then(result => {
            res.send({status:200,content:result.rows})
         })
          .catch(error => {
             console.error(error);
             res.send({ status: 500, message: 'مشکلی برای سرور رخ داده است' });
          });  
    }
}

controller.createProduct = (req, res) => {
    const { name, price, imageUrl, description } = req.body;
    const query = 'INSERT INTO products (name,price,imageurl,description) VALUES ($1, $2, $3, $4)';
    const values = [name,price,imageUrl,description];
    if (!name || !price || !description) {
        return res.send({ status: 400, message: "نام محصول وقیمت وتوضیحات را وارد نمایید" });
    }
    connection.query(query,values)
       .then(result => {
          res.send({ status: 200, message: 'محصول با موفقیت ثبت شد' });
       })
       .catch(error => {
          console.error(error);
          res.send({ status: 500, message: 'مشکلی برای سرور رخ داده است' });
       });
 }

controller.getProduct=(req,res)=>{
    const productId = req.params.id;
    const query='SELECT * FROM products WHERE id = $1'
    const values=[productId]
    connection.query(query,values)
      .then(result => {
         if (result.rows.length == 0) {
            return res.send({ status: 400, message: 'محصولی یافت نشد' });
         }
         else{
            res.send({status:200,content:result.rows[0]})
         }
          })
      .catch(error => {
         console.error(error);
         res.send({ status: 500, message: 'مشکلی برای سرور رخ داده است' });
      });  
}

controller.editProduct=(req,res)=>{

    const productId = req.params.id;
    const { name, price, imageUrl, description } = req.body;
    const query1='SELECT * FROM products WHERE id = $1';
    const query2 = 'UPDATE products SET '+
                  'name = $1, price = $2, imageurl = $3, description = $4  WHERE id = $5';
    const values1=[productId];
    const values2 = [name,price,imageUrl,description,productId];
 

    if (!name || !price || !description) {
        return res.send({ status: 400, message: "نام محصول وقیمت وتوضیحات را وارد نمایید" });
    }   
    connection.query(query1,values1)
      .then(result => {
         if (result.rows.length == 0) {
            return res.send({ status: 400, message: 'محصول مورد نظر یافت نشد' });
         }
         connection.query(query2,values2)
          .then(result => {
                 res.send({ status: 200, content: 'محصول با موفقیت ویرایش یافت' });
                })
          .catch(error=>{
                console.error(error);
                res.send({ status: 500, message: 'مشکلی برای سرور رخ داده است' });
             });   
             })
      .catch(error => {
         console.error(error);
         res.send({ status: 500, message: 'مشکلی برای سرور رخ داده است' });
      });  
}

controller.deletProduct=(req,res)=>{
    const productId = req.params.id;
    const query1='SELECT * FROM products WHERE id = $1';
    const query2='DELETE FROM products WHERE id = $1';
    const values1=[productId]
 
    connection.query(query1,values1)
      .then(result => {
         if (result.rows.length == 0) {
            return res.send({ status: 400, message: 'محصول مورد نظر یافت نشد' });
         }
         connection.query(query2,values1)
          .then(result => {
             return res.send({ status: 200, message: ' محصول مورد نظر با موفقیت حذف شد' });
                })
          .catch(error=>{
                console.error(error);
                res.send({ status: 500, message: 'مشکلی برای سرور رخ داده است' });
             });   
             })
      .catch(error => {
         console.error(error);
         res.send({ status: 500, message: 'مشکلی برای سرور رخ داده است' });
      });
}

module.exports= controller;


