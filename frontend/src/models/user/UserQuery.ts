export default interface UserQuery {
  firstName: string;
  lastName: string;
  username: string;
  page?: number;
  pageSize?: number;
  role: string;
}
