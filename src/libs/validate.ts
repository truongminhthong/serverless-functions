import { ValidatorOptions, validate } from "class-validator";

export const validateModel = async (model: any, options?: ValidatorOptions): Promise<{
  isValid: boolean,
  errorMessages?: string
}> => {
  const result = await _validateModel(model, options || { whitelist: true});
  if(result.isValid) return {
    isValid: true
  };
  const keys = Object.keys(result.errors);
  const errorMessages = keys
    .map(key => {
      const error = result.errors[key];
      const errorKey = Object.keys(error);
      return errorKey.map(errorKeys => error[errorKeys]).join(", \n");
    })
    .join(", \n");
  return {
    isValid: false,
    errorMessages
  };
};

const _validateModel = async (
  model: any,
  options?: ValidatorOptions
): Promise<any> => {
  const errors = await validate(model, { ...options });
  return errors.reduce(
    (acc: any, err): any => {
      const isValidKey = "isValid";
      const errorsKey = "errors";
      acc[isValidKey] = false;
      const { constraints, property } = err;
      acc[errorsKey][property] = constraints;
      return acc;
    },
    { isValid: true, errors: {} }
  );
};