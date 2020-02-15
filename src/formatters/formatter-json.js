const extraKeys = ['nestingLevel', 'keysChain'];

const formatJson = (ast) => {
  const format = (arr) => arr.map((obj) => {
    const allKeys = Object.keys(obj);
    const result = allKeys
      .filter((i) => !extraKeys.includes(i))
      .reduce((acc, i) => ({ ...acc, [i]: obj[i] }), {});

    if (!obj.children) {
      return result;
    }

    return { ...result, children: format(obj.children) };
  });

  return JSON.stringify(format(ast), null, 2);
};

export default formatJson;
