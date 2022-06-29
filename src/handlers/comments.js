const fs = require("fs");

const tag = (name, content) => `<${name}>${content}</${name}>`

const createRow = ({ name, comment, dateTime }, type) => {
  const data = tag(type, dateTime) + tag(type, name) + tag(type, comment);
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
    const tableData = comments.map((comment) => createRow(comment, 'td')).join('');
    const tableHeader = createRow(headers, 'th');
    return tag('table', tableHeader + tableData);
  }

  save(file) {
    fs.writeFileSync(file || this.refPath, JSON.stringify(this.#comments), 'utf8');
  }
}

module.exports = { Comments };