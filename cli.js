#!/usr/bin/env node
// Made our js file executable by the locally installed node program

const { mdLinks } = require('./index.js');
// const chalk = require('chalk');
// const { statsValidate, stats, validate } = require('./functions.js')

// process.argv se utiliza para pasar los argumentos al proceso node.js cuando se ejecuta en la línea de comandos.
// const argv = process.argv(2);
// const path = process.argv[2];

// const red = chalk.red;
// const green = chalk.green;
// const blue = chalk.blue;
// const welcome = chalk.bgBlue;
// const yellow = chalk.yellow;

// const optValidate = option.includes('--validate') || option.includes('--v');
// const optStats = option.includes('--stats') || option.includes('--s');

// validar el link
// opciones -- validate --stats --validate stats
mdLinks('./test1.md').then((resolve) => {
    console.log(resolve)
})
.catch((error) => {
    console.log(error)
});