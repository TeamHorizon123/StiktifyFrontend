interface IUserAddress {
    Id: string,
    UserId: string,
    Address: string,
    Receiver: string,
    PhoneReceive: string
    Note: string,
    CreateAt: Date,
    UpdateAt: Date
}

interface ICart {
    ProductId: string,
    Product: Product,
    OptionId: string,
    Option: IProductOption,
    VariantId: string,
    Variant: ProductVariant,
    ImageUri: string,
    UserId: string,
    Quantity: number,
    Id: string,
    CreateAt: Date,
    UpdateAt: Date
}

interface IOrder {
    Id: string,
    UserId: string,
    ShopId: string,
    AddressId: string,
    Address: IUserAddress,
    Shop: Shop,
    Status: string,
    Total: number,
    ShippingFee: number,
    OrderItems: IOrderItem[],
    CreateAt: Date,
    UpdateAt: Date
}


interface IOrderItem {
    Id: string,
    ProductVariantId: string,
    ProductVariant: ProductVariant,
    ProductId: string,
    Product: Product,
    Quantity: number,
    UnitPrice: number
    TotalPrice: number,
    CreateAt: Date,
    UpdateAt: Date,
    ImageURI: string
}

interface IPaymentMethod {
    Id: string,
    Name: string,
    Enable: boolean,
    CreateAt: Date,
    UpdateAt: Date
}