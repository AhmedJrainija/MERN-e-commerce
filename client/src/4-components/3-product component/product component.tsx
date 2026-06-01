import type { ProductDTO } from "../../7-types/dto/productDTO";


export function Product(props: ProductDTO) {

  return (
    <div>
      <img src={props.pictureName}crossOrigin="use-credentials" />
      <p>{props.price.toFixed(2)} MAD</p>
    </div>
  )
}