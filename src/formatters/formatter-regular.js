import getPropertyAction from '../utils';


const indentation = '    ';

const getIndents = (nestingLevel) => {
  const current = indentation.repeat(nestingLevel);
  const onUpLevel = indentation.repeat(nestingLevel - 1);
  const onDownLevel = indentation.repeat((nestingLevel + 1));
  const indents = { current, onUpLevel, onDownLevel };
  return indents;
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
    toString: (nestingLevel, key, oldValue, newValue) => {
      const indents = getIndents(nestingLevel);
      return `${indents.current}${key}: ${newValue}`;
    },
  },
  {
    state: 'changed',
    toString: (nestingLevel, key, oldValue, newValue) => {
      const indents = getIndents(nestingLevel);
      const oldValueString = getValueString(oldValue, nestingLevel);
      const newValueString = getValueString(newValue, nestingLevel);
      return `${indents.onUpLevel}  - ${key}: ${oldValueString}\n${indents.onUpLevel}  + ${key}: ${newValueString}`;
    },
  },
  {
    state: 'removed',
    toString: (nestingLevel, key, oldValue) => {
      const indents = getIndents(nestingLevel);
      const oldValueString = getValueString(oldValue, nestingLevel);
      return `${indents.onUpLevel}  - ${key}: ${oldValueString}`;
    },
  },
  {
    state: 'added',
    toString: (nestingLevel, key, oldValue, newValue) => {
      const indents = getIndents(nestingLevel);
      const newValueString = getValueString(newValue, nestingLevel);
      return `${indents.onUpLevel}  + ${key}: ${newValueString}`;
    },
  },
];

const formatRegular = (ast) => {
  const format = (arr) => {
    const result = arr.map((it) => {
      const {
        state,
        nestingLevel,
        key,
        oldValue,
        newValue,
        children,
      } = it;
      const { toString } = getPropertyAction(propertyActions, 'state', state);
      const indents = indentation.repeat(nestingLevel);

      if (children) {
        return `${indents}${key}: {\n${format(children)}\n${indents}}`;
      }

      return toString(nestingLevel, key, oldValue, newValue);
    });

    return result.join('\n');
  };

  return `{\n${format(ast)}\n}`;
};


export default formatRegular;
