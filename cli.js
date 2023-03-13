#!/usr/bin/env node
/* eslint-disable no-undef */
// Made our js file executable by the locally installed node program
// traemos funciones y creamos constantes para usar los colores de chalk y figlet
const { mdLinks } = require('./index.js');
const { stats, statsValidate } = require('./functions.js')
const chalk = require('chalk');
const figlet = require('figlet');
// para solo escribir log en vez de console.log
const { log } = console;
const red = chalk.bold.bgRed;
const green = chalk.bold.bgGreenBright;
const greenB = chalk.bold.greenBright;
const blue = chalk.bold.bgBlueBright;
const blueC = chalk.bold.bgCyanBright;
const yellow = chalk.bold.bgYellowBright;
const pink = chalk.bold.magenta;
const pinkB = chalk.bold.bgMagentaBright;

// letras grandes con figlet - mensaje bienvenida
const msn = (msn) => {
    log(pink(figlet.textSync(msn, {
        font: 'ANSI Shadow',
        horizontalLayout: 'default',
        verticalLayout: 'default'
    })));
}
// mensaje de ayuda con figlet
const msn1 = (msn1) => {
    log(greenB(figlet.textSync(msn1, {
        font: 'ANSI Shadow',
        horizontalLayout: 'default',
        verticalLayout: 'default'
    })));
}

const instructions = () => {
    msn('Welcome to MDlinks');
    log(pinkB('Please follow the instructions in the terminal to start: \n'));
    log(pink('1. Type the command "mdlinks-fc", then submit a valid path (for example: /Users/mafcht/Documents/DEV003-md-links/folderTests ). \n'));
    log(pink('2. To view how many links there are and how many of them are unique, type "--stats" or "--s" after the path. \n'));
    log(pink('3. To view how many valid links exist, type "--validate" or "--v" after the path.\n'));
    log(pink('4. To view how many links are broken in your .md file, type "--stats --validate" or "--v --s" after the path.\n'));
    log(pinkB('5. If you need help to remember the commands, type "mdlinks-fc --help" or "--h" \n'));
}

const msnHelp = () => {
    msn1('Help Zone')
    log(green('We are here to help you remember the commands:\n'));
    log(greenB('"--validate" or "--v"               -->  displays an array with links and status \n'));
    log(greenB('"--stats" or "--s"                  -->  displays total and unique links \n '));
    log(greenB('"--stats --validate" or "--v --s"   -->  displays total,unique, and broken links \n'));
    log(greenB('"--help" or "--h"                   -->  displays this text \n'));
    log(yellow('Remember commands are written in lower case! \n'));
}

// process.argv se utiliza para pasar los argumentos al proceso node.js cuando se ejecuta en la línea de comandos.
const option = process.argv.slice(2);
// posicion 2 para agarrar el path
const path = process.argv[2];

// funcion de cli que llama a mdLinks y funciones de opciones
const cli = (path, option) => {
    // opciones para que el usuario introduzca
    const optValidate = option.includes('--validate') || option.includes('--v');
    const optStats = option.includes('--stats') || option.includes('--s');
    const opHelp = option.includes('--help') || option.includes('--h')
    // Mensaje de error
    const msnError = (error) => { log(red(`${error}`)); }
    // si el path es indefinido muestro las instrucciones
    if (path == undefined) {
        log(instructions());
        // si el usuario pone la opcion de help mostramos los comandos
    } if (opHelp) {
        log(msnHelp())
        // si el usuario pone la opcion --s --v mostramos los resultados del total de links, unicos y rotos
    } if (optStats && optValidate) {
        mdLinks(path, { validate: true })
            .then((results) => {
                const opstatsValidate = statsValidate(results)
                log(blueC(`          Total: ${opstatsValidate.total}             \n          Unique: ${opstatsValidate.unique}            \n          Broken: ${opstatsValidate.broken}            `))
            })
            .catch((error) => {
                log(msnError, error)
            })
        return
        // si el usuario pone la opcion --s mostramos los resultados del total de links y unicos
    } if (optStats) {
        mdLinks(path, { validate: false })
            .then((results) => {
                const onlyStats = stats(results)
                log(blueC(`                    Total: ${onlyStats.total}   &   Unique: ${onlyStats.unique}                     `))
            })
            .catch((error) => {
                log(msnError, error)
            })
        return
        // si el usuario pone la opcion --v mostramos el array de links con file, href, mensaje, status y texto
    } if (optValidate) {
        mdLinks(path, { validate: true })
            .then((results) => {
                results.forEach(elem => {
                    log(blue((`\nFile: ${elem.file} `) + `\nHref: ${elem.href} ` + `\nMessage: ${elem.message} ` + `\nStatus: ${elem.status} ` + `\nText: ${elem.text} `))
                })
            })
            .catch((error) => {
                log(msnError, error)
            })
        return
        // si a el path no se le pone opcion se muestra el array de los links con file, href y mensaje
    } else {
        mdLinks(path, { validate: false })
            .then((results) => {
                results.forEach(elem => {
                    log(blue((`\nFile: ${elem.file} `) + `\nHref: ${elem.href} ` + `\nText: ${elem.text.slice(0, 50)}`))
                });
            })
            .catch((error) => {
                log(msnError, error)
            })
        return
    }
}
// llamamos a la funcion
cli(path, option)


