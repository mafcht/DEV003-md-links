const { mdLinks } = require('./index.js');

mdLinks('/estarutanoexiste/').then(() => {})
.catch((error) => {
    console.log(error)
});