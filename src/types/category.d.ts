interface ICategory {
    Id: string,
    Name: string,
    ParentId: string,
    CreateAt: Date,
    UpdateAt: Date
}

interface ISize {
    Id: string,
    CategoryId: string?,
    Size: string,
    CreateAt: Date,
    UpdateAt: Date
}

interface CategorySize {
    id: string,
    categoryId: string?,
    size: string,
    createAt: Date,
    updateAt: Date
}