const fs = require("fs");

const tag = (name, content) => `<${name}>${content}</${name}>`

const getDateTime = () => {
  const date = new Date();
  return date.toLocaleString();
};

const createRow = ({ name, comment, dateTime }, type) => {
  const data = tag(type, dateTime) + tag(type, name) + tag(type, comment);
  return tag('tr', data);
};

class Comments {
  #comments
  #headers
  constructor() {
    this.#comments = [];
    this.#headers = { dateTime: 'DateTime', name: 'Name', comment: 'Comment' };
  }

  add(name, comment) {
    this.#comments.push({ name, comment, dateTime: getDateTime() });
  }

  retrieve(path) {
    this.#comments.push(...JSON.parse(fs.readFileSync(path, 'utf8')));
  }

  toTable() {
    const tableData = this.#comments.map((comment) => createRow(comment, 'td')).join('');
    const tableHeader = createRow(this.#headers, 'th');
    return tag('table', tableHeader + tableData);
  }

  save(path) {
    fs.writeFileSync(path, JSON.stringify(this.#comments), 'utf8');
  }
}

module.exports = { Comments };