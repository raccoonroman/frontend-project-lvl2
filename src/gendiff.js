import fs from 'fs';
import path from 'path';
import parse from './parsers';
import getPropertyAction from './utils';
import buildAst from './build-ast';
import formatRegular from './formatters/formatter-regular';
import formatPlain from './formatters/formatter-plain';
import formatJson from './formatters/formatter-json';

const getFileExtName = (filePath) => path.extname(filePath).slice(1);
const getFileContent = (filePath) => fs.readFileSync(filePath, 'utf8');

const formaters = [
  {
    name: 'regular',
    formatDiff: (ast) => formatRegular(ast),
  },
  {
    name: 'plain',
    formatDiff: (ast) => formatPlain(ast),
  },
  {
    name: 'json',
    formatDiff: (ast) => formatJson(ast),
  },
];

const gendiff = (file1Path, file2Path, format) => {
  const obj1 = parse(getFileExtName(file1Path), getFileContent(file1Path));
  const obj2 = parse(getFileExtName(file2Path), getFileContent(file2Path));
  const { formatDiff } = getPropertyAction(formaters, 'name', format);
  const ast = buildAst(obj1, obj2);
  const result = formatDiff(ast);

  console.log(result);
  return result;
};

export default gendiff;
