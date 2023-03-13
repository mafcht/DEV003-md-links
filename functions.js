// file system functions
const fs = require('fs');
// para funciones de las rutas
const path = require('path');
// para peticiones con http
const fetch = require('node-fetch');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const md = require('markdown-it');

// funcion para ver si la ruta existe, es asincrona
const existsPath = (link) => { return (fs.existsSync(link)) };

// funcion para ver si la ruta es absoulta, si no lo es convertimos a relativa
const absolutePath = (link) => { return (path.isAbsolute(link)) ? link : path.resolve(link) };
//console.log(absolutePath('folderTests/folder2Tests/linkedin.md'));

// funcion para ver si es un archivo 
const isFile = (link) => { return fs.statSync(link).isFile(); };
//console.log(isFile('folderTests/folder2Tests/linkedin.md'));

// funcion para ver si es un directorio
const isDirectory = (link) => { return fs.statSync(link).isDirectory(); };
//console.log(isFile('folderTests/folder2Tests/linkedin.md'));

// funcion para ver si es directorio
const readDir = (link) => { return (fs.readdirSync(link)) };
//console.log(readDir('/Users/mafcht/Documents/DEV003-md-links/folderTests'));

// Funcion para leer archivos
const readFile = (link) => { return (fs.readFileSync(link,{ encoding: "utf-8"}));};
// console.log(readFile('/Users/mafcht/Documents/DEV003-md-links/folderTests/folder2Tests/test4.md'))

// Checar extension .md de los archivos
const extensionMd = (link) => { return (path.extname(link) == '.md') }

// Buscando archivos .md
const getMdFiles = (link) => {
  // creando array vacio para los archivos md
  let mdArrayFiles = [];
  // Revisar si el link es un archivo
  if (isDirectory(link) == false && extensionMd(link)) {
    // covertir a absoluto el path
    let absoluteFile = absolutePath(link);
    // agregar path a mi array
    mdArrayFiles.push(absoluteFile)
  } else if (isDirectory(link)) {
    // si es directorio vamos a leer archivos y encontrar los .md
    readDir(link).forEach((file) => {
      // unir los paths de cada archivo
      let joinedPaths = path.join(link, file);
      // convertirlos a absolutos
      let absoluteLinks = absolutePath(joinedPaths);
      // agregar links a mi array
      // (…) occurs in a function call or alike, it's called a "spread operator" and expands an array into a list.
      mdArrayFiles = [...mdArrayFiles, ...getMdFiles(absoluteLinks)]
    });
  }
  return mdArrayFiles;
}
//console.log(getMdFiles('/Users/mafcht/Documents/DEV003-md-links/folderTests'));

// funcion para traer todos los links de los archivos .md
const getAllLinks = (link) => {
// creamos array vacio para introducir links
  let linksArr = [];
  // vamos a recorrer cada archivo mdLinks para buscar los links
  getMdFiles(link).forEach((file) => {
       // creamos constante de expresiones regulares para poder traer el link con https correctamente
       // '/' cuandp empieza y cuando termina,  'g' es una busqueda global, 'i' no distingue mayusculas de minusculas, 'm' es una busqueda multilenea
      const urlLinks = /\[([^[]+)\](\(.*\))/gmi;
      // creamos constante en donde guardaremos los links que encuentre y hagan match 
      let linksTextArr = readFile(file).match(urlLinks); 
      // si es diferente a cero
      if (linksTextArr != null ) {
          // convertimos el archivo .md en texto HTML usando el markdown it
          let result = md().render(readFile(file));
          // Recreaamos el DOM con JSDOM
          let dom = new JSDOM(result);
          // rendereamos el archivo y su contenido y buscamos los que tengan el tag de link <a> 
          linksTextArr = dom.window.document.querySelectorAll('a');
          // por cada link the encuentre     
          linksTextArr.forEach((linksText) => {
              // retorna solo el URL del link 
              const links = linksText.href
              // retorna solo el tecto del caracter 0 al 100 
              const text = linksText.textContent.substring(0, 100);
              // usamos push href, text y file al array de links y los vamos añadiendo
              linksArr.push({
                  href: links,
                  text: text,
                  file: file,
              });
          });
      }
  });
  // retorna el array de links
  return linksArr;
}
// prueba de desarrollo
//console.log(getAllLinks('/Users/mafcht/Documents/DEV003-md-links/folderTests'))

// funcion para validar los links
const validateLink = (arrayAllLinks) => {
  // creo un array que va a contener las promesas
  let arrayPromises = [];
  // creamos un ciclo para que recorra cada link
  // usamos fetch para ver acceder al https y hacer la peticion para ver si esta ok o fail
  arrayPromises = arrayAllLinks.map((link) => fetch(link.href)
    .then((result) => {
      // promesa redulta el resultado es OK
      if (result.ok) {
        return {
          // agregamos a nuestro array estos elemento a nuestro arrayAllLinks el original
          // (…) occurs in a function call or alike, it's called a "spread operator" and expands an array into a list.
          ...link,
          status: result.status,
          message: result.statusText,
        }
      }
      // cuando la promesa no es resulta el resultado es FAIL
    }).catch(() => {
      return {
        ...link,
        status: 'FAIL',
        message: 'NOT FOUND',
      }
    }))
  return Promise.all(arrayPromises);
}
// prueba de desarrollo
//getAllLinks('/Users/mafcht/Documents/DEV003-md-links/folderTests/folder2Tests/linkedin.md').then(((res) => (validateLink(res).then(((resolve) => console.log(resolve))))));

// funcion para --stats --validate
const statsValidate = (arrayAllLinks) => {
  // creo una constante que guarde todos los liks que estan rotos
  // los filtra por el estatus que sea == a FAIL
  const broken = arrayAllLinks.filter((link) => link.status == 'FAIL').length;
  // regresa un objeto con el total de los links rotos
  return {
    total: arrayAllLinks.length,
    // creamos un new Set para almacenar cuantos son los valores únicos que filtramos del arayAllLinks
    // usamos .size para traer el numero
    unique: new Set(arrayAllLinks.map((link) => link.href)).size,
    // mostramos el numero de los links que estan rotos
    broken: broken
  }
}

// funcion para --stats
const stats = (arrayAllLinks) => {
  return {
    // traemos el numero total de todos los links del arrayAllLinks
    total: arrayAllLinks.length,
    // creamos un new Set para almacenar cuantos son los valores únicos que filtramos del arayAllLinks
    // usamos .size para traer el numero
    unique: new Set(arrayAllLinks.map((link) => link.href)).size,
  }
}

// funcion para --validate
const validate = (arrayPromises) => {
  // del array que tenemos de promesas lo filtramos para traer la informacion de los links
  return arrayPromises.map((link) => {
    // mostramos el archivo, el link, el mensaje, el estatus, y el texto
    return `${link.file} ${link.href} ${link.message} ${link.status} ${link.text}`
  })
}

// exportamos todas las funciones de este archivo
module.exports = { existsPath, absolutePath, isFile, isDirectory, extensionMd, readDir, readFile, getMdFiles, getAllLinks, validateLink, statsValidate, stats, validate }