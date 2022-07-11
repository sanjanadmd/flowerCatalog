const tag = (name, content) => `<${name}>${content}</${name}>`

const createRow = (headers, entry, type) => {
  const data = headers.reduce((row, header) =>
    row + tag(type, entry[header]), '');
  return tag('tr', data);
};

class Comments {
  #comments
  constructor(path) {
    this.refPath = path;
    this.#comments = [];
  }

  add(entry) {
    this.#comments.unshift(entry);
  }

  set priorComments(records) {
    this.#comments.push(...records);
  }

  get reference() {
    return this.refPath;
  }

  toTable() {
    let comments = this.#comments;
    const headers = ['dateTime', 'name', 'comment'];
    const tableData = comments.map((comment) => createRow(headers, comment, 'td')).join('');
    return tableData;
  }

  get comments() {
    return JSON.stringify(this.#comments);
  }
}

module.exports = { Comments };