import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {User} from "../models/user";
import {Resp} from "../models/resp";

@Injectable()
export class BaseService {
  public user: User;
  public token: string = null;
  private host: string;
  constructor(
    private http: HttpClient,
  ) {
    this.host = "https://disk.6-79.cn";
  }
  private static handleError(error: any): Promise<any> {
    // console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }
  get_option(data = {}) {
    const httpHeaders = new HttpHeaders({'Token': this.token});
    // httpHeaders.append('Token', this.get_token());
    return {
      headers: httpHeaders,
      params: data,
    };
  }
  get(url: string, data: object = null) {
    return this.http
      .get(this.host + url, this.get_option(data))
      .toPromise()
      .then((resp: Resp) => {
        if (resp.code !== 0) {
          return BaseService.handleError({message: resp.msg});
        } else {
          return resp.body;
        }
      })
      .catch(BaseService.handleError);
  }
  post(url: string, data) {
    return this.http
      .post(this.host + url, data, this.get_option())
      .toPromise()
      .then()
      .catch(BaseService.handleError);
  }
  put(url: string, data) {
    return this.http
      .put(this.host + url, data, this.get_option())
      .toPromise()
      .then()
      .catch(BaseService.handleError);
  }
  del(url: string) {
    return this.http
      .delete(this.host + url, this.get_option())
      .toPromise()
      .then()
      .catch(BaseService.handleError);
  }
}
