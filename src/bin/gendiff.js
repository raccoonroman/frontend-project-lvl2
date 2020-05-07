#!/usr/bin/env node

import commander from 'commander';
import gendiff from '../gendiff';

const program = new commander.Command();

program
  .version('0.7.0')
  .description('Compares two configuration files and shows a difference.')
  .option('-f, --format [type]', 'Output format')

  .arguments('<firstConfig> <secondConfig>')
  .action((file1Path, file2Path, { format }) => gendiff(file1Path, file2Path, format));

program.parse(process.argv);
