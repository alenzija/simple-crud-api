import { type ServerResponse, type IncomingMessage } from "node:http";
import { setUsers, users } from "../db/users";

export const resolveUserId = (req: IncomingMessage, res: ServerResponse<IncomingMessage>) => {
  try {
    const id = req.url?.split('/').pop();
    if (!id) {
      return;
    }
      if (!/^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i.test(id)) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(`User's id is invalid`);
        return;
      }
    if (req.method === 'GET') {
      getUser(res, id);
    } else if (req.method === 'PUT') {
      updateUser(req, res);
    } else if (req.method === 'DELETE') {
      deleteUser(res, id);
    } else {
      res.writeHead(405, { 'Content-Type': 'text/plain' });
      res.end('Method Not Allowed');
    }
  } catch (e) {
    console.error(e);
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Something went wrong');
  }
}

const getUser = async (res: ServerResponse, id: string) => {
  const user = users.find((user) => user.id === id);
  if (user) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(user));
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(`User with id=${id} doesn\'t exist`);
  }
};

const updateUser = async (req: IncomingMessage, res: ServerResponse) => {
  const id = req.url?.split('/').pop();
  let requestBody = '';
  req.on('data', (chunk) => {
      requestBody += chunk.toString();
  });

  req.on('end', async () => {
    const userData = JSON.parse(requestBody);
    const { name, age, hobbies } = userData;
    if (!name && !age && !hobbies) {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end('Body must contain name, age or hobbies fields');
      return;
    }
    if (
      (name && typeof name !== 'string')
      || (age && typeof age !== 'number')
      || (hobbies && (!Array.isArray(hobbies) || hobbies.some((item) => typeof item !== 'string')))
      ) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end('Wrong type');
        return;
    }
    const user = users.find((user) => user.id === id);
    if (!user) {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(`User with id=${id} doesn\'t exist`);    
      return;
    }
    setUsers(users.map((user) => user.id === id ? {...user, ...userData }: user));
    res.writeHead(201, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(users));
  });
}

const deleteUser = async (res: ServerResponse, id: string) => {
  const user = users.find((user) => user.id === id);
  if (user) {
    setUsers(users.filter((user) => user.id !== id));
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(user));
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(`User with id=${id} doesn\'t exist`);
  }
};
