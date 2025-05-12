import { createServer } from 'node:http';
import { usersMatch, userIdMatch } from './routes';
import { resolveUsers, resolveUserId } from './services';

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