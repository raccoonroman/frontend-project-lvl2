const isComplexValue = (value) => value instanceof Object;

const buildValueString = (value) => {
  if (isComplexValue(value)) {
    return '[complex value]';
  }
  if (typeof value === 'string') {
    return `'${value}'`;
  }

  return value;
};

const propertyActions = [
  {
    state: 'unchanged',
    toString: () => false,
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
    toString: (keysChain) => `Property '${keysChain}' was removed`,
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
      keysChain,
      oldValue,
      newValue,
      children,
    } = it;

    if (children) {
      return formatPlain(children);
    }

    const toString = getToStringMethod(state);
    const keysChainString = keysChain.join('.');

    return toString(keysChainString, newValue, oldValue);
  });

  return result.filter((i) => !!i).join('\n');
};

export default formatPlain;
