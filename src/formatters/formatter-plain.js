const isComplexValue = value => value instanceof Object;

const buildValueString = (value) => {
  if (isComplexValue(value)) {
    return '[complex value]';
  }

  return value;
};

const propertyActions = [
  {
    state: 'unchanged',
    toString: () => '',
  },
  {
    state: 'changed',
    toString: (keysChain, newValue, oldValue) => {
      const newValueString = buildValueString(newValue);
      const oldValueString = buildValueString(oldValue);
      return `Property '${keysChain}' was updated. From ${oldValueString} to ${newValueString}`;
    },
  },
  {
    state: 'removed',
    toString: keysChain => `Property '${keysChain}' was removed`,
  },
  {
    state: 'added',
    toString: (keysChain, newValue) => {
      const newValueString = buildValueString(newValue);
      return `Property '${keysChain}' was added with value: ${newValueString}`;
    },
  },
];

const getToStringMethod = (currentState) => {
  const { toString } = propertyActions.find(({ state }) => state === currentState);
  return toString;
};

const formatPlain = (ast) => {
  const result = ast.map((it) => {
    const {
      state,
      key,
      oldValue,
      newValue,
    } = it;

    const toString = getToStringMethod(state);

    return toString(key, newValue, oldValue);
  });

  return result.filter(i => i !== '').join('\n');
};

export default formatPlain;
