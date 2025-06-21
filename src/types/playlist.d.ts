interface IPlaylist {
    _id: string,
    userId: string,
    name: string,
    description: string,
    image: string,
    createdAt: string,
    updatedAt: string,
}

interface IMusicInPlaylist {
    _id: string,
    playlistId: {
        _id: string,
        userId: string,
        name: string,
        description: string,
        image: string,
        createdAt: string,
        updatedAt: string,
    },
    musicId: {
        _id: string,
        musicUrl: string,
        musicDescription: string,
        musicThumbnail: string,
        musicLyric: string,
    },
    createdAt: string,
    updatedAt: string,
}
