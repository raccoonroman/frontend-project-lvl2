const getPropertyAction = (propertyActions, name, currentName) => {
  const isCurrent = (obj) => obj[name] === currentName;
  return propertyActions.find(isCurrent);
};


export default getPropertyAction;
