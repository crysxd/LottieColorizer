#! /usr/bin/env node

const { program } = require('commander')
const list = require('./commands/list')
const single = require('./commands/single')

program
    .command('show-config')
    .argument('<lut>', 'The JSON file with the color look up table')
    .description('Show all replacements in a config file')
    .action(list)

program
    .command('single')
    .argument('<lut>', 'The JSON file with the color look up table')
    .argument('<source>', 'The Lottie JSON file to replace colors in')
    .argument('<destination>', 'The Lottie JSON to write the result to')
    .description('Show all replacements in a config file')
    .action(single)

program.parse()
