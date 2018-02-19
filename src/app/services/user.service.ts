import {Injectable} from "@angular/core";
import {BaseService} from "./base.service";
import {User} from "../models/user/user";
import {Subject} from "rxjs/Subject";

@Injectable()
export class UserService {
  public user: User;
  public user_update_center = new Subject<User>();
  constructor(private baseService: BaseService) {
    const token = window.localStorage.getItem('token');
    if (token) {
      BaseService.token = token;
    }
    this.user = null;
  }

  public exit() {
    window.localStorage.removeItem('token');
    this.user = null;
    BaseService.token = null;
  }

  public get_token(data: {username: string, password: string}) {
    return this.baseService
      .post('/api/user/token', data)
      .then(body => {
        this.user = new User(body);
        window.localStorage.setItem('token', body.token);
        BaseService.token = body.token;
        return body;
      });
  }

  public api_get_info() {
    // if (this.user) {
    //   return Promise.resolve(this.user);
    // }
    return this.baseService
      .get('/api/user/')
      .then(body => {
        this.user = new User(body);
        this.user_update_center.next(this.user);
        return this.user;
      })
      .catch((error) => {
        // console.log(error);
        BaseService.token = null;
        this.user_update_center.next(null);
        // BaseService.token_center.next(null);
      });
  }

  public api_get_user_info(user_id: number) {
    return this.baseService
      .get(`/api/user/${user_id}`);
  }

  public api_create_user(data: {username: string, password: string, nickname: string}) {
    return this.baseService
      .post('/api/user/', data)
      .then(body => {
        return body;
      });
  }

  public api_change_password(data: {password: string, old_password: string}) {
    return this.baseService
      .put('/api/user/', data);
  }

  public api_get_avatar_token(data: {filename: string}) {
    return this.baseService
      .get('/api/user/avatar', data);
  }

  public api_modify_user(data: {password: string, old_password: string, nickname: string}) {
    return this.baseService
      .put('/api/user/', data);
  }

  get has_login() {
    return this.user;
  }
}
