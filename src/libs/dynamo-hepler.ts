import AWS from "aws-sdk";
import IBaseModel from "./base.model";

export default class DynamoHepler<T extends IBaseModel> {
  private readonly _tableName: string;
  private readonly _documentClient: AWS.DynamoDB.DocumentClient;

  constructor(tableName: string) {
    this._tableName = tableName;
    this._documentClient = new AWS.DynamoDB.DocumentClient();
  }

  public async get(key: string, value: string): Promise<T> {
    const params = {
      TableName: this._tableName,
      Key: {
        [key]: value,
      },
    };
    const result = await this._documentClient.get(params).promise();
    if (!result || !result.Item) {
      return null;
    }
    return result.Item as T;
  }

  public async write(data: T): Promise<T> {
    if (!data.id) {
      throw Error("no id on the data");
    }

    data = {
      ...data,
      createdAt: new Date().getTime(),
      updatedAt: new Date().getTime(),
    };

    const params = {
      TableName: this._tableName,
      Item: data,
    };

    const res = await this._documentClient.put(params).promise();

    if (!res) {
      throw Error(
        `There was an error inserting ID of ${data.id} in table ${this._tableName}`
      );
    }

    return data;
  }

  public async gets(params: { [key: string]: any }): Promise<{
    data: T[];
    lastEvaluatedKey: string;
  }> {
    let result, ExclusiveStartKey;
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

    if (filterExpression) {
      result = await this._documentClient
        .scan({
          TableName: this._tableName,
          ExclusiveStartKey,
          FilterExpression: filterExpression,
          ExpressionAttributeValues: expressionAttributeValues,
        })
        .promise();
    } else {
      result = await this._documentClient
        .scan({
          TableName: this._tableName,
          ExclusiveStartKey,
        })
        .promise();
    }

    // return items and lastEvaluatedKey
    return {
      data: result.Items,
      lastEvaluatedKey: result.LastEvaluatedKey,
    };
  }

  public async update(
    id: string,
    body: {
      [key: string]: any;
    }
  ): Promise<T> {
    let updateExpression: string = "";
    let expressionAttributeValues: { [key: string]: any } = {};
    body = {
      ...body,
      updatedAt: new Date().getTime(),
    };
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

    if (!updateExpression) {
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
      ReturnValues: "ALL_NEW",
    };
    const res = await this._documentClient.update(params).promise();
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
    const result = await this._documentClient.delete(params).promise();
    if (!result) {
      throw Error(
        `There was an error deleting ID of ${value} in table ${this._tableName}`
      );
    }
    return true;
  }
}
