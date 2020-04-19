import { Router } from 'express';

const routes = Router();

routes.get('/', (request, response) => {
  const message = 'Hello World';
  return response.json({ message });
});

export default routes;
