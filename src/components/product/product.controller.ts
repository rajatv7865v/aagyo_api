import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { ProductService } from "./product.service";

@Controller("products")
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post("add")
  @HttpCode(HttpStatus.CREATED)
  addProduct() {
    return this.productService.addProduct();
  }
}
