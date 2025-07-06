interface IReport {
    dataVideo: IShortVideo,
    dataReport: IDataReport[],
    total: number
}

interface IDataReport {
    _id: string,
    userName: string,
    reasons: string,
    createdAt: string,
    updatedAt: string
    
}

interface IReportMusic {
    dataMusic: IMusic,
    dataReport: IDataReport[],
    total: number
}

interface IDataReport {
    _id: string,
    userName: string,
    reasons: string
}