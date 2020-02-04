// import fs from 'fs';
// import path from 'path';
import parse from '../parsers';
import buildAst from '../build-ast';
import formatRegular from '../formatters/formatter-regular';
import formatPlain from '../formatters/formatter-plain';


const formaters = [
  {
    name: 'regular',
    formatDiff: ast => formatRegular(ast),
  },
  {
    name: 'plain',
    formatDiff: ast => formatPlain(ast),
  },
];


const getFormater = (format) => {
  const { formatDiff } = formaters.find(({ name }) => name === format);
  return formatDiff;
};

const gendiff = (file1, file2, { format = 'regular' }) => {
  const obj1 = parse(file1);
  const obj2 = parse(file2);
  const formatDiff = getFormater(format);
  const ast = buildAst(obj1, obj2);
  const result = formatDiff(ast);

  // const jsonPath2 = path.join(__dirname, '..', '..', '__fixtures__', 'ast.json');
  // fs.writeFileSync(jsonPath2, JSON.stringify(ast));

  // const jsonPath = path.join(__dirname, '..', '..', '__fixtures__', 'actual.js');
  // fs.writeFileSync(jsonPath, format);

  console.log(result);
  return result;
};

export default gendiff;
