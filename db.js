var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/tasks');
var bcrypt = require('bcrypt');
 
var userSchema = new mongoose.Schema({
     email: {
          type: String,
          unique: true,
          required: true,
          trim: true
        },
        username: {
          type: String,
          unique: true,
          trim: true
        },
        password: {
          type: String,
          required: true,
        }
 }, { collection: 'tasks' }
 );

 //authenticate input against database
userSchema.statics.authenticate = function (email, password, callback) {
     User.findOne({ email: email })
       .exec(function (err, user) {
         if (err) {
           return callback(err)
         } else if (!user) {
           var err = new Error('User not found.');
           err.status = 401;
           return callback(err);
         }
         bcrypt.compare(password, user.password, function (err, result) {
           if (result === true) {
             return callback(null, user);
           } else {
             return callback();
           }
         })
       });
   }
   
   //hashing a password before saving it to the database
   userSchema.pre('save', function (next) {
     var user = this;
     bcrypt.hash(user.password, 10, function (err, hash) {
       if (err) {
         return next(err);
       }
       user.password = hash;
       next();
     })
   });

   var User = mongoose.model('tasks', userSchema);
 
 module.exports = { Mongoose: mongoose, UserSchema: userSchema }