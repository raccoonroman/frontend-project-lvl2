import { has, uniqBy } from 'lodash';


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
    state: 'removed',
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

const getObjState = (obj1, obj2, key, nestingLevel, currentKeysChain) => {
  const state = getStateOfKey(obj1, obj2, key);
  const keysChain = [...currentKeysChain, key];

  const result = {
    state, nestingLevel, keysChain, key,
  };

  if (Object.prototype.hasOwnProperty.call(obj1, key)) {
    result.oldValue = obj1[key];
  }

  if (Object.prototype.hasOwnProperty.call(obj2, key)) {
    result.newValue = obj2[key];
  }

  return result;
};


const buildAst = (obj1, obj2, nestingLevel = 1, keysChain = []) => {
  const keysWithChildren = [];
  const obj1Keys = Object.keys(obj1);
  const obj2Keys = Object.keys(obj2);

  const diffObject1 = obj1Keys.map((key) => {
    const stateObj = getObjState(obj1, obj2, key, nestingLevel, keysChain);
    const bothValuesObjects = areBothValuesObjects(obj1, obj2, key);

    if (bothValuesObjects) {
      keysWithChildren.push(key);
    }

    return stateObj;
  });

  const diffObject2 = obj2Keys.map(key => getObjState(obj1, obj2, key, nestingLevel, keysChain));

  const result = uniqBy([...diffObject1, ...diffObject2], 'key');

  keysWithChildren.forEach((it) => {
    const obj = result.find(({ key }) => key === it);
    const childrenNestingLevel = nestingLevel + 1;
    const newKeysChain = [...keysChain, obj.key];
    delete obj.oldValue;
    delete obj.newValue;
    obj.children = buildAst(obj1[it], obj2[it], childrenNestingLevel, newKeysChain);
  });

  return result;
};


export default buildAst;
