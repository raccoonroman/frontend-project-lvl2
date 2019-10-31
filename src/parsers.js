import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

const fileParsers = [
  {
    name: 'json',
    check: file => path.extname(file) === '.json',
    parse: file => JSON.parse(fs.readFileSync(`${file}`, 'utf8')),
  },
  {
    name: 'yml',
    check: file => path.extname(file) === '.yml',
    parse: file => yaml.safeLoad(fs.readFileSync(`${file}`, 'utf8')),
  },
];

const getFileParser = file => fileParsers.find(({ check }) => check(file));

export default (file) => {
  const { parse } = getFileParser(file);
  return parse(file);
};
