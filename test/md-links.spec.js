/* eslint-disable no-undef */
const { mdLinks } = require('../index.js');
const { existsPath } = require('../functions.js')
//const fetch = require('node-fetch');

describe('mdLinks', () => {

  it('Debería ser una función', () => {
    expect(typeof mdLinks).toBe('function');
  });

  // it('Deberia devolver una promesa', () => {
  //   expect(mdLinks()).toBe(typeof 'promise');
  //  return mdLinks('/Users/mafcht/Documents/DEV003-md-links/folderTests/folder2Tests/linkedin.md', {validate:true})
  //     .then(() => {
  //       expect(mdLinks()).toBe(typeof 'promise')
  //     })
  //     .catch((error) => { error });
  // });

  it('Debe retornar un array con objetos con propiedades href, text, file', () => {
    const path = '/Users/mafcht/Documents/DEV003-md-links/folderTests/folder2Tests/linkedin.md'
    const array = [{
      href: 'https://www.laboratoriaplus.la/',
      text: 'LABORATORIA',
      file: '/Users/mafcht/Documents/DEV003-md-links/folderTests/folder2Tests/linkedin.md',
    }];
    expect(mdLinks(path, { validate: false })).resolves.toStrictEqual(array);//Se usa para probar que los objetos tienen los mismos tipos y estructura.
  });

  it('Debe retornar un array con objetos con propiedades href, text, file, status, message', () => {
    const path = '/Users/mafcht/Documents/DEV003-md-links/folderTests/folder2Tests/linkedin.md'
    const array = [{
      href: 'https://www.laboratoriaplus.la/',
      text: 'LABORATORIA',
      file: '/Users/mafcht/Documents/DEV003-md-links/folderTests/folder2Tests/linkedin.md',
      status: 200,
      message: 'ok'
    }
    ];
    expect(mdLinks(path, { validate: true })).resolves.toStrictEqual(expect.anything(array));
  });
});

// test para ver si el path existe
describe('existsSync, esta función retorna un booleano y verifica si existe un directorio o archivo', () => {
  it('Deberia ser una función', () => {
    expect(typeof existsPath).toBe('function');
  });
  it('Si la ruta existe, debe devolver true', () => {
    expect(existsPath('/Users/mafcht/Documents/DEV003-md-links/folderTests/folder2Tests/test4.md')).toBe(true);
  });
  it('Si la ruta no existe, debe devolver false', () => {
    expect(existsPath('/nodexistejs.dev/en/learn/nodilpaths/')).toBe(false);
  });
});