#!/usr/bin/env node

import commander from 'commander';
import actOnConfigs from '../js/gendiff';

const program = new commander.Command();

program
  .version('0.1.1')
  .description('Compares two configuration files and shows a difference.')
  .option('-f, --format [type]', 'Output format')

  .arguments('<firstConfig> <secondConfig>')
  .action(actOnConfigs);

program.parse(process.argv);




