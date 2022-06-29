const fs = require("fs");

const tag = (name, content) => `<${name}>${content}</${name}>`

const createRow = (headers, entry, type) => {
  const data = headers.reduce((row, header) => row + tag(type, entry[header]), '');
  return tag('tr', data);
};

class Comments {
  #comments
  constructor() {
    this.#comments = [];
  }

  add(entry) {
    this.#comments.push(entry);
  }

  set priorComments(records) {
    this.#comments.push(...records);
  }

  set reference(path) {
    this.refPath = path;
  }

  toTable(headers, order) {
    let comments = this.#comments;
    if (order === 'reverse') {
      comments = comments.reverse();
    }
    const tableHeader = headers.reduce((row, header) => row + tag('th', header), '');
    const tableData = comments.map((comment) => createRow(headers, comment, 'td')).join('');
    return tag('table', tableHeader + tableData);
  }

  save(file) {
    fs.writeFileSync(file || this.refPath, JSON.stringify(this.#comments), 'utf8');
  }
}

module.exports = { Comments };