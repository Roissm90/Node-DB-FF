const passport = require('passport');
const localStrategy = require ('passport-local').Strategy;
const bcrypt = require('bcrypt');
const User = require('../models/User');
const saltRounds = 10;

passport.use(
    'register',
    new localStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    },
    async (req, email, password, done) => {
        try {
            const previousUser = await User.findOne({email: email});
            //Si existe el usuario informa de su existencia
            if (previousUser) {
                const error = new Error ('El usuario ya existe');
                return done(error)
            }
            //Si no existe se encripta la contraseña antes de guardarla
            else {
            const pwdHash = await bcrypt.hash(password, saltRounds);
            const newUser = new User ({
                email: email,
                password: pwdHash
            })
            const savedUser = await newUser.save();
            done(null, savedUser) 
            }
        } catch (err) {
            console.log(err.message);
            done(err)
        }
    })
)

passport.use('login', new localStrategy(
    {
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    },
    async (req, email, password, done) => 
    {
        try {
            const currentUser = await User.findOne({email: email});
            // si no existe el usuario da error
            if (!currentUser) {
                const error = new Error('El usuario no existe');
                return done(error);
            }
            // si existe el usuario comparamos contraseñas
            const isValidPassword = await bcrypt.compare(
                password, 
                currentUser.password
            );
            if (!isValidPassword)  {
                const error = new Error('La contraseña no es válida');
                return done(error);
            }
            else {
                currentUser.password = null;
                return done(null, currentUser);
            }
        }
        catch (error) {
            return done(error);
        }
    }
))

passport.serializeUser((user, done) => {
    return done(null, user._id)
})

passport.deserializeUser(async (userId, done) => {
    try {
      const existingUser = await User.findById(userId);
      return done(null, existingUser);
    } catch (err) {
      return done(err);
    }
});