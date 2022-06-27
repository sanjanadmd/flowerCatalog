const fs = require("fs");

const tag = (name, content) => `<${name}>${content}</${name}>`

class Comments {
  #comments
  constructor() {
    this.#comments = [];
  }

  add(name, comment) {
    const date = new Date();
    this.#comments.push({ name, comment, dateTime: date.toString() });
  }

  retrieve(path) {
    this.#comments.push(...JSON.parse(fs.readFileSync(path, 'utf8')));
  }

  toTable() {
    const tableData = this.#comments.map(({ name, comment, dateTime }) => {
      const data = tag('td', dateTime) + tag('td', name) + tag('td', comment);
      return tag('tr', data);
    }).join('');
    const headers = tag('th', 'DateTime') + tag('th', 'Name') + tag('th', 'Comment');
    const tableHeader = tag('tr', headers);
    return tag('table', tableHeader + tableData);
  }

  save(path) {
    fs.writeFileSync(path, JSON.stringify(this.#comments), 'utf8');
  }
}

module.exports = { Comments };