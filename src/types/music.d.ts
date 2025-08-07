interface IMusic {
    _id: string,
    musicUrl: string,
    totalFavorite: number,
    totalShare: number
    userId: {
        _id: string,
        userName: string,
        fullname: string,
        email: string,
    },
    musicDescription: string,
    isBlock: boolean,
    musicThumbnail: string,
    musicTag: { _id: string, fullname: string }[],
    totalListener: number,
    totalComment: number,
    totalReactions: number,
    musicLyric: { start: number, end: number, text: string }[],
    createdAt: string,
    updatedAt: string,
    isDelete: boolean,
    flag: boolean,
    musicSeparate: string[]
    isKaraoke: boolean,
}