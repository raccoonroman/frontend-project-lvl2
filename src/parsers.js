import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import ini from 'ini';

const getFileContent = (filePath) => fs.readFileSync(`${filePath}`, 'utf8');
const isEqualFormats = (filePath, format) => path.extname(filePath) === format;

const fileParsers = [
  {
    name: 'json',
    check: (filePath) => isEqualFormats(filePath, '.json'),
    parseFile: (filePath) => JSON.parse(getFileContent(filePath)),
  },
  {
    name: 'yml',
    check: (filePath) => isEqualFormats(filePath, '.yml'),
    parseFile: (filePath) => yaml.safeLoad(getFileContent(filePath)),
  },
  {
    name: 'ini',
    check: (filePath) => isEqualFormats(filePath, '.ini'),
    parseFile: (filePath) => ini.parse(getFileContent(filePath)),
  },
];

const getFileParser = (filePath) => fileParsers.find(({ check }) => check(filePath));

export default (filePath) => {
  const { parseFile } = getFileParser(filePath);
  return parseFile(filePath);
};
