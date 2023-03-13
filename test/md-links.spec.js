/* eslint-disable no-undef */
const { mdLinks } = require('../index.js');
const { existsPath, absolutePath, isFile, readDir, readFile, getMdFiles, getAllLinks, validateLink, statsValidate, stats, validate } = require('../functions.js')
const fetch = require('node-fetch');
jest.mock('node-fetch');
const { Response } = jest.requireActual('node-fetch');

describe('mdLinks', () => {

  it('mdLinks should be a function', () => {
    expect(typeof mdLinks).toBe('function');
  });

  it('should return and object', () => {
      expect(typeof mdLinks()).toBe('object');
  });

  it('Should return and array with object and properties:href, text, file', () => {
    const path = '/Users/mafcht/Documents/DEV003-md-links/folderTests/folder2Tests/linkedin.md'
    const array = [{
      href: 'https://www.laboratoriaplus.la/',
      text: 'LABORATORIA',
      file: '/Users/mafcht/Documents/DEV003-md-links/folderTests/folder2Tests/linkedin.md',
    }];
    expect(mdLinks(path, { validate: false })).resolves.toStrictEqual(array);//Se usa para probar que los objetos tienen los mismos tipos y estructura.
  });

  it('Should return and array with object and properties: href, text, file, status, message', () => {
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

  it('Should reject a path when it does not exists ', () => {
    return mdLinks('/Users/fcht/Documents/DEV003-md-links/folderTests/folder2Tests').catch(error => {
      expect(error).toBe('NO PATH FOUND')
    })
  });
});

// test to verify if path exists
describe('Should return a boolean ti verify if a file exists', () => {
  it('Deberia ser una función', () => {
    expect(typeof existsPath).toBe('function');
  });
  it('Should return true if path exists', () => {
    expect(existsPath('/Users/mafcht/Documents/DEV003-md-links/folderTests/folder2Tests/test4.md')).toBe(true);
  });
  it('Should return false if path exists', () => {
    expect(existsPath('/nodexistejs.dev/en/learn/nodilpaths/')).toBe(false);
  });
});

// test to verify is path is absolutepara verificar si el path es absoluto o no
describe('if it is an absolutePath', () => {
  it('should be a function', () => {
    expect(typeof absolutePath).toBe('function');
  });
  it('should return the same path if it is absolute', () => {
    expect(absolutePath('/Users/mafcht/Documents/DEV003-md-links/folderTests/folder2Tests/linkedin.md')).toBe('/Users/mafcht/Documents/DEV003-md-links/folderTests/folder2Tests/linkedin.md');
  });
  it('should return an absolute path if it is not absolute', () => {
    expect(absolutePath('folderTests/folder2Tests/linkedin.md')).toBe('/Users/mafcht/Documents/DEV003-md-links/folderTests/folder2Tests/linkedin.md');
  });
});

// test to verify if file exist
describe('if a file exists with isFile function', () => {
  it('should be a function', () => {
    expect(typeof isFile).toBe('function');
  });
  it('Should retorn true if the file exists', () => {
    expect(isFile('./README.md')).toBe(true)
  });
});

//test verify if my function reads and returns an array of files
describe('readDir should return and array of files', () => {
  it('readDir should be a function', () => {
    expect(typeof readDir).toBe('function');
  });
  it('readDir should read a directory and return an array of files ', () => {
    expect(readDir('/Users/mafcht/Documents/DEV003-md-links/folderTests'))
      .toEqual([
        'folder2Tests', 'test.txt', 'test1.md', 'test2.md'
      ]);
  });
});

//test verify if my function reads a file
describe('readFile should read a file', () => {
  it('readFile should be a function', () => {
    expect(typeof readFile).toBe('function');
  });
  it('readFile should read a file ', () => {
    expect(readFile('/Users/mafcht/Documents/DEV003-md-links/folderTests/folder2Tests/test4.md'))
      .toEqual('hola como estas probando 123');
  });
});

// test to verify if my function returns .md files
describe('getMdFiles should return only .md files', () => {
  it('getMdFiles should be a function', () => {
    expect(typeof getMdFiles).toBe('function');
  });
  it('should return only .md files from an array', () => {
    expect(getMdFiles('/Users/mafcht/Documents/DEV003-md-links/folderTests'))
      .toEqual([
        '/Users/mafcht/Documents/DEV003-md-links/folderTests/folder2Tests/linkedin.md',
        '/Users/mafcht/Documents/DEV003-md-links/folderTests/folder2Tests/test4.md',
        '/Users/mafcht/Documents/DEV003-md-links/folderTests/test1.md',
        '/Users/mafcht/Documents/DEV003-md-links/folderTests/test2.md'
      ]);
  });
});

//test to verify if function brings links
describe('getAllLinks should bring array of links', () => {
  it('Should return a promise', () => {
    return getAllLinks()
      .then(() => {
        expect(getAllLinks).toBe(typeof 'promise')
      })
      .catch((error) => { error });
  });
    
  
  it('Should return an array of objects with links', () => {
      const path = '/Users/mafcht/Documents/DEV003-md-links/folderTests/folder2Tests/linkedin.md';
      const arrayLinks = [
        {
          href: 'https://www.laboratoriaplus.la/',
          text: 'LABORATORIA',
          file: '/Users/mafcht/Documents/DEV003-md-links/folderTests/folder2Tests/linkedin.md'
        },
        {
          href: 'https://es.wikipedia.org/wiki/Markdown',
          text: 'Markdown',
          file: '/Users/mafcht/Documents/DEV003-md-links/folderTests/folder2Tests/linkedin.md'
        },
        {
          href: 'https://nodejs.dev/en/learn/nodejs-file-paths/',
          text: 'Nodejs',
          file: '/Users/mafcht/Documents/DEV003-md-links/folderTests/folder2Tests/linkedin.md'
        },
        {
          href: 'https://noexiste123424noexiste/',
          text: 'Noexiste',
          file: '/Users/mafcht/Documents/DEV003-md-links/folderTests/folder2Tests/linkedin.md'
        }
      ]
      expect(getAllLinks(path, { validate: true })).resolves.toStrictEqual(expect.anything(arrayLinks));
      });
  });

//test for validating link
describe('validateLink', () => {
  it('should be a function', () => {
    expect(typeof validateLink).toBe('function');
  }); 

  const linksArr = [
      {
    href: 'https://www.laboratoriaplus.la/',
    text: 'LABORATORIA',
    file: '/Users/mafcht/Documents/DEV003-md-links/folderTests/folder2Tests/linkedin.md'
  },
  {
    href: 'https://es.wikipedia.org/wiki/Markdown',
    text: 'Markdown',
    file: '/Users/mafcht/Documents/DEV003-md-links/folderTests/folder2Tests/linkedin.md'
  },
  {
    href: 'https://nodejs.dev/en/learn/nodejs-file-paths/',
    text: 'Nodejs',
    file: '/Users/mafcht/Documents/DEV003-md-links/folderTests/folder2Tests/linkedin.md'
  }
    ];

  it('should return an array of objects including links and status', () => {
    fetch.mockReturnValue(Promise.resolve(new Response({status: 200, message: 'OK'})));
    const response = validateLink(linksArr);
    expect(response).resolves.toEqual([
      {
    href: 'https://www.laboratoriaplus.la/',
    text: 'LABORATORIA',
    file: '/Users/mafcht/Documents/DEV003-md-links/folderTests/folder2Tests/linkedin.md',
    status: 200,
    message: 'OK'
  },
  {
    href: 'https://es.wikipedia.org/wiki/Markdown',
    text: 'Markdown',
    file: '/Users/mafcht/Documents/DEV003-md-links/folderTests/folder2Tests/linkedin.md',
    status: 200,
    message: 'OK'
  },
  {
    href: 'https://nodejs.dev/en/learn/nodejs-file-paths/',
    text: 'Nodejs',
    file: '/Users/mafcht/Documents/DEV003-md-links/folderTests/folder2Tests/linkedin.md',
    status: 200,
    message: 'OK'
  }
    ])
  });
});

// test for statsvalidate function
describe('statsValidate', () => {
  const linksArr = [
          {
            href: 'https://www.laboratoriaplus.la/',
            text: 'LABORATORIA',
            file: '/Users/mafcht/Documents/DEV003-md-links/folderTests/folder2Tests/linkedin.md'
          },
          {
            href: 'https://es.wikipedia.org/wiki/Markdown',
            text: 'Markdown',
            file: '/Users/mafcht/Documents/DEV003-md-links/folderTests/folder2Tests/linkedin.md'
          },
          {
            href: 'https://nodejs.dev/en/learn/nodejs-file-paths/',
            text: 'Nodejs',
            file: '/Users/mafcht/Documents/DEV003-md-links/folderTests/folder2Tests/linkedin.md'
          }
        ];
  const infoObj = { total: 3, unique: 3, broken: 0 }
  it('should be a function', () => {
    expect(typeof statsValidate).toBe('function');
  }); 
  it('should return an object containing total, unique and broken links', () => {
    expect(statsValidate(linksArr)).toEqual(infoObj);
  });
});

// test for stats function
describe('stats', () => {
 
  const linksArr = [
    {
      href: 'https://www.laboratoriaplus.la/',
      text: 'LABORATORIA',
      file: '/Users/mafcht/Documents/DEV003-md-links/folderTests/folder2Tests/linkedin.md'
    },
    {
      href: 'https://es.wikipedia.org/wiki/Markdown',
      text: 'Markdown',
      file: '/Users/mafcht/Documents/DEV003-md-links/folderTests/folder2Tests/linkedin.md'
    },
    {
      href: 'https://nodejs.dev/en/learn/nodejs-file-paths/',
      text: 'Nodejs',
      file: '/Users/mafcht/Documents/DEV003-md-links/folderTests/folder2Tests/linkedin.md'
    }
  ];

  const infoObj = { total: 3, unique: 3 }

  it('should be a function', () => {
    expect(typeof stats).toBe('function');
  }); 

  it('should return an object containing total and unique links', () => {
    expect(stats(linksArr)).toEqual(infoObj);
  });
});

// Test for validate function
describe('validate', () => {
  const promisesArrExample = [
    {
      href: 'https://www.laboratoriaplus.la/',
      text: 'LABORATORIA',
      file: '/Users/mafcht/Documents/DEV003-md-links/folderTests/folder2Tests/linkedin.md',
      status: 200,
      message: 'OK'
    },
    {
      href: 'https://es.wikipedia.org/wiki/Markdown',
      text: 'Markdown',
      file: '/Users/mafcht/Documents/DEV003-md-links/folderTests/folder2Tests/linkedin.md',
      status: 200,
      message: 'OK'
    },
    {
      href: 'https://nodejs.dev/en/learn/nodejs-file-paths/',
      text: 'Nodejs',
      file: '/Users/mafcht/Documents/DEV003-md-links/folderTests/folder2Tests/linkedin.md',
      status: 200,
      message: 'OK'
    },
    {
      href: 'https://noexiste123424noexiste/',
      text: 'Noexiste',
      file: '/Users/mafcht/Documents/DEV003-md-links/folderTests/folder2Tests/linkedin.md',
      status: 'FAIL',
      message: 'NOT FOUND'
    }
  ]
 
  const infoArr = [
    '/Users/mafcht/Documents/DEV003-md-links/folderTests/folder2Tests/linkedin.md https://www.laboratoriaplus.la/ OK 200 LABORATORIA',
    '/Users/mafcht/Documents/DEV003-md-links/folderTests/folder2Tests/linkedin.md https://es.wikipedia.org/wiki/Markdown OK 200 Markdown',
    '/Users/mafcht/Documents/DEV003-md-links/folderTests/folder2Tests/linkedin.md https://nodejs.dev/en/learn/nodejs-file-paths/ OK 200 Nodejs',
    '/Users/mafcht/Documents/DEV003-md-links/folderTests/folder2Tests/linkedin.md https://noexiste123424noexiste/ NOT FOUND FAIL Noexiste'
  ]
  it('should be a function', () => {
    expect(typeof validate).toBe('function');
  }); 
  it('should return an object containing total and unique links', () => {
    expect(validate(promisesArrExample)).toEqual(infoArr);
  });
});