import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { CrudService } from "src/base/crud.service";
import { InjectModel } from "@nestjs/mongoose";
import mongoose, { Model } from "mongoose";
import { JwtService } from "@nestjs/jwt";
import {
  ACCOUNTALREADYEXIST,
  MERCHANTNOTEXIST,
  REGISTER,
  REGISTERACCOUNT,
  SENDOTP,
  SIGNIN,
  WRONGOTP,
  WRONGPASSWORD,
} from "src/utils/messages";
import { MERCHANT_MODEL, MerchantDocument } from "src/Schema/merchant";
import { MerchantLoginDTO } from "../dto/merchantLogin.dto";
import { VerifyOTPDTO } from "../dto/verifyOTP.dto";
import { RegisterStoreDetailDTO } from "../dto/registerDTO/register-storeDetails.dto";
import { RegisterOwnerDetailDTO } from "../dto/registerDTO/register-ownerDetail.dto";
import { RegisterBankDetailDTO } from "../dto/registerDTO/register-bankDetails.dto";
import { RegisterDocumentDTO } from "../dto/registerDTO/register-document.dto";
import { jwtConstants } from "src/constants/auth.constant";
import { RegisterTime } from "../dto/registerDTO/register-registerTime.dto";
import { RegisterMerchantDTO } from "../dto/registerDTO/register.dto";
import { createToken, generateOTP, validateOTP } from "src/utils/helper";
import { ObjectId } from "mongodb";
import { BANKDETAIL_MODEL, BankDetailDocument } from "src/Schema/bankDetail";
import { STORE_MODEL, StoreDocument } from "src/Schema/store";
import {
  DOCUMENTDETAIL_MODEL,
  DocumentDetailDocument,
} from "src/Schema/documents";
import { S3Service } from "src/components/s3/s3.service";
import { Multer } from "multer";

@Injectable()
export class MerchantService extends CrudService {
  constructor(
    @InjectModel(MERCHANT_MODEL)
    private readonly merchantModel: Model<MerchantDocument>,
    @InjectModel(BANKDETAIL_MODEL)
    private readonly bankDetailModel: Model<BankDetailDocument>,
    @InjectModel(STORE_MODEL)
    private readonly storeModel: Model<StoreDocument>,
    @InjectModel(DOCUMENTDETAIL_MODEL)
    private readonly documentModel: Model<DocumentDetailDocument>,
    private jwtService: JwtService,
    private s3Service: S3Service
  ) {
    super(merchantModel);
  }

  async signInAccountByPhone(merchantLoginDTO: MerchantLoginDTO) {
    try {
      const { phoneNumber, countryCode, countryName } = merchantLoginDTO;

      const OTP = generateOTP();
      const TOKEN = createToken(OTP);

      // const delimiter = "|";
      // const code = atob(`${phoneNumber}${delimiter}${OTP}${delimiter}${TOKEN}`);
      // console.log("Code==>", code);
      // const decode = btoa(code);
      // console.log("decode==>", decode);

      return {
        status: "OTP_SEND_SUCESSFULLY",
        message: SENDOTP,
        OTP: OTP,
        OTP_TOKEN: TOKEN,
      };
    } catch (err) {
      throw err;
    }
  }

  async verifyOTP(verifyOTPDTO: VerifyOTPDTO) {
    try {
      const { phoneNumber, countryCode, countryName, OTP_TOKEN, OTP } =
        verifyOTPDTO;

      const isValidOTP = validateOTP(OTP, OTP_TOKEN);

      if (!isValidOTP) {
        throw new BadRequestException(WRONGOTP);
      }

      const merchant = await this.merchantModel.findOne({
        contact: phoneNumber,
      });

      let id;
      if (!merchant) {
        const result = await this.merchantModel.create({
          contact: phoneNumber,
        });
        return {
          id: result?._id,
          STEP: 1,
          statusCode: 2,
          status: "PENDING",
          message: REGISTERACCOUNT,
        };
      }
      id = merchant?._id;
      //REGISTER STATUS HANDLE

      const store = await this.storeModel.findOne({ merchant_id: id });
      if (!store) {
        return {
          id,
          STEP: 2,
          statusCode: 2,
          status: "PENDING",
          message: REGISTERACCOUNT,
        };
      }

      if (!store?.slots?.length || !store?.isFullTimeOpen) {
        return {
          id,
          STEP: 3,
          statusCode: 2,
          status: "PENDING",
          message: REGISTERACCOUNT,
        };
      }

      const bankDetail = await this.bankDetailModel.findOne({
        merchant_id: id,
      });
      if (!bankDetail) {
        return {
          id,
          STEP: 4,
          statusCode: 2,
          status: "PENDING",
          message: REGISTERACCOUNT,
        };
      }

      const document = await this.documentModel.findOne({ merchant_id: id });
      if (!document) {
        return {
          data: document,
          STEP: 5,
          statusCode: 2,
          status: "SUCCESS",
          message: REGISTERACCOUNT,
        };
      }

      let { name, email } = merchant;

      const payload = {
        sub: merchant?.id,
        userName: name,
        userEmail: email,
      };
      const access_token = await this.jwtService.signAsync(payload);
      return {
        statusCode: 1,
        status: "ACCOUNT_LOGIN_SUCCESSFULLY",
        access_token,
        message: SIGNIN,
      };
    } catch (err) {
      throw err;
    }
  }

