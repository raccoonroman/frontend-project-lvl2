import { has, uniqBy } from 'lodash';
// import fs from 'fs';
// import path from 'path';
import parse from '../parsers';
import formatRegular from '../formatters/formatter-regular';
import formatPlain from '../formatters/formatter-plain';


const areBothValuesObjects = (obj1, obj2, key) => {
  const firstValueIsObject = obj1[key] instanceof Object;
  const secondValueIsObject = obj2[key] instanceof Object;
  return firstValueIsObject && secondValueIsObject;
};

const propertyStates = [
  {
    state: 'unchanged',
    check: (obj1, obj2, key) => {
      const sameValues = has(obj1, key) && has(obj2, key) && obj1[key] === obj2[key];
      return sameValues || areBothValuesObjects(obj1, obj2, key);
    },
  },
  {
    state: 'changed',
    check: (obj1, obj2, key) => has(obj1, key) && has(obj2, key) && obj1[key] !== obj2[key],
  },
  {
    state: 'deleted',
    check: (obj1, obj2, key) => has(obj1, key) && !has(obj2, key),
  },
  {
    state: 'added',
    check: (obj1, obj2, key) => !has(obj1, key) && has(obj2, key),
  },
];


const getStateOfKey = (obj1, obj2, key) => {
  const { state } = propertyStates.find(({ check }) => check(obj1, obj2, key));
  return state;
};

const getObjState = (obj1, obj2, key, nestingLevel) => {
  const state = getStateOfKey(obj1, obj2, key);
  const result = { state, nestingLevel, key };

  if (Object.prototype.hasOwnProperty.call(obj1, key)) {
    result.oldValue = obj1[key];
  }

  if (Object.prototype.hasOwnProperty.call(obj2, key)) {
    result.newValue = obj2[key];
  }

  return result;
};


const genDiffAST = (obj1, obj2, nestingLevel) => {
  const keysWithChildren = [];
  const obj1Keys = Object.keys(obj1);
  const obj2Keys = Object.keys(obj2);

  const diffFromObject1 = obj1Keys.map((key) => {
    const stateObj = getObjState(obj1, obj2, key, nestingLevel);
    const bothValuesObjects = areBothValuesObjects(obj1, obj2, key);

    if (bothValuesObjects) {
      keysWithChildren.push(key);
    }

    return stateObj;
  });

  const diffFromObject2 = obj2Keys.map(key => getObjState(obj1, obj2, key, nestingLevel));

  const result = uniqBy([...diffFromObject1, ...diffFromObject2], 'key');

  keysWithChildren.forEach((it) => {
    const obj = result.find(({ key }) => key === it);
    const childrenNestingLevel = nestingLevel + 1;
    delete obj.oldValue;
    delete obj.newValue;
    obj.children = genDiffAST(obj1[it], obj2[it], childrenNestingLevel);
  });

  return result;
};

const gendiff = (file1, file2, { format = 'regular' }) => {
  console.log(file1, file2, format);
  const obj1 = parse(file1);
  const obj2 = parse(file2);
  const ast = genDiffAST(obj1, obj2, 1);
  const result = formatRegular(ast);

  // const jsonPath2 = path.join(__dirname, '..', '..', '__fixtures__', 'ast.json');
  // fs.writeFileSync(jsonPath2, JSON.stringify(ast));

  // const jsonPath = path.join(__dirname, '..', '..', '__fixtures__', 'actual.json');
  // fs.writeFileSync(jsonPath, result);

  console.log(result);
  return result;
};

export default gendiff;
