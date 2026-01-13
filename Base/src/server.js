require('dotenv').config();
require('reflect-metadata');

const createContainer = require('./container');
const createApp = require('./app');

async function bootstrap() {
  const container = await createContainer();
  const app = createApp(container);

  app.listen(process.env.PORT_APP, () => {
    console.log(`🚀 Server running on port ${process.env.PORT_APP}`);
  });
}

bootstrap().catch((err) => {
  console.error('🔥 Fatal startup error');
  console.error(err);
  process.exit(1);
});

module.exports = bootstrap;