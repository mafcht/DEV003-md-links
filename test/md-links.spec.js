const { mdLinks } = require('../index.js');


describe('mdLinks', () => {

  it('Debería ser una función', () => {
    expect(typeof mdLinks).toBe('function');
  });

  it('Deberia devolver una promesa', () => {
    return mdLinks()
      .then(() => {
        expect(mdLinks).toBe(typeof 'promise')
      })
      .catch((error) => { error });
  });

  it('Deberia rechazar la promesa cuando no existe el path', () => {
    return mdLinks('fernanda/cursos/estepathnoexiste.md').catch((error) => {
      expect(error).toBe('La ruta no existe');
    })
    
  });

});
