const modifyTemplate = (template, modifiers) => {
  const details = Object.keys(modifiers).reduce((page, modifier) => page.replaceAll(`{${modifier}}`, modifiers[modifier]),
    template);
  return details;
};
exports.modifyTemplate = modifyTemplate;
