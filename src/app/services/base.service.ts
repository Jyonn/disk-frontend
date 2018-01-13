import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {User} from "../models/user";
import {Resp} from "../models/resp";

@Injectable()
export class BaseService {
  public user: User;
  private host: string;
  constructor(
    private http: HttpClient,
  ) {
    this.host = "http://localhost:8000";
    this.user = new User();
  }
  private static handleError(error: any): Promise<any> {
    // console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }
  get_option(data = {}) {
    const httpHeaders = new HttpHeaders({'Token': this.get_token()});
    // httpHeaders.append('Token', this.get_token());
    return {
      headers: httpHeaders,
      params: data,
    };
  }
  get_token() {
    return this.user && this.user.token || null;
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
