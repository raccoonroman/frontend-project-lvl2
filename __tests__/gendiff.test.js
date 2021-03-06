import fs from 'fs';
import path from 'path';
import gendiff from '../src';

const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);
const readFile = (filename) => fs.readFileSync(getFixturePath(filename), 'utf-8');

const expectedRegular = readFile('expected-regular.txt').trim();
const expectedPlain = readFile('expected-plain.txt').trim();
const expectedJson = readFile('expected-json.json').trim();

const extensions = ['json', 'yml', 'ini'];
const formats = ['regular', 'plain', 'json'];
const expectedValues = [expectedRegular, expectedPlain, expectedJson];

const getResult = (extension, formatName) => (
  gendiff(getFixturePath(`before.${extension}`), getFixturePath(`after.${extension}`), formatName)
);

formats.forEach((format, i) => {
  test.each(extensions)(`gendiff extension: %s, format: ${formats[i]}`, (extension) => {
    expect(getResult(extension, format)).toBe(expectedValues[i]);
  });
});
