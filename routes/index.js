var express = require('express');
var router = express.Router();
var client = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017/tasks';


/* GET Userlist page. */
router.get('/userlist', function(req, res) {
    var db = require("../db");
    var Users = db.Mongoose.model('tasks', db.UserSchema, 'tasks');
    Users.find({}).lean().exec(
       function (e, docs) {
          res.render('userlist', { "userlist": docs });
    });
 });

 /* GET New User page. */
 router.get('/cadastro', function(req, res) {
  res.render('cadastro', { title: 'Add New User' });
  });

  /* POST to Add User Service */
router.post('/adduser', (req, res) => {
      
  if (req.body.password !== req.body.copassword) {
    var err = new Error('Senha não confere');
    err.status = 400;
    res.send("Senha não confere");
    return next(err);
  }
    var userName = req.body.username;
    var userEmail = req.body.useremail;
    var password = req.body.password;

    var task = {
        username: userName,
        email: userEmail,
        password: password,
    };

        console.log(task);
client.connect(url, { useNewUrlParser: true }, (err, client) => {
    if (err) throw err; 
    /**
     * No caso com o mongo e o driver mongo a resposta para se cadastrar e simples,
     * se nao tiver o registro dentro do banco se responde null ou seja
     * if(result != null) => Aqui se tiver algo no banco ele devolve uma call back de erro direto pro hbs
     * if(result == null) => Quer dizer que se nao tiver nada no banco pode cadastrar
     */
    if (!err) {
        var db = client.db('tasks');
        db.collection('tasks').findOne({ email: userEmail }, (err, result) => {
            {
                if (err) throw err;
                
                if (!err) {
                    
                    if (result == null) {

                        db.collection('tasks').insertOne(task, (err) => {
                            if (err) throw err;
                            if (!err) {
                                console.log("deu certo");
                                res.redirect('/login');
                                res.cookie('NewUser', task);
                                client.close();
                            }
                        });
                    }   
                        if (result != null) {
                            client.close();
                            console.log(result);
                            res.send("email ja cadastrado");
                            res.render('cadastro', { userError: "E-mail ja cadastrados" });
                        }
                }
            }
        });
    }
  });
});



router.post('/login', (req, res) => {
  var email = req.body.useremail;
  var password = req.body.password;


  client.connect(url, { useNewUrlParser: true }, (err, client) => {
      if (err)throw err;

      if (!err) {
        var db = client.db('tasks');
        db.collection('tasks').findOne({ email: email, password: password }, (err, result) => {
            {
                if (err) throw err;
                
                if (!err) {
                    
                    if (result !== null) {
                      var json = JSON.stringify(result);
                      var temp = JSON.parse(json);
                      console.log(temp);
                        if(temp.email === email && temp.password === password){
                          console.log("logado");
                          res.redirect('/admin');
                        } else {
                          client.close();
                          console.log(result);
                          res.send("email ou senha inválido");
                          res.render('cadastro', { userError: "E-mail ja cadastrados" });
                        }                       
                    } else {
                          client.close();
                          console.log(result);
                          res.send("email ou senha inválido");
                          res.render('cadastro', { userError: "E-mail ja cadastrados" });
                        }
                }
            }
        });
    }
});
});

 /* GET Admin page. */
 router.get('/admin', function(req, res) {
  res.render('admin', { title: 'Add New User' });
  });
      /*if(!err){
          var db = client.db('tasks');
          db.collection('tasks').findOne({ email: email }, (err, result) => {
              console.log("deu certo");
              if (err) throw err;
              if (!err) {
                  var json = JSON.stringify(result);
                  var temp = JSON.parse(json);
                  console.log(temp);
                  if ((temp.email === email) && (temp.password === password)) {
                      res.cookie("tasks", result);
                      console.log("logado");
                      res.redirect('/');
                  } else {
                      res.render('login', { message: 'Usuario ou senha INCORRETO' });
                      client.close();
                  }

              }
          });
      }
  });
});
*/

        /*
        if (req.body.email && req.body.username && req.body.password && req.body.copassword) {


        
        var Users = db.Mongoose.model('tasks', db.UserSchema, 'tasks');
        var user = new Users({ username: userName, email: userEmail, password: password });
        
               
          User.create(userData, function (error, user) {
            if (error) {
              return next(error);
            } else {
              req.session.userId = user._id;
              return res.redirect('/');
            }
          });
      
        } else if (req.body.logemail && req.body.logpassword) {
          User.authenticate(req.body.logemail, req.body.logpassword, function (error, user) {
            if (error || !user) {
              var err = new Error('Wrong email or password.');
              err.status = 401;
              return next(err);
            } else {
              req.session.userId = user._id;
              return res.redirect('/');
            }
          });
        } else {
          var err = new Error('All fields required.');
          err.status = 400;
          res.send("ERRO AQUI!!!")
          return next(err);
        }
      })
});

 /*     // confirm that user typed same password twice
  if (req.body.password !== req.body.copassword) {
    var err = new Error('Passwords do not match.');
    err.status = 400;
    res.send("passwords dont match");
    return next(err);
  }
  
    var userName = req.body.username;
    var userEmail = req.body.useremail;
    var password = req.body.password;

    var Users = db.Mongoose.model('tasks', db.UserSchema, 'tasks');
    var user = new Users({ username: userName, email: userEmail, password: password });
    user.save(function (err) {
        if (err) {
            console.log("Error! " + err.message);
            return err;
        }
        else {
            console.log("Post saved");
            res.redirect("userlist");
        }
    });
});
*/

 /* GET Login page. */
 /*router.get('/login', function(req, res) {
    res.render('login', { title: 'login' });
    });*/

module.exports = router;
