import 'reflect-metadata';
import express from 'express';
import routes from './routes';
import uploadConfig from './configs/uploadConfig';

import './database';

const app = express();
app.use('/files', express.static(uploadConfig.directory));
app.use(express.json());
app.use('/', routes);

app.listen(3333, () => {
  console.log('🚀server started on port 3333');
});
