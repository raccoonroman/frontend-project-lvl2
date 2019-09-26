import _ from 'lodash';

export default (config1, config2) => {
  const config1Keys = Object.keys(config1);
  const config2Keys = Object.keys(config2);
  const config1Arr = config1Keys.reduce((acc, key) => {
    if (_.has(config2, key) && config1[key] === config2[key]) {
      return [...acc, `    ${key}: ${config1[key]}`];
    }
    if (_.has(config2, key)) {
      return [...acc, `  + ${key}: ${config2[key]}`, `  - ${key}: ${config1[key]}`];
    }
    return [...acc, `  - ${key}: ${config1[key]}`];
  }, []);
  const config2Arr = config2Keys.reduce((acc, key) => {
    if (!_.has(config1, key)) {
      return [...acc, `  + ${key}: ${config2[key]}`];
    }
    return acc;
  }, []);
  return `{\n${config1Arr.concat(config2Arr).join('\n')}\n}`;
};
