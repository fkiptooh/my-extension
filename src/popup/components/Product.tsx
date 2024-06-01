import { useProducts } from "../../hooks/useProducts"

export const Product = () => {
    const product = useProducts();
    return (
        <div>
            {/*A component to fetch all products from local storage*/}
            {JSON.stringify(product[0])}
        </div>
    )
}