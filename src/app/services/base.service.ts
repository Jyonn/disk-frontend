import {Injectable} from "@angular/core";
import {HttpClient, HttpHandler, HttpHeaders} from "@angular/common/http";
import {Resp} from "../models/base/resp";
import {Observable} from "rxjs/Observable";
import {Subject} from "rxjs/Subject";
import {Info} from "../models/base/info";

@Injectable()
export class BaseService {
  public static asyc_working = 0;
  public static info_center = new Subject<Info>();
  public static token: string = null;
  public static relogin_warn = '应用权限变更，需要重新授权';
  // public static token_center = new Subject<string>();
  public front_host: string;
  public host: string;
  public short_link_host: string;
  private qn_host: string;
  public is_jumping: boolean;

  constructor(
    private http: HttpClient,
  ) {
    this.front_host = "https://d.6-79.cn";
    this.host = "https://disk.6-79.cn";
    this.qn_host = "https://up.qiniup.com";
    this.short_link_host = "https://s.6-79.cn";
    // this.token = null;
    this.is_jumping = false;
  }
  static saveToken(token) {
    window.localStorage.setItem('token', token);
    this.token = token;
  }
  static loadToken() {
    const token = window.localStorage.getItem('token');
    this.token = token;
    return token;
  }
  private static handleError(error: any): Promise<any> {
    BaseService.asyc_working -= 1;
    console.error(error);
    return Promise.reject(error);
  }
  private static handleHTTP(o: Observable<Object>) {
    return o.toPromise()
      .then((resp: Resp) => {
        if (resp.code !== 0) {
          // return BaseService.handleError(resp.msg);
          BaseService.info_center.next(new Info({text: resp.msg, type: Info.TYPE_WARN}));
          return Promise.reject(resp.msg);
        } else {
          BaseService.asyc_working -= 1;
          return resp.body;
        }
      })
      .catch(BaseService.handleError);
  }
  public static path_to_slug(path: Array<any>) {
    return path.join('-');
  }
  get_option(data = {}) {
    // console.log('base token: ' + BaseService.token);
    const httpHeaders = new HttpHeaders({'Token': BaseService.token || ''});
    // httpHeaders.append('Token', this.get_token());
    return {
      headers: httpHeaders,
      params: data,
    };
  }
  get(url: string, data: object = null) {
    BaseService.asyc_working += 1;
    return BaseService.handleHTTP(this.http.get(this.host + url, this.get_option(data)));
  }
  post(url: string, data) {
    BaseService.asyc_working += 1;
    return BaseService.handleHTTP(this.http.post(this.host + url, data, this.get_option()));
  }
  put(url: string, data) {
    BaseService.asyc_working += 1;
    return BaseService.handleHTTP(this.http.put(this.host + url, data, this.get_option()));
  }
  del(url: string) {
    BaseService.asyc_working += 1;
    return BaseService.handleHTTP(this.http.delete(this.host + url, this.get_option()));
  }
  random_image() {
    BaseService.asyc_working += 1;
    return BaseService.handleHTTP(this.http.get('https://unsplash.6-79.cn/random/info'));
  }
  get is_loading() {
    return BaseService.asyc_working > 0;
  }

  public api_upload_file(key: string, token: string, file: File) {
    const fd = new FormData();
    fd.append('key', key);
    fd.append('token', token);
    fd.append('file', file);
    return this.post_qn(fd);
  }
  post_qn(data) {
    BaseService.asyc_working += 1;
    return BaseService.handleHTTP(this.http.post(this.qn_host, data));
  }
}
