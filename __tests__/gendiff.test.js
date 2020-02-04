import gendiff from '../src';
import expectedRegular from '../__fixtures__/expected-regular';
import expectedPlain from '../__fixtures__/expected-plain';
import expectedJson from '../__fixtures__/expected-json';


const relativePath = './__fixtures__/';
const absolutePath = `${__dirname}/../__fixtures__/`;
const extensions = ['json', 'yml', 'ini'];
const formats = ['regular', 'plain', 'json'];
const results = [expectedRegular, expectedPlain, expectedJson];

const getResult = (pathType, extension, formatName) => gendiff(`${pathType}before.${extension}`, `${pathType}after.${extension}`, { format: formatName });

formats.forEach((format, i) => {
  test.each(extensions)(`gendiff extension: %s, format: ${formats[i]}`, (extension) => {
    expect(getResult(relativePath, extension, format)).toBe(results[i]);
    expect(getResult(absolutePath, extension, format)).toBe(results[i]);
  });
});

// test.each(extensions)('gendiff nested %s', (extension) => {
//   expect(getResult(relativePath, extension, format.regular)).toBe(expectedRegular);
//   expect(getResult(absolutePath, extension, format.regular)).toBe(expectedRegular);
// });

// test.each(extensions)('gendiff plain %s', (extension) => {
//   expect(getResult(relativePath, extension, format.plain)).toBe(expectedPlain);
//   expect(getResult(absolutePath, extension, format.plain)).toBe(expectedPlain);
// });

// test.each(extensions)('gendiff json %s', (extension) => {
//   expect(getResult(relativePath, extension, format.json)).toBe(expectedJson);
//   expect(getResult(absolutePath, extension, format.json)).toBe(expectedJson);
// });
