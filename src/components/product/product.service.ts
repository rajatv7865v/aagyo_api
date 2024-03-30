import { Inject, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { CrudService } from "src/base/crud.service";

@Injectable()
export class ProductService extends CrudService {
  // constructor(
  //     @InjectModel()
  //     private readonly productModule:
  // ){
  //     super()
  //   }

  addProduct(): any {
      try {
        
    } catch (err) {
      throw err;
    }
  }
}
