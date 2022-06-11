import AWS from "aws-sdk";
import IBaseModel from "./base.model";
const documentClient = new AWS.DynamoDB.DocumentClient();

export default class DynamoHepler<T extends IBaseModel> {
  private readonly _tableName: string;

  constructor(tableName: string) {
    this._tableName = tableName;
  }

  public async get(key: string, value: string): Promise<T> {
    const params = {
      TableName: this._tableName,
      Key: {
        [key]: value,
      },
    };
    const result = await documentClient.get(params).promise();
    if (!result || !result.Item) {
      return null;
    }
    return result.Item as T;
  }

  public async write(data: T): Promise<T> {
    if (!data.id) {
      throw Error("no id on the data");
    }

    const params = {
      TableName: this._tableName,
      Item: data,
    };

    const res = await documentClient.put(params).promise();

    if (!res) {
      throw Error(
        `There was an error inserting ID of ${data.id} in table ${this._tableName}`
      );
    }

    return data;
  }

  public async gets<T>(params: { [key: string]: any }): Promise<T[]> {
    let result,
      accumulated = [],
      ExclusiveStartKey;
    let filterExpression: string = "";
    let expressionAttributeValues: { [key: string]: any } = {};
    const items = Object.keys(params)
      .filter((key) => !!key && !!params[key])
      .map((key) => ({
        key,
        value: params[key],
      }));
    filterExpression = items
      .map((c) => `contains (${c.key}, :${c.key})`)
      .join(` and `);
    expressionAttributeValues = items.reduce(
      (
        previousValue: { [key: string]: any },
        currentValue: {
          key: string;
          value: any;
        }
      ) => {
        previousValue[`:${currentValue.key}`] = currentValue.value;
        return previousValue;
      },
      {}
    );

    do {
      if (filterExpression) {
        result = await documentClient
          .scan({
            TableName: this._tableName,
            ExclusiveStartKey,
            FilterExpression: filterExpression,
            ExpressionAttributeValues: expressionAttributeValues,
          })
          .promise();
      } else {
        result = await documentClient
          .scan({
            TableName: this._tableName,
            ExclusiveStartKey,
          })
          .promise();
      }

      ExclusiveStartKey = result.LastEvaluatedKey;
      accumulated = [...accumulated, ...result.Items];
    } while (result.Items.length && result.LastEvaluatedKey);

    return accumulated;
  }

  public async update(
    id: string,
    body: {
      [key: string]: any;
    }
  ): Promise<T> {
    let updateExpression: string = "";
    let expressionAttributeValues: { [key: string]: any } = {};
    const items = Object.keys(body)
      .filter((key) => !!key && !!body[key])
      .map((key) => ({
        key,
        value: body[key],
      }));

    updateExpression =
      items.length == 0
        ? ""
        : `set ${items.map((c) => `${c.key} = :${c.key}`).join(`, `)}`;
    expressionAttributeValues = items.reduce(
      (
        previousValue: { [key: string]: any },
        currentValue: {
          key: string;
          value: any;
        }
      ) => {
        previousValue[`:${currentValue.key}`] = currentValue.value;
        return previousValue;
      },
      {}
    );

    if(!updateExpression) {
      throw Error(
        `There was an error updating ID of ${id} in table ${this._tableName}. Body not null`
      );
    }

    const params = {
      TableName: this._tableName,
      Key: {
        id: id,
      },
      UpdateExpression: updateExpression,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: "ALL_NEW"
    };
    const res = await documentClient.update(params).promise();
    console.log('res', res);
    if (!res) {
      throw Error(
        `There was an error updating ID of ${id} in table ${this._tableName}`
      );
    }
    return res.Attributes as T;
  }

  public async delete(key: string, value: string): Promise<boolean> {
    const params = {
      TableName: this._tableName,
      Key: {
        [key]: value,
      },
    };
    const result = await documentClient.delete(params).promise();
    if (!result) {
      throw Error(
        `There was an error deleting ID of ${value} in table ${this._tableName}`
      );
    }
    return true;
  }
}
