const { app } = require('./src/app.js');

const PORT = 9000;

app().listen(PORT, () => { console.log(`listening on port ${PORT}`) });
