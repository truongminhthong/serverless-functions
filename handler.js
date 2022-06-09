"use strict";

module.exports.hello = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: "Go Serverless v3.0! Your function executed successfully!"
      },
      null,
      2
    ),
  };
};


module.exports.jsonData = async (event, context, callback) => {
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: "Json Data!"
      },
      null,
      2
    ),
  };
};