"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hello = void 0;
const hello = (event) => {
    return {
        statusCode: 200,
        body: JSON.stringify({
            message: "Go Serverless v3.0! Your function executed successfully!"
        }, null, 2),
    };
};
exports.hello = hello;
//# sourceMappingURL=handler.js.map