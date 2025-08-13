interface IProductRating {
    ProductId: string,
    OptionId: string,
    VariantId: string,
    OrderId: string,
    UserId: string,
    Point: number,
    Content: string,
    Files: string[],
    Id: string,
    CreateAt: Date,
    UpdateAt: Date
}