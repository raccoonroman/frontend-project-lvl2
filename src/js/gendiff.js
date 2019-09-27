import { has } from 'lodash';
import fs from 'fs';

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

const getPropertyAction = (obj1, obj2, key) => propertyActions.find(({ check }) => check(obj1, obj2, key));

export default (file1, file2) => {
  const beforeJson = fs.readFileSync(`${file1}`, 'utf8');
  const afterJson = fs.readFileSync(`${file2}`, 'utf8');

  const obj1 = JSON.parse(beforeJson);
  const obj2 = JSON.parse(afterJson);
  const obj1Keys = Object.keys(obj1);
  const obj2Keys = Object.keys(obj2);
  const obj2FilteredKeys = obj2Keys.filter(key => !has(obj1, key));
  const obj1Arr = obj1Keys.reduce((acc, key) => {
    const { result } = getPropertyAction(obj1, obj2, key);
    return [...acc, result(obj1, obj2, key)];
  }, []);
  const obj2Arr = obj2FilteredKeys.reduce((acc, key) => {
    const { result } = getPropertyAction(obj1, obj2, key);
    return [...acc, result(obj1, obj2, key)];
  }, []);
  console.log(`{\n${obj1Arr.concat(obj2Arr).join('\n')}\n}`);
  return `{\n${obj1Arr.concat(obj2Arr).join('\n')}\n}`;
};
