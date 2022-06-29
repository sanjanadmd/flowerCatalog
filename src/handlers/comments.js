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
  #path
  constructor(path) {
    this.#path = path;
    this.#comments = [];
  }

  add(entry) {
    this.#comments.push(entry);
  }

  retrieve(file) {
    this.#comments.push(...JSON.parse(fs.readFileSync(file, 'utf8')));
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
    fs.writeFileSync(file, JSON.stringify(this.#comments), 'utf8');
  }
}

module.exports = { Comments };