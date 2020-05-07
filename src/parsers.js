import yaml from 'js-yaml';
import ini from 'ini';

const parsers = [
  {
    name: 'json',
    parse: (data) => JSON.parse(data),
  },
  {
    name: 'yml',
    parse: (data) => yaml.safeLoad(data),
  },
  {
    name: 'ini',
    parse: (data) => ini.parse(data),
  },
];

const getParser = (formatName) => parsers.find(({ name }) => formatName === name);

export default (formatName, data) => {
  const { parse } = getParser(formatName);
  return parse(data);
};
