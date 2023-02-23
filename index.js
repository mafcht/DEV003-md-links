const fs = require('fs');

const mdLinks = (path, options) => {
  return new Promise((resolve, reject) => {
    // Identificar si la ruta existe
    if (fs.existsSync(path)){
      // Si no es ruta absoluta, convertirla en absoluta
      // Checar si es un solo archivo o directorio
      // Si es directorio filtrar archivos .md
    }else{
         //Si la ruta no existe se rechaza la promesa
      reject('La ruta no existe')
    }
  })
}
console.log(typeof mdLinks)

// Verificar si es un archivo
const isFile = (routeFile) => {
  return fs.statSync(routeFile).isFile();
};
console.log(isFile('Readme.md'));

// exporto objeto entre corchetes o funciones
module.exports = { mdLinks }
