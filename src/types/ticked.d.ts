interface ITicked {
  userData: IUserTicked;
  tickedRequests: IDataReport[];
}

interface IUserTicked {
  _id: string;
  userName: string;
  email: string;
}

interface ITickedRequests {
  status: string;
}
