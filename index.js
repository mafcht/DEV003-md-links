// importo las funciones que necesito del archivo functions
const { existsPath, absolutePath, getMdFiles, getAllLinks, validateLink } = require('./functions.js')

const mdLinks = (path, options) => {
  return new Promise((resolve, reject) => {
    // Identificar si la ruta existe
    if (existsPath(path)) {
      // Si no es ruta absoluta, convertirla en absoluta
      const absPath = absolutePath(path)
      // Checar si es un solo archivo o directorio y filtrar archivos .md llamando a funcion getMdFiles
      const mdFilesArr = getMdFiles(absPath);
      // Si hay mas de un archivo .md
      if (mdFilesArr.length >= 1) {
        // Leer archivos .md y extraer los links
        getAllLinks(absPath)
          .then((linksArr) => {
            // si hay mas de un link y se cumple la opcion de validar es true
            if (linksArr.length >= 1 && options.validate == true) {
              // resuelve aplicando la funcion validateLink a todos los links del array
              resolve((validateLink(linksArr)))
              // si hay mas de un link y la opcion de validar es falsa O nula
            } else if (linksArr.length >= 1 && (options.validate != true || options == null)) {
              // resuelve aplicando la funcion de getAllLinks a los paths absolutos y me muestra solo el array de links
              resolve((getAllLinks(absPath)))
              // cuando el array sea igual a 0 manda el error que no encontro links
            } else if (linksArr.length >= 1 && (options.validate != true || options == undefined)) {
              resolve((getAllLinks(absPath)))
            }  else if (linksArr.length == 0) {
              reject(new Error('NO LINKS FOUND'))
            }
          }).catch((error) => {
            console.log(error)
          })
      }
    }
  })
}

// prueba de desarrollo para cuando option. validate es true
// mdLinks('/Users/mafcht/Documents/DEV003-md-links/folderTests/folder2Tests/linkedin.md', {validate : true})
// .then((resolve) => { console.log(resolve)})
// .catch((error) => { console.log(error)});

// prueba de desarrollo para cuando option. validate es diferente a true O nula
// mdLinks('/Users/mafcht/Documents/DEV003-md-links/folderTests/folder2Tests/linkedin.md', '')
// .then((resolve) => console.log(resolve))
// .catch((error) => console.log(error));

// prueba de desarrollo para cuando option. validate es diferente a true O undefined
// mdLinks('/Users/mafcht/Documents/DEV003-md-links/folderTests/folder2Tests/linkedin.md', {validate : undefined})
// .then((resolve) => console.log(resolve))
// .catch((error) => console.log(error));

// prueba de desarrollo para cuando option. validate es falsa
// mdLinks('/Users/mafcht/Documents/DEV003-md-links/folderTests/folder2Tests/linkedin.md', {validate : false})
// .then((resolve) => console.log(resolve))
// .catch((error) => console.log(error));

// prueba de desarrollo para cuando no encuentra links en el archivo .md
// mdLinks('folderTests/test1.md', {validate : true})
// .then((resolve) => console.log(resolve))
// .catch((error) => console.log(error));

// exporto objeto entre corchetes o funciones
module.exports = { mdLinks };
