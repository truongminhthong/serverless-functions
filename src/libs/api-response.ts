export enum STATUS_CODE {
    OK = 200,
    CREATED = 201,
    NO_CONTENT = 204,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    METHOD_NOT_ALLOWED = 405,
    INTERNAL_SERVER_ERROR = 500
};

export class Responses {
  private static _formatJSONResponse(statusCode: STATUS_CODE, response: any) {
    return {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Methods': '*',
        'Access-Control-Allow-Origin': '*',
      },
      statusCode: statusCode,
      body: JSON.stringify(response)
    }
  }

  public static _200(data: any) {
    return this._formatJSONResponse(STATUS_CODE.OK, data);
  }

  public static _201(data: any) {
    return this._formatJSONResponse(STATUS_CODE.CREATED, data);
  }

  public static _400(data: any) {
    return this._formatJSONResponse(STATUS_CODE.BAD_REQUEST, data);
  }

  public static _404(data: any) {
    return this._formatJSONResponse(STATUS_CODE.NOT_FOUND, data);
  }

  public static _500(data: any) {
    return this._formatJSONResponse(STATUS_CODE.INTERNAL_SERVER_ERROR, data);
  }
}

export interface PaginationParams {
  limit: number;
  page: number;
  totalRows: number;
}

export interface ListResponse<T> {
  data: T[],
  pagination: PaginationParams;
}

export interface ListParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
  [key: string]: any;
}