import { type ServerResponse, type IncomingMessage } from 'node:http';
import {v4 as uuidv4 } from 'uuid';

import { users } from '../db/users';

export const resolveUsers = async (req: IncomingMessage, res: ServerResponse) => {
  try {
    if (req.method === 'GET') {
      await getUsers(req, res);
    } else if (req.method === 'POST') {
      await createUser(req, res);
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

const getUsers = async (_: IncomingMessage, res: ServerResponse) => {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(users));
}

const createUser = async (req: IncomingMessage, res: ServerResponse) => {
  let requestBody = '';
  req.on('data', (chunk) => {
      requestBody += chunk.toString();
  });

  req.on('end', async () => {
      const userData = requestBody;
      const { name, age, hobbies } = JSON.parse(userData);
      const newUser = { id: uuidv4(), name, age, hobbies };
      users.push(newUser);
      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(newUser));
  });
}
