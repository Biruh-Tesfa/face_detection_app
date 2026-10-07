// const express = require('express');
// const bcrypt = require('bcrypt');
// const cors = require('cors');
// const knex = require('knex');
// const path = require('path');

// const db = knex({
//   client: 'pg',
//   connection: process.env.DATABASE_URL,   // use Render’s environment variable
//   ssl: { rejectUnauthorized: false }      // required for Render PostgreSQL
// });

// const app = express();
// app.use(cors());
// app.use(express.json());

// // --- API ROUTES ---

// app.post('/register', (req, res) => {
//   const { name, email, password } = req.body;
//   const hash = bcrypt.hashSync(password, 10);

//   db.transaction(trx => {
//     trx.insert({ hash, email })
//       .into('login')
//       .returning('email')
//       .then(loginEmail => {
//         return trx('users')
//           .returning('*')
//           .insert({
//             name,
//             email: loginEmail[0].email,
//             joined: new Date(),
//           })
//           .then(user => res.json(user[0]));
//       })
//       .then(trx.commit)
//       .catch(trx.rollback);
//   })
//   .catch(err => res.status(400).json("unable to register"));
// });

// app.post('/signin', (req, res) => {
//   const { email, password } = req.body;
//   db.select('email', 'hash').from('login')
//     .where('email', '=', email)
//     .then(data => {
//       const isValid = bcrypt.compareSync(password, data[0].hash);
//       if (isValid) {
//         return db.select('*').from('users')
//           .where('email', '=', email)
//           .then(user => res.json(user[0]))
//           .catch(err => res.status(400).json('unable to get user'));
//       } else {
//         res.status(400).json('wrong credentials');
//       }
//     })
//     .catch(err => res.status(400).json('wrong credentials'));
// });

// app.get('/profile/:id', (req, res) => {
//   const { id } = req.params;
//   db.select('*').from('users').where({ id })
//     .then(response => {
//       if (response.length) {
//         res.json(response);
//       } else {
//         res.status(400).json("no such user");
//       }
//     });
// });

// app.put('/image', (req, res) => {
//   const { id } = req.body;
//   db('users').where('id', '=', id)
//     .increment('entrie', 1)
//     .returning('entrie')
//     .then(response => res.json(response[0].entrie))
//     .catch(err => res.status(400).json("no such user"));
// });

// // Serve React frontend
// app.use(express.static(path.join(__dirname, "frontend/build")));
// app.get(/.*/, (req, res) => {
//   res.sendFile(path.join(__dirname, "frontend/build", "index.html"));
// });

// // --- Start server ---
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });
require("dotenv").config();
const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const cors = require('cors');
const knex = require('knex');


const db = knex({
  client: "pg",
  connection: process.env.DATABASE_URL,
});

const app=express();
app.use(cors())
app.use(express.json())
// app.use(express.urlencoded({extended:true}))  FOR HTML REQUIST

app.post('/register',(req,res)=>{
 const {name,email,password}=req.body;

// bcrypt.hash(password, 10, (err, hash) => {
//   if (err) {return res.status(500).json("Error hashing password");}
//    console.log(hash);  });
const hash = bcrypt.hashSync(password,10); // synchronous

  db.transaction(trx=>{
    trx.insert({
      hash:hash,
      email:email
    })
    .into('login')
    .returning('email')
    .then(loginEmail=>{
         return trx('users')
        .returning('*')
        .insert({
              name:name,
              email:loginEmail[0].email,
              joined: new Date(),
         })
        .then( user=>  res.json(user[0]) ) 
     })
    .then(()=>trx.commit())
    .catch(()=>trx.rollback());
  })
      .catch(err=>res.status(400).json("unable to register"));
    })

app.post('/signin',(req,res)=>{
 const {email,password}=req.body;

// bcrypt.compare("bannana", hash, (err, result) => {
//   if (err) throw err;
//   console.log("First comparison:", result); //(Asynchronous) true if "bannana" was the original password
// });
db.select('email','hash').from('login')
.where('email','=',email)
.then(data=>{
  const isvalid = bcrypt.compareSync(password,data[0].hash);
  if(isvalid){
    return db.select('*').from('users')
      .where('email','=',email)
      .then(user=>{
          res.json(user[0])
        })
      .catch(err=> res.status(400).json('unable to get user'))
    } else {
     res.status(400).json('wrong credentials')
    }
  })
   .catch(err=> res.status(400).json('wrong credentials'))
})

app.get('/profile/:id',(req,res)=>{
	const{id}=req.params;

db.select('*').from('users').where({
      id:id  // 'ID','=',ID WITHOUT {}
  }).then(response=>{
  	if(response.length){
  	 res.json(response)
  	}else{
  		res.status(400).json("no such user")
  	}
  })   
})

app.put('/image',(req,res)=>{

const { id } = req.body;

  db('users').where('id','=',id)
  .increment('entrie',1)
  .returning('entrie')
  .then(response=>{res.json(response[0].entrie)})
  .catch(err=>{res.status(400).json("no such user")})   
})

const port = process.env.PORT || 3000;

app.listen(port, "0.0.0.0", () => {
  console.log(`Backend running on port ${port}`);
});