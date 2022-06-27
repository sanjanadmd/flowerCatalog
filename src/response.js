const assert = require('assert');

const EOL = '\r\n';

const statusMessages = {
  200: 'ok', 404: 'file not found'
};

class Response {
  #socket;
  #statusCode;
  #headers;
  constructor(socket) {
    this.#socket = socket;
    this.#statusCode = 200;
    this.#headers = {};
  }

  #write(content) {
    this.#socket.write(content);
  }

  #end() {
    this.#socket.end();
  }

  setHeader(key, value) {
    this.#headers[key] = value;
  }
  statusLine() {
    const httpVersion = 'HTTP/1.1';
    const statusMessage = statusMessages[this.#statusCode];
    return [httpVersion, this.#statusCode, statusMessage].join(' ') + EOL;
  }

  getHeaders() {
    Object.entries(this.#headers).forEach(([key, value]) => {
      this.#write(`${key}:${value}${EOL}`);
    });
  }

  send(content) {
    this.setHeader('Content-Length', content.length);
    this.#write(this.statusLine());
    this.getHeaders();
    this.#write(EOL);
    this.#write(content);
  }

  set statusCode(status) {
    this.#statusCode = status;
  }

  equals(otherResponse) {
    return otherResponse instanceof Response &&
      assert.deepStrictEqual(this.#socket, otherResponse.#socket) &&
      this.#statusCode === otherResponse.#statusCode;
  }
}

module.exports = { Response };