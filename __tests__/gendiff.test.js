import gendiff from '../src';
import expectedRegular from '../__fixtures__/expected-regular';
import expectedRegularNested from '../__fixtures__/expected-regular-nested';
import expectedPlain from '../__fixtures__/expected-plain';

const extensions = ['json', 'yml', 'ini'];
const relativePath = './__fixtures__/';
const absolutePath = `${__dirname}/../__fixtures__/`;

const getResultInRegularFormat = (pathType, extension) => gendiff(`${pathType}before.${extension}`, `${pathType}after.${extension}`, { format: 'regular' });

const getNestedResultInRegularFormat = (pathType, extension) => gendiff(`${pathType}nested-before.${extension}`, `${pathType}nested-after.${extension}`, { format: 'regular' });

const getNestedResultInPlainFormat = (pathType, extension) => gendiff(`${pathType}nested-before.${extension}`, `${pathType}nested-after.${extension}`, { format: 'plain' });


test.each(extensions)('gendiff %s', (extension) => {
  expect(getResultInRegularFormat(relativePath, extension)).toBe(expectedRegular);
  expect(getResultInRegularFormat(absolutePath, extension)).toBe(expectedRegular);
});

test.each(extensions)('gendiff nested %s', (extension) => {
  expect(getNestedResultInRegularFormat(relativePath, extension)).toBe(expectedRegularNested);
  expect(getNestedResultInRegularFormat(absolutePath, extension)).toBe(expectedRegularNested);
});

test.each(extensions)('gendiff plain %s', (extension) => {
  expect(getNestedResultInPlainFormat(relativePath, extension)).toBe(expectedPlain);
  expect(getNestedResultInPlainFormat(absolutePath, extension)).toBe(expectedPlain);
});
