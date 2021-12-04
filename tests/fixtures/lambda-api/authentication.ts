import { Request } from 'lambda-api';

export function lambdaAuthorization(req: Request, name: string, scopes?: string[]): Promise<any> {
  if (name === 'api_key') {
    let token;
    if (req.query && req.query.access_token) {
      token = req.query.access_token;
    } else {
      return Promise.reject({});
    }

    if (token === 'abc123456') {
      return Promise.resolve({
        id: 1,
        name: 'MLK',
      });
    } else if (token === 'xyz123456') {
      return Promise.resolve({
        id: 2,
        name: 'John Lewis',
      });
    } else {
      return Promise.reject({});
    }
  } else {
    if (req.query && req.query.tsoa && req.query.tsoa === 'abc123456') {
      return Promise.resolve({});
    } else {
      return Promise.reject({});
    }
  }
}
