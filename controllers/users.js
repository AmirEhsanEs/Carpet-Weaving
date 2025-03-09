var connection = require('../utils/database');
const controller = {};


controller.search=(req,res)=>{
   const { username } = req.query;
   const query1='SELECT * FROM users WHERE username ILIKE $1'
   const query2='SELECT * FROM users ORDER BY id ASC'
   const value1=[`%${username}%`]
   if(username){
      connection.query(query1,value1)
         .then(result => {
            if (result.rows.length == 0) {
               return res.send({ status: 400, message: 'کاربری یافت نشد' });
            }
            else{
               res.json(result.rows)
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
            res.json(result.rows)
            })
         .catch(error => {
            console.error(error);
            res.send({ status: 500, message: 'مشکلی برای سرور رخ داده است' });
         });  
   }
}
controller.createUser = (req, res) => {
   const { username, password, name, phonenumber, email } = req.body;
   const query1='SELECT * FROM users WHERE username = $1';
   const value1=[username];
   const query2 = 'INSERT INTO users (username, password, name, phonenumber, email) VALUES ($1, $2, $3, $4, $5)';
   const values2 = [username, password, name, phonenumber, email];
   if (!username || !password || !name) {
      return res.send({ status: 400, message: "نام کاربری و پسورد و نام خود را وارد کنید" });
   }
   connection.query(query1,value1)
      .then(result => {
         if (result.rows.length > 0) {
            return res.send({ status: 400, message: "این نام کاربری قبلا ثبت شده است" });
         }
         connection.query(query2, values2)
            .then(() => {
               res.send({ status: 200, message: 'کاربر با موفقیت ثبت شد' });
            })
            .catch(error => {
               console.error(error);
               res.send({ status: 500, message: 'مشکلی برای سرور رخ داده است' });
            });
      })
      .catch(error => {
         console.error(error);
         res.send({ status: 500, message: 'مشکلی برای سرور رخ داده است' });
      });
}
controller.getUser=(req,res)=>{
   const userId = req.params.id;
   const query='SELECT * FROM users WHERE id = $1'
   const values=[userId]
   connection.query(query,values)
     .then(result => {
        if (result.rows.length == 0) {
           return res.send({ status: 400, message: 'کاربری یافت نشد' });
        }
        else{
           res.json(result.rows[0])
        }
         })
     .catch(error => {
        console.error(error);
        res.send({ status: 500, message: 'مشکلی برای سرور رخ داده است' });
     });  
}
controller.editUser=(req,res)=>{
   const userId = req.params.id;
   const {username, password, name, phonenumber, email} = req.body;
   const query1='SELECT * FROM users WHERE id = $1';
   const query2='SELECT id FROM users WHERE username = $1';
   const query3 = 'UPDATE users SET'+
                 ' username = $1, password = $2, name = $3, phoneNumber = $4, email = $5 WHERE id = $6'
   const values1=[userId]
   const values2=[username];               
   const values3 = [username, password, name, phonenumber, email,userId];

   if (!username || !password || !name) {
      return res.send({ status: 400, message: "نام کاربری و پسورد و نام خود را وارد کنید" });
     }

   connection.query(query1,values1)
     .then(result => {
        if (result.rows.length == 0) {
           return res.send({ status: 401, message: 'کاربری یافت نشد' });
        }
        connection.query(query2,values2)
         .then(result => {
               if(result.rows[0] && result.rows[0].id!=userId){
                  return res.send({ status: 400, message: 'این نام کاربری قبلا ثبت شده است' });
               }
               connection.query(query3, values3)
                  .then(() => {
                     res.send({ status: 200, message: 'کاربر با موفقیت ثبت شد' });
                  })
                  .catch(error => {
                     console.error(error);
                     res.send({ status: 500, message: 'مشکلی برای سرور رخ داده است' });
                  });
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
controller.deletUser=(req,res)=>{
   const userId = req.params.id;
   const query1='SELECT * FROM users WHERE id = $1';
   const query2='DELETE FROM users WHERE id = $1';
   const values1=[userId]

   connection.query(query1,values1)
     .then(result => {
        if (result.rows.length == 0) {
           return res.send({ status: 400, message: 'کاربری یافت نشد' });
        }
        connection.query(query2,values1)
         .then(result => {
            return res.send({ status: 400, message: ' کاربر با موفقیت حذف شد' });
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


