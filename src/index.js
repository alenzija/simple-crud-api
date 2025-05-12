import { createServer } from 'node:http';
import { usersMatch } from './routes/usersMatch.js';
import { resolveUsers } from './services/users.js';

const port = process.env.PORT || 3000;

const server = createServer((req, res) => {
  if (!req.url) {
    return;
  }
  if (usersMatch.test(req.url)) {
    resolveUsers(req, res);
  } else {
    res.writeHead(405, { 'Content-Type': 'text/plain' });
    res.end('Method Not Allowed');
  }
});

server.listen(port);