import { has } from 'lodash';

const propertyActions = [
  {
    name: 'unchanged',
    check: (obj1, obj2, key) => has(obj1, key) && has(obj2, key) && obj1[key] === obj2[key],
    result: (obj1, obj2, key) => `    ${key}: ${obj1[key]}`,
  },
  {
    name: 'changedValue',
    check: (obj1, obj2, key) => has(obj1, key) && has(obj2, key) && obj1[key] !== obj2[key],
    result: (obj1, obj2, key) => `  + ${key}: ${obj2[key]}\n  - ${key}: ${obj1[key]}`,
  },
  {
    name: 'deletedValue',
    check: (obj1, obj2, key) => has(obj1, key) && !has(obj2, key),
    result: (obj1, obj2, key) => `  - ${key}: ${obj1[key]}`,
  },
  {
    name: 'addedValue',
    check: (obj1, obj2, key) => !has(obj1, key) && has(obj2, key),
    result: (obj1, obj2, key) => `  + ${key}: ${obj2[key]}`,
  },
];

const getPropertyAction = (file1, file2, key) => propertyActions.find(({ check }) => check(file1, file2, key));

export default (file1, file2) => {
  const file1Keys = Object.keys(file1);
  const file2Keys = Object.keys(file2);
  const file2FilteredKeys = file2Keys.filter(key => !has(file1, key));
  const file1Arr = file1Keys.reduce((acc, key) => {
    const { result } = getPropertyAction(file1, file2, key);
    return [...acc, result(file1, file2, key)];
  }, []);
  const file2Arr = file2FilteredKeys.reduce((acc, key) => {
    const { result } = getPropertyAction(file1, file2, key);
    return [...acc, result(file1, file2, key)];
  }, []);
  return `{\n${file1Arr.concat(file2Arr).join('\n')}\n}`;
};
