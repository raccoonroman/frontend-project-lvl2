import { has, uniqBy } from 'lodash';
// import fs from 'fs';
// import path from 'path';
import parse from '../parsers';


const indentation = '    ';

const getIndents = (nestingLevel) => {
  const current = indentation.repeat(nestingLevel);
  const onUpLevel = indentation.repeat(nestingLevel - 1);
  const onDownLevel = indentation.repeat((nestingLevel + 1));
  const indents = { current, onUpLevel, onDownLevel };
  return indents;
};

const areBothValuesObjects = (obj1, obj2, key) => {
  const firstValueIsObject = obj1[key] instanceof Object;
  const secondValueIsObject = obj2[key] instanceof Object;
  return firstValueIsObject && secondValueIsObject;
};

const convertObjectToString = (obj, nestingLevel) => {
  const keys = Object.keys(obj);
  const indents = getIndents(nestingLevel);

  const keysString = keys.map((it) => {
    let value = obj[it];
    if (value instanceof Object) {
      value = `{\n${convertObjectToString(obj[it], nestingLevel + 1)}${indents.onDownLevel}}`;
    }

    return `${indents.onDownLevel}${it}: ${value}\n`;
  });

  return keysString.join('');
};

const getValueString = (value, nestingLevel) => {
  const indents = getIndents(nestingLevel);
  if (value instanceof Object) {
    return `{\n${convertObjectToString(value, nestingLevel)}${indents.current}}`;
  }

  return value;
};


const propertyActions = [
  {
    state: 'unchanged',
    check: (obj1, obj2, key) => {
      const sameValues = has(obj1, key) && has(obj2, key) && obj1[key] === obj2[key];
      return sameValues || areBothValuesObjects(obj1, obj2, key);
    },
    toString: (nestingLevel, key, oldValue, newValue) => {
      const indents = getIndents(nestingLevel);
      return `${indents.current}${key}: ${newValue}`;
    },
  },
  {
    state: 'changed',
    check: (obj1, obj2, key) => has(obj1, key) && has(obj2, key) && obj1[key] !== obj2[key],
    toString: (nestingLevel, key, oldValue, newValue) => {
      const indents = getIndents(nestingLevel);
      const oldValueString = getValueString(oldValue, nestingLevel);
      const newValueString = getValueString(newValue, nestingLevel);
      return `${indents.onUpLevel}  - ${key}: ${oldValueString}\n${indents.onUpLevel}  + ${key}: ${newValueString}`;
    },
  },
  {
    state: 'deleted',
    check: (obj1, obj2, key) => has(obj1, key) && !has(obj2, key),
    toString: (nestingLevel, key, oldValue) => {
      const indents = getIndents(nestingLevel);
      const oldValueString = getValueString(oldValue, nestingLevel);
      return `${indents.onUpLevel}  - ${key}: ${oldValueString}`;
    },
  },
  {
    state: 'added',
    check: (obj1, obj2, key) => !has(obj1, key) && has(obj2, key),
    toString: (nestingLevel, key, oldValue, newValue) => {
      const indents = getIndents(nestingLevel);
      const newValueString = getValueString(newValue, nestingLevel);
      return `${indents.onUpLevel}  + ${key}: ${newValueString}`;
    },
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

const genDiffFromObjects = (obj1, obj2, nestingLevel) => {
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
    obj.children = genDiffFromObjects(obj1[it], obj2[it], childrenNestingLevel);
  });

  return result;
};

const stringify = (ast) => {
  const result = ast.map((it) => {
    const {
      state,
      nestingLevel,
      key,
      oldValue,
      newValue,
      children,
    } = it;
    const toString = getToStringMethod(state);
    const indents = indentation.repeat(nestingLevel);

    if (children) {
      return `${indents}${key}: {\n${stringify(children)}\n${indents}}`;
    }

    return toString(nestingLevel, key, oldValue, newValue);
  });

  return result.join('\n');
};

const gendiff = (file1, file2) => {
  const obj1 = parse(file1);
  const obj2 = parse(file2);
  const ast = genDiffFromObjects(obj1, obj2, 1);

  // const jsonPath2 = path.join(__dirname, '..', '..', '__fixtures__', 'ast.json');
  // fs.writeFileSync(jsonPath2, JSON.stringify(ast));

  const result = `{\n${stringify(ast)}\n}`;

  // const jsonPath = path.join(__dirname, '..', '..', '__fixtures__', 'actual.json');
  // fs.writeFileSync(jsonPath, result);

  console.log(result);
  return result;
};

export default gendiff;
