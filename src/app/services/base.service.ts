import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Resp} from "../models/resp";

@Injectable()
export class BaseService {
  public token: string;
  private host: string;
  constructor(
    private http: HttpClient,
  ) {
    this.host = "https://disk.6-79.cn";
    this.token = null;
  }
  private static handleError(error: any): Promise<any> {
    return Promise.reject(error);
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
          return BaseService.handleError(resp.msg);
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
