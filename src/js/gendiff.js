import fs from 'fs';
import path from 'path';
import parse from '../parsers';
import buildAst from '../build-ast';
import formatRegular from '../formatters/formatter-regular';
import formatPlain from '../formatters/formatter-plain';


const formaters = [
  {
    name: 'regular',
    format: ast => formatRegular(ast),
  },
  {
    name: 'plain',
    format: ast => formatPlain(ast),
  },
];


const getFormater = (formatName) => {
  const { format } = formaters.find(({ name }) => name === formatName);
  return format;
};

const gendiff = (file1, file2, { formatName = 'regular' }) => {
  const obj1 = parse(file1);
  const obj2 = parse(file2);
  const format = getFormater(formatName);
  const ast = buildAst(obj1, obj2);
  const result = format(ast);

  const jsonPath2 = path.join(__dirname, '..', '..', '__fixtures__', 'ast.json');
  fs.writeFileSync(jsonPath2, JSON.stringify(ast));

  // const jsonPath = path.join(__dirname, '..', '..', '__fixtures__', 'actual.js');
  // fs.writeFileSync(jsonPath, format);

  console.log(result);
  return result;
};

export default gendiff;
