import gendiff from '../src';
import result from '../__fixtures__/result';


const formats = ['json', 'yml'];
const relativePath = './__fixtures__/';
const absolutePath = `${__dirname}/../__fixtures__/`;


test.each(formats)('gendiff %s', (format) => {
    expect(gendiff(`${relativePath}before.${format}`, `${relativePath}after.${format}`)).toBe(result);
    expect(gendiff(`${absolutePath}before.${format}`, `${absolutePath}after.${format}`)).toBe(result);
  },
);
