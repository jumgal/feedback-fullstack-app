import { GeneralError } from "../errors/general-error.js";

export const errorHandler = (err, req, res, next) => {
  // console.log("err middle", err);
  // console.log('res status ', res.statusCode)
  // const statusCode = res.statusCode ? res.statusCode : 500;
  // res.status(statusCode);
  // res.json({
  //   message: err.message,
  // });
  
  console.log('errr middleware ', err)
  if (err instanceof GeneralError) {
    return res.status(err.getCode()).json({
      message: err.message
    });
  }

  return res.status(500).json({
    message: err.message
  });
};
