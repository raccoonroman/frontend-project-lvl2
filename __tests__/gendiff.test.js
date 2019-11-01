import gendiff from '../src';
import expected from '../__fixtures__/expected';

const formats = ['json', 'yml'];
const relativePath = './__fixtures__/';
const absolutePath = `${__dirname}/../__fixtures__/`;

const getResult = (pathType, format) => gendiff(`${pathType}before.${format}`, `${pathType}after.${format}`);

test.each(formats)('gendiff %s', (format) => {
  expect(getResult(relativePath, format)).toBe(expected);
  expect(getResult(absolutePath, format)).toBe(expected);
});
