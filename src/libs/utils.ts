import AWS from "aws-sdk";
import { GetObjectOutput } from "aws-sdk/clients/s3";
import * as Busboy from "busboy";

const S3 = new AWS.S3();
export default class UtilsService {
  public static generateGuid(): string {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (c) {
        var r = (Math.random() * 16) | 0,
          v = c == "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      }
    );
  }

  public static parseFormDataToFile(event: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const busboy = Busboy({
        headers: {
          ...event.headers,
          "content-type":
            event.headers["Content-Type"] || event.headers["content-type"],
        },
      });

      let result = {
        files: [],
      };

      busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
        file.on("data", (data) => {
          result.files.push({
            file: data,
            fileName: filename,
            contentType: mimetype,
          });
        });
      });

      busboy.on("field", (fieldname, value) => {
        try {
          result[fieldname] = JSON.parse(value);
        } catch (err) {
          result[fieldname] = value;
        }
      });

      busboy.on("error", (error) => reject(`Parse error: ${error}`));
      busboy.on("finish", () => {
        event.body = result;
        resolve(event);
      });

      busboy.write(event.body, event.isBase64Encoded ? "base64" : "binary");
      busboy.end();
    });
  }

  public static getResource(resourcePath: string): Promise<GetObjectOutput> {
    let params = {
      Bucket: "update-to-s3-minhthong",
      Key: resourcePath,
    };

    return new Promise((resolve, reject) => {
      S3.getObject(params, (err, data) => {
        if (err) {
          return resolve(null);
        }
        if (data) {
          return resolve(data);
        }
      });
    });
  }
}
