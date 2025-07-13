interface IQuery {
    filter?: string,
    skip?: number,
    top?: number
    search?: string
    count?: boolean,
    orderBy?: string
}

interface IListOdata<T> {
    '@odata.count'?: number;
    '@odata.nextLink'?: string;
    '@odata.context'?: string;
    value: T[]
}
interface Product {
    ShopId: string?,
    Name: string?,
    Description: string?,
    ImageUri: string?,
    IsHidden: boolean?,
    CategoryId: string?,
    PriceRange: string?,
    Price: number?,
    AveragePoint: number?,
    RateTurn: number?,
    Order: number?,
    Id: string?,
    CreateAt: Date?,
    UpdateAt: Date?,
    Category: ICategory?
}

interface Id {
    id: string
}

interface IProductOption {
    ProductId: string?,
    Image: string?,
    Color: string?,
    Type: string?,
    Price: number?,
    Quantity: number?,
    Id: string?,
    CreateAt: Date?,
    UpdateAt: Date?
}

interface Images {
    listImage: string[]
}

interface ProductVariant {
    SizeId: string?,
    ProductOptionId: string?,
    Quantity: number?,
    Price: number?,
    Id: string?,
    CreateAt: Date?,
    UpdateAt: Date?
}