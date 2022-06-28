const fs = require('fs');

const readFile = (file) => fs.readFileSync(file);

const listDirectory = (originalPath) => {
  let files = [];
  const paths = fs.readdirSync(originalPath);
  paths.forEach((path) => {
    const actualPath = `${originalPath}/${path}`;
    if (fs.statSync(actualPath).isDirectory()) {
      subDirFiles = listDirectory(actualPath);
      files.push(...subDirFiles);
      return;
    };
    files.push(actualPath);
  });
  return files;
};

const loadFileContents = (originalPath) => {
  const data = {};
  const files = listDirectory(originalPath);
  files.forEach((file) => {
    const content = readFile(file);
    data[file] = content;
  });
  return data;
};

module.exports = { loadFileContents, listDirectory, readFile };