  async registerOwnerDetail(registerOwnerDetailDTO: RegisterOwnerDetailDTO) {
    try {
      const { name, id, email } = registerOwnerDetailDTO;
      const result = await this.merchantModel.findByIdAndUpdate(
        { _id: new ObjectId(id) },
        {
          $set: {
            name,
            email,
          },
        }
      );
      return {
        status: "SUCCESS",
        message: REGISTERACCOUNT,
      };
    } catch (err) {
      throw err;
    }
  }

  async registerStoreDetail(
    registerStoreDetailDTO: RegisterStoreDetailDTO,
    banner: Express.Multer.File
  ) {
    try {
      const { id, address, category, city, country, storeName, state } =
        registerStoreDetailDTO;
      const uploadFile = await this.s3Service.uploadFile(banner);
      const result = await this.storeModel.create({
        merchant_id: new ObjectId(id),
        storeName,
        category,
        country,
        state,
        city,
        banner: uploadFile,
        address,
      });
      return {
        status: "SUCCESS",
        message: REGISTERACCOUNT,
      };
    } catch (error) {
      if (
        error.code === 11000 &&
        error.keyPattern &&
        error.keyPattern.merchant_id
      ) {
        throw new HttpException(
          `merchant id is Already in use.`,
          HttpStatus.CONFLICT
        );
      }
      throw error;
    }
  }

  async registerStoreTiming(registerTime: RegisterTime) {
    try {
      const { id, slots, isFullTimeOpen } = registerTime;

      const result = await this.storeModel.findOneAndUpdate(
        { merchant_id: new ObjectId(id) },
        {
          $set: {
            isFullTimeOpen,
            slots: [...slots],
          },
        }
      );
      return {
        status: "SUCCESS",
        message: REGISTERACCOUNT,
      };
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  async registerBankDetail(egisterBankDetailDTO: RegisterBankDetailDTO) {
    try {
      const {
        id,
        accountHolderName,
        accountNumber,
        accountType,
        email,
        mobile,
        name,
      } = egisterBankDetailDTO;
      const result = await this.bankDetailModel.create({
        merchant_id: new ObjectId(id),
        accountNumber,
        accountType,
        accountHolderName,
        name,
        email,
        mobile,
      });
      return {
        status: "SUCCESS",
        message: REGISTERACCOUNT,
      };
    } catch (err) {
      throw err;
    }
  }

  async registerDocuments(
    registerDocumentDTO: RegisterDocumentDTO,
    files: Array<Express.Multer.File>
  ) {
    try {
      const { documents, id } = registerDocumentDTO;
      const uploadedFiles = await this.s3Service.uploadMultipleFile(files);
      console.log(documents, "documents");
      console.log(id, "id");
      console.log(files, "files");
      const documentsData = [];

      for (let data of documents) {
        let obj = {
          documentName: data?.name,
          documentNumber: data?.number,
          documentImg: uploadedFiles?.filter(({ file }) => file == data.name),
        };
        documentsData.push(obj);
      }

      const result = await this.documentModel.create({
        merchant_id: new ObjectId(id),
        documents: documentsData,
      });
      console.log(result);

      return {
        status: "SUCCESS",
        message: "Document Saved Successfully!",
      };
    } catch (err) {
      throw err;
    }
  }

  async getStepById(id: ObjectId) {
    try {
      const store = await this.storeModel.findOne({ merchant_id: id });
      if (!store) {
        return {
          STEP: 2,
          statusCode: 2,
          status: "PENDING",
        };
      }

      if (!store?.slots?.length || !store?.isFullTimeOpen) {
        return {
          STEP: 3,
          statusCode: 2,
          status: "PENDING",
        };
      }

      const bankDetail = await this.bankDetailModel.findOne({
        merchant_id: id,
      });
      if (!bankDetail) {
        return {
          STEP: 4,
          statusCode: 2,
          status: "PENDING",
        };
      }

      const document = await this.documentModel.findOne({ merchant_id: id });
      if (!document) {
        return {
          STEP: 5,
          statusCode: 2,
          status: "SUCCESS",
        };
      }
    } catch (error) {
      throw error;
    }
  }
}
