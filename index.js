require('./utils/db.js');

const express = require('express');
const router = express.Router();
const session = require('express-session');
const server = express();
const PORT = 5001;

const personajeRoutes = require('./routes/personaje.routes');
const videojuegoRoutes = require('./routes/videojuego.routes');
const villanoRoutes = require('./routes/villano.routes');
const invocacionRoutes = require('./routes/invocacion.routes')
const magiaRoutes = require('./routes/magia.routes');
const trabajoRoutes = require('./routes/trabajo.routes');
const monstruoRoutes = require('./routes/monstruo.routes');
const userRoutes = require('./routes/user.routes');

const passport = require('passport');
const MongoStore = require('connect-mongo');
require('./authentication/passport');
const cors = require('cors');

const corsOptions = {
  origin: '*', // Especifica el origen permitido
  credentials: true // Habilita las credenciales (si es necesario)
};

server.use(cors(corsOptions))
server.use((req, res, next) => {
  console.log(`Solicitud recibida: ${req.method} ${req.url}`);
  next();
});
server.use(express.json());
server.use(express.urlencoded({ extended: false }));
server.use(
    session({
      secret: 'upgradehub_node', // ¡Este secreto tendremos que cambiarlo en producción!
      resave: false, // Solo guardará la sesión si hay cambios en ella.
      saveUninitialized: false, // Lo usaremos como false debido a que gestionamos nuestra sesión con Passport
      cookie: {
        maxAge: 3600000 // Milisegundos de duración de nuestra cookie, en este caso será una hora.
      },
      store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI
      })
    })
  );
server.use(passport.initialize());
server.use(passport.session());

//https://node-db-ff.vercel.app     *ruta inicial*
server.use('/personajesff', personajeRoutes);
server.use('/videojuegosff', videojuegoRoutes);
server.use('/villanosff', villanoRoutes);
server.use('/invocacionesff', invocacionRoutes);
server.use('/magiasff', magiaRoutes);
server.use('/trabajosff', trabajoRoutes);
server.use('/monstruosff', monstruoRoutes);
server.use('/usersff', userRoutes);

server.use((err, req, res, next) => {
    return res.status(err.status || 500).json(err.message || 'Error inesperado');
})

server.listen(PORT, ()=>{
    console.log(`El servidor esta corriendo http://localhost:${PORT}`);
})

//npm i passport passport-local bcrypt express-session connect-mongo