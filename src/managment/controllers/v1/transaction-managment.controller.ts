import { Controller } from "@nestjs/common";
import { ApiResponse, ApiTags } from "@nestjs/swagger";
import { HttpExceptionSchema } from "../../../__helpers__";

@ApiTags("managment")
@Controller({ path: "transactions", version: "1" })
@ApiResponse({ type: HttpExceptionSchema, status: 500 })
export class TransactionManagmentControllerV1 {}