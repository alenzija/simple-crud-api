import { type IncomingMessage, type ServerResponse } from 'node:http';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import { v4 as uuidv4} from 'uuid';

import * as UserService from 'services/users';
import * as UserIDService from 'services/userId';
import { setUsers, users } from 'db/users';

describe('Server tests', () => {
    let res: Partial<ServerResponse>;

   beforeEach(() => {
    res = {
      writeHead: vi.fn(),
      end: vi.fn(),
    };
    setUsers([]);
  });

  test('GET users response with 200', async () => {
    const req = { method: 'GET' };
    UserService.resolveUsers(req as IncomingMessage, res as ServerResponse);

    expect(res.writeHead).toHaveBeenCalledWith(200, { 'Content-Type': 'application/json' });
    expect(res.end).toHaveBeenCalledWith(JSON.stringify([]));
  });

  test('POST User responds with 200', async () => {
    users.push({ id: uuidv4(), name: 'Test', age: 25, hobbies: [] });
    const req = {};

    UserService.getUsers(req as IncomingMessage, res as ServerResponse);

    expect(res.writeHead).toHaveBeenCalledWith(200, { 'Content-Type': 'application/json' });
    expect(res.end).toHaveBeenCalledWith(JSON.stringify(users));
  });

  test('GET user by ID response with 200', async () => {
    const userId = uuidv4();
    setUsers([{ id: userId, name: 'Test', age: 30, hobbies: [] }]);
    const req = { method: 'GET', url: `/api/users/${userId}` };

    UserIDService.resolveUserId(req as IncomingMessage, res as ServerResponse);

    expect(res.writeHead).toHaveBeenCalledWith(200, { 'Content-Type': 'application/json' });
    expect(res.end).toHaveBeenCalledWith(JSON.stringify(users[0]));
  });

  test('Method not allowed', () => {
    const req = { method: 'PATCH', url: `/api/users/${uuidv4()}` };

    UserIDService.resolveUserId(req as IncomingMessage, res as ServerResponse);

    expect(res.writeHead).toHaveBeenCalledWith(405, { 'Content-Type': 'text/plain' });
    expect(res.end).toHaveBeenCalledWith('Method Not Allowed');
  });

});