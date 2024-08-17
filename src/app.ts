// Dependencies
import * as express from 'express';
import * as serverless from "serverless-http";
import { InputLogger } from './middlewares/input-logger.middleware';
import { AdminRouter } from './routes/admin.routes';
import { PublicRouter } from './routes/public.routes';

export const app = express();

const setupApp = async () => {
  // parse json request body
  app.use(express.json());

  // parse urlencoded request body
  app.use(express.urlencoded({ extended: true }));

  app.use(InputLogger('APP'));
  // app.use(Cors());
  // app.use(InputValidator());

  app.use(PublicRouter);
  app.use(AdminRouter);

  return true;
}

module.exports.handler = async (event: any, context: any) => {
  try {
    const setupComplete = await setupApp();

    if (!setupComplete) {
      throw new Error('Setup failed');
    }

    const serverlessHandler = serverless(app);

    return await serverlessHandler(event, context);
  } catch (error) {
    console.error('Error during Lambda execution:', error);

    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' }),
    };
  }
}