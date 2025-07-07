import Product from "@/components/page/shop/product/product"

const ListAllProduct = (data: Product[]) => {
    return (
        <div className="py-2 grid grid-cols-5 gap-2">
            <Product data={data} />
            <Product data={data} />
            <Product data={data} />
            <Product data={data} />
            <Product data={data} />
            <Product data={data} />
            <Product data={data} />
            <Product data={data} />
            <Product data={data} />
            <Product data={data} />
        </div>
    )
}

export default ListAllProduct