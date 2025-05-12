import { createServer } from 'node:http';
import { usersMatch } from './routes/usersMatch.js';
import { userIdMatch } from './routes/userId.js';
import { resolveUsers } from './services/users.js';
import { resolveUserId } from './services/userId.js';

const port = process.env.PORT || 3000;

const server = createServer((req, res) => {
  if (!req.url) {
    return;
  }
  if (usersMatch.test(req.url)) {
    resolveUsers(req, res);
    return
  }
  if(userIdMatch.test(req.url)) {
    resolveUserId(req, res);
    return;
  }
  res.writeHead(405, { 'Content-Type': 'text/plain' });
  res.end('Method Not Allowed');
  
});

server.listen(port);