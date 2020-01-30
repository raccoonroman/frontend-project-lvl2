#!/usr/bin/env node

import commander from 'commander';
import gendiff from '../js/gendiff';

const program = new commander.Command();

program
  .version('0.5.4')
  .description('Compares two configuration files and shows a difference.')
  .option('-f, --format [type]', 'Output format')

  .arguments('<firstConfig> <secondConfig>')
  .action(gendiff);

program.parse(process.argv);
