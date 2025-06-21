interface IShortVideo {
  _id: string;
  videoUrl: string;
  totalFavorite: number;
  totalReaction: number;
  totalViews: number;
  totalComment: number;
  userId: IUserID;
  musicId: IMusic | string | null;
  videoDescription: string;
  isBlock: boolean;
  videoThumbnail: string;
  videoTag: any[];
  isDelete: boolean;
  flag: boolean;
  createdAt: string;
  updatedAt: string;
}

interface IUserID {
  _id: string;
  userName: string;
}
