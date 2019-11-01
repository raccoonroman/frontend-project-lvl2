import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

const getContent = (file) => fs.readFileSync(`${file}`, 'utf8');

const fileParsers = [
  {
    name: 'json',
    check: file => path.extname(file) === '.json',
    parse: file => JSON.parse(getContent(file)),
  },
  {
    name: 'yml',
    check: file => path.extname(file) === '.yml',
    parse: file => yaml.safeLoad(getContent(file)),
  },
];

const getFileParser = file => fileParsers.find(({ check }) => check(file));

export default (file) => {
  const { parse } = getFileParser(file);
  return parse(file);
};
