class Sessions {
  #sessions;
  constructor() {
    this.#sessions = {};
  }

  add(session) {
    this.#sessions[session.sessionId] = session;
  }

  remove(sessionId) {
    delete this.#sessions[sessionId];
  }

  getSession(sessionId) {
    return this.#sessions[sessionId];
  }

  isPresent(sessionId) {
    return this.#sessions[sessionId] !== undefined;
  }
  getInfo() {
    return this.#sessions;
  }
}

module.exports = { Sessions };