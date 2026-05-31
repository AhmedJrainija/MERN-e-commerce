import type { ProductDTO } from "../../7-types/dto/productDTO";
const BASE_URL = import.meta.env.VITE_API_URL;


export function Product(props: ProductDTO) {

  return (
    <div>
      <img src={`${BASE_URL}/products/${props.pictureName}`} crossOrigin="use-credentials" />
      <p>{props.price.toFixed(2)} MAD</p>
    </div>
  )
}