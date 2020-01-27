import gendiff from '../src';
import expected from '../__fixtures__/expected';
import nestedExpected from '../__fixtures__/nested-expected';

const formats = ['json', 'yml', 'ini'];
// const formats = ['json'];
const relativePath = './__fixtures__/';
const absolutePath = `${__dirname}/../__fixtures__/`;

const getResult = (pathType, format) => gendiff(`${pathType}before.${format}`, `${pathType}after.${format}`);

const getNestedResult = (pathType, format) => gendiff(`${pathType}nested-before.${format}`, `${pathType}nested-after.${format}`);


test.each(formats)('gendiff %s', (format) => {
  expect(getResult(relativePath, format)).toBe(expected);
  expect(getResult(absolutePath, format)).toBe(expected);
});

// test.each(formats)('gendiff nested %s', (format) => {
//   expect(getNestedResult(relativePath, format)).toBe(nestedExpected);
//   // expect(getNestedResult(absolutePath, format)).toBe(nestedExpected);
// });
