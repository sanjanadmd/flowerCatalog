const { createHandler } = require('./server/router.js');
const { getHandler } = require('./handlers/getHandlers.js');
const { methodNotAllowed } = require('./handlers/methodNotAllowed.js');

const handlers = [getHandler, methodNotAllowed];
const handler = createHandler({ handlers });

module.exports = { handler };
