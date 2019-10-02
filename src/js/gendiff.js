import { has } from 'lodash';
import fs from 'fs';

const propertyActions = [
  {
    name: 'unchanged',
    check: (obj1, obj2, key) => has(obj1, key) && has(obj2, key) && obj1[key] === obj2[key],
    toString: (obj1, obj2, key) => `    ${key}: ${obj1[key]}`,
  },
  {
    name: 'changedValue',
    check: (obj1, obj2, key) => has(obj1, key) && has(obj2, key) && obj1[key] !== obj2[key],
    toString: (obj1, obj2, key) => `  + ${key}: ${obj2[key]}\n  - ${key}: ${obj1[key]}`,
  },
  {
    name: 'deletedValue',
    check: (obj1, obj2, key) => has(obj1, key) && !has(obj2, key),
    toString: (obj1, obj2, key) => `  - ${key}: ${obj1[key]}`,
  },
  {
    name: 'addedValue',
    check: (obj1, obj2, key) => !has(obj1, key) && has(obj2, key),
    toString: (obj1, obj2, key) => `  + ${key}: ${obj2[key]}`,
  },
];

const getPropertyAction = (obj1, obj2, key) => {
  const result = propertyActions.find(({ check }) => check(obj1, obj2, key));
  return result;
};

const toStringObjKeys = (objKeys, obj1, obj2) => {
  const objArr = objKeys.reduce((acc, key) => {
    const { toString } = getPropertyAction(obj1, obj2, key);
    return [...acc, toString(obj1, obj2, key)];
  }, []);
  return `\n${objArr.join('\n')}`;
};

export default (file1, file2) => {
  const beforeJson = fs.readFileSync(`${file1}`, 'utf8');
  const afterJson = fs.readFileSync(`${file2}`, 'utf8');

  const obj1 = JSON.parse(beforeJson);
  const obj2 = JSON.parse(afterJson);
  const obj1Keys = Object.keys(obj1);
  const obj2Keys = Object.keys(obj2);
  const obj2FilteredKeys = obj2Keys.filter(key => !has(obj1, key));
  const obj1Arr = toStringObjKeys(obj1Keys, obj1, obj2);
  const obj2Arr = toStringObjKeys(obj2FilteredKeys, obj1, obj2);
  console.log(`{${obj1Arr.concat(obj2Arr)}\n}`);
  return `{${obj1Arr.concat(obj2Arr)}\n}`;
};
