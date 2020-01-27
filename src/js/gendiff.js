import { has, uniqBy } from 'lodash';
import fs from 'fs';
import path from 'path';
import parse from '../parsers';

const areBothValuesObjects = (obj1, obj2, key) => {
  const firstValueIsObject = obj1[key] instanceof Object;
  const secondValueIsObject = obj2[key] instanceof Object;
  return firstValueIsObject && secondValueIsObject;
};

const propertyActions = [
  {
    state: 'unchanged',
    check: (obj1, obj2, key) => {
      const sameValues = has(obj1, key) && has(obj2, key) && obj1[key] === obj2[key];
      return sameValues || areBothValuesObjects(obj1, obj2, key);
    },
    toString: (key, oldValue, newValue) => `    ${key}: ${newValue}`,
  },
  {
    state: 'changed',
    check: (obj1, obj2, key) => has(obj1, key) && has(obj2, key) && obj1[key] !== obj2[key],
    toString: (key, oldValue, newValue) => `  + ${key}: ${newValue}\n  - ${key}: ${oldValue}`,
  },
  {
    state: 'deleted',
    check: (obj1, obj2, key) => has(obj1, key) && !has(obj2, key),
    toString: (key, oldValue) => `  - ${key}: ${oldValue}`,
  },
  {
    state: 'added',
    check: (obj1, obj2, key) => !has(obj1, key) && has(obj2, key),
    toString: (key, oldValue, newValue) => `  + ${key}: ${newValue}`,
  },
];

const getStateOfKey = (obj1, obj2, key) => {
  const { state } = propertyActions.find(({ check }) => check(obj1, obj2, key));
  return state;
};

const getToStringMethod = (currentState) => {
  const { toString } = propertyActions.find(({ state }) => state === currentState);
  return toString;
};

const getObjState = (obj1, obj2, key) => {
  const state = getStateOfKey(obj1, obj2, key);
  const result = { state, key };

  if (Object.prototype.hasOwnProperty.call(obj1, key)) {
    result.oldValue = obj1[key];
  }

  if (Object.prototype.hasOwnProperty.call(obj2, key)) {
    result.newValue = obj2[key];
  }

  return result;
};

const genDiffFromObjects = (obj1, obj2) => {
  const keysWithChildren = [];
  const obj1Keys = Object.keys(obj1);
  const obj2Keys = Object.keys(obj2);

  const diffFromObject1 = obj1Keys.map((key) => {
    const stateObj = getObjState(obj1, obj2, key);
    const bothValuesObjects = areBothValuesObjects(obj1, obj2, key);

    if (bothValuesObjects) {
      keysWithChildren.push(key);
    }

    return stateObj;
  });

  const diffFromObject2 = obj2Keys.map(key => getObjState(obj1, obj2, key));

  const result = uniqBy([...diffFromObject1, ...diffFromObject2], 'key');

  keysWithChildren.forEach((it) => {
    const obj = result.find(({ key }) => key === it);
    delete obj.oldValue;
    delete obj.newValue;
    obj.children = genDiffFromObjects(obj1[it], obj2[it]);
  });

  return result;
};

const gendiff = (file1, file2) => {
  const obj1 = parse(file1);
  const obj2 = parse(file2);
  const result = genDiffFromObjects(obj1, obj2);
  return result;
};

const stringify = (file1, file2) => {
  const diff = gendiff(file1, file2);

  const jsonPath = path.join(__dirname, '..', '..', '__fixtures__', 'actual.json');
  fs.writeFileSync(jsonPath, JSON.stringify(diff));

  const result = diff.map((it) => {
    const {
      state, key, oldValue, newValue,
    } = it;
    const toString = getToStringMethod(state);
    return toString(key, oldValue, newValue);
  });
  return `{\n${result.join('\n')}\n}`;
};

export default stringify;
