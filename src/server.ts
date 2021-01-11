import 'dotenv/config';
import App from './app';
import validateEnv from './utils/validateEnv';

import IndexRoute from './routes/index.route';
import AuthRoute from './routes/auth.route';
import ProductRoute from './routes/product.route';

validateEnv();

process.on('uncaughtException', function (exception) {
  console.log(exception); // to see your exception details in the console
  // if you are on production, maybe you can send the exception details to your
  // email as well ?
});

(async () => {
  const app = await new App([new IndexRoute(), new AuthRoute(), new ProductRoute()]);
  app.listen();
})();
