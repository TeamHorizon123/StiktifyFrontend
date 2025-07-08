interface IQuery {
    page?: number,
    skip?: number,
    top?: number
    search?: string
    count?: boolean
}

interface IListOdata<T> {
    '@odata.count'?: number;
    '@odata.nextLink'?: string;
    '@odata.context'?: string;
    value: T[]
}

interface IProduct {
    Id: string,
    ShopId: string,
    Name: string,
    Thumbnail: string,
    Description: string,
    Price: number,
    Discount: number,
    Rating: number,
    Order: number,
    IsActive: boolean,
    CreateAt: Date,
    UpdateAt: Date,
}

interface Product {
    id: string,
    shopId: string,
    shop: Shop,
    name: string,
    thumbnail: string,
    description: string,
    ratingPoint: number,
    ratingTurn: number,
    order: number,
    rangePrice: string,
    isActive: boolean,
    createAt: Date,
    updateAt: Date
}

interface Id {
    id: string
}

interface IProductOption {
    Id: string,
    ProductId: string,
    Image: string,
    Quantity: number,
    Attribute: string,
    Value: string,
    CreateAt: Date,
    UpdateAt: Date
}

interface Images {
    listImage: string[]
}