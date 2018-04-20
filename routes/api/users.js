const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt =require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const passport = require('passport');
// load user model

const User = require('../../models/User');

//@route get api/users/test
//@desc tests users route
//@access public

router.get('/test', (req,res)=>{
    res.json({msg:"Users Works"})
});

//@route get api/users/register
//@desc register user
//@access public
// baslangicta postman ile name, email ve 
//password post edileiyor gravatar ile ise 
//gravatar daki avatarı çekiliyor gravatar diye 
//bir kutuphane ve servis kullanıyoruz
// req.body den name email ve password çekiliyor
// ayrıca bcrypt ile passwordleri crypt yapiyoruz
router.post('/register', (req,res)=>{
    User.findOne({email: req.body.email})
        .then(user=>{
            if(user) {
                return res.status(400).json({email: 'Email already exists'});
            } else {
                const avatar = gravatar.url(req.body.email, {
                    s:'200', //size
                    r:'pg', // rating
                    d:'mm' // default
                });

                const newUser = new User({
                    name: req.body.name,
                    email: req.body.email,
                    avatar: avatar,
                    password: req.body.password
                });

              


                bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                if (err) throw err;
                newUser.password = hash;
                
                newUser
                .save()
                .then(user => res.json(user))
                .catch(err => console.log(err));
            });
          });
        }
      });
    });


//@route get api/users/login
//@desc login user / return jwt token
//@access public
// post yaparak email ve name ve password girilecek
// burada req.body den bunlar çekilecek

router.post('/login', (req,res)=>{
    const email = req.body.email;
    const password = req.body.password;

    // find user by email
    User.findOne({email: email})
        .then(user=>{
            // check if user exists
            if(!user) {
                return res.status(404).json({email: 'User not found'});
            }

            // check password use bcrypt.compare
            bcrypt.compare(password, user.password)
            // return promise icinde true veya flase isMatch dönecek
                .then(isMatch => {
                    if(isMatch) {
                    // user matched
                    const payload = {id: user.id, name: user.name, avatar: user.avatar}; // create jwt payload
                    // sign Token icinde payloadd ve key dosyasından export edilen secret var
                    jwt.sign(payload,
                        keys.secretOrKey,
                        {expiresIn: 3600}, 
                        (err,token) => {
                            res.json({
                                success: true,
                                token: 'Bearer '+ token
                            });
                    });

                    } else {
                        return res.status(400).json({password: 'Password incorrect'});
                    }
                })

        });
});

// @route GET api/users/current
// @desc Return current user
// @access Private

router.get('/current', passport.authenticate('jwt', {session: false}), (req,res)=>{
    res.json({msg: 'Success'});
});

module.exports = router;