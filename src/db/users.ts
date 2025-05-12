import type { User } from "../types";

export let users: User[] = [];

export const setUsers = (newUsers: User[]) => {
  users = newUsers;
}
