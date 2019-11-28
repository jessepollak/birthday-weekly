import { Express } from 'express'

exports.initialize = function(app: Express) {
  app.get('/', (req, res) => {
    console.log('Hello world received a request.');

    const target = process.env.TARGET || 'World';
    res.send(`Hello ${target}!`);
  });
}