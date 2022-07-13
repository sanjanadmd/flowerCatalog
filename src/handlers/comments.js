const tag = (name, content) => `<${name}>${content}</${name}>`

const createRow = (headers, entry, type) => {
  const data = headers.reduce((row, header) =>
    row + tag(type, entry[header]), '');
  return tag('tr', data);
};

class Comments {
  #comments
  #read
  #write
  constructor(path, read, write) {
    this.refPath = path;
    this.#comments = [];
    this.#read = read;
    this.#write = write;
  }

  add(entry) {
    this.#comments.unshift(entry);
  }

  initialize() {
    this.priorComments = this.#read(this.reference);
  }

  save() {
    this.#write(this.reference, this.comments);
  }

  set priorComments(records) {
    this.#comments.push(...records);
  }

  get reference() {
    return this.refPath;
  }

  get comments() {
    return JSON.stringify(this.#comments);
  }

  toTable() {
    let comments = this.#comments;
    const headers = ['dateTime', 'name', 'comment'];
    const tableData = comments.map((comment) => createRow(headers, comment, 'td')).join('');
    return tableData;
  }

}

module.exports = { Comments };