interface IProductRating {
    id: string,
    productId: string,
    optionId: string,
    userId: string,
    point: number,
    content: string,
    image: string[],
    createAt: Date,
    updateAt: Date
}