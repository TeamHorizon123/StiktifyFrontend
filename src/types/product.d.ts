interface IListOdata<T> {
    '@odata.count'?: number;
    '@odata.nextLink'?: string;
    '@odata.context'?: string;
    value: T[]
}

interface IProduct {
    Id: string?,
    ShopId: string?,
    Name: string?,
    Thumbnail: string?,
    Description: string?,
    Price: number,
    Discount: number,
    Rating: number,
    Order: number,
    IsActive: boolean,
    CreateAt: Date,
    UpdateAt: Date,
}