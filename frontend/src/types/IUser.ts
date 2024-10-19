interface IUser {
  _id: string;
  username: string;
  email: string;
  firstname: string;
  lastname: string;
  sex: string;
  role: string;
  createdAt?: string;
  updatedAt?: string;
  password: string;
  phone: string;

}

export default IUser