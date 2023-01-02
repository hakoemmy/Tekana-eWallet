import * as Joi from "joi";
import { ConfigModuleOptions } from "@nestjs/config";
import { EVK, NODE_ENV } from "./__helpers__";

export const configModuleOptions: ConfigModuleOptions = {
  isGlobal: true,
  validationSchema: Joi.object({
    [EVK.NODE_ENV]: Joi.string()
      .required()
      .valid(...Object.values(NODE_ENV).filter((item) => isNaN(Number(item)))),
    [EVK.PORT]: Joi.number().required(),
    [EVK.RELEASE_VERSION]: Joi.string().default("0.0.0"),
    [EVK.DATABASE_URL]: Joi.string().required(),
    [EVK.JWT_AT_SECRET]: Joi.string().required(),
    [EVK.JWT_AT_EXP]: Joi.number().required(),
    [EVK.JWT_RT_SECRET]: Joi.string().required(),
    [EVK.JWT_RT_EXP]: Joi.number().required(),
  }),
};
