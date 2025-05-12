import { users } from "../db/users.js";

export const resolveUserId = (req, res) => {
  try {
    const id = req.url.split('/').pop();
    if (req.method === 'GET') {
      const user = getUser(id);
      if (user) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(user));
      } else if (!/^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i.test(id)){
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(`User's id is invalid`);
      } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(`User with id=${id} doesn\'t exist`);
      }
    }
  } catch (e) {
    console.error(e.message);
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Something went wrong');
  }
}

const getUser = (id) => users.find((user) => user.id === id);
