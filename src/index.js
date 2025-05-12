import { createServer } from 'node:http';

const port = process.env.PORT || 3000;

const server = createServer((req, res) => {
  if (!req.url) {
    return;
  }
    console.log(req, res);
  
});

server.listen(port);