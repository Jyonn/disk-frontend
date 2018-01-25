import {Injectable} from "@angular/core";
import {BaseService} from "./base.service";
import {User} from "../models/user";

@Injectable()
export class UserService {
  public user: User;
  constructor(private baseService: BaseService) {
    // const token = window.localStorage.getItem('token');
    // if (token) {
    //   baseService.user.token = token;
    // }
    this.user = null;
    baseService.token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHBpcmUiOjYwNDgwMCwidXNlcl9pZCI6MiwiY3RpbWUiOjE1MTY4MjM1OTAuMTQyNT" +
      "cyfQ.UT2NVe7i2uQw6FqrBtVgf-xVkMULsc5Rf1OM_FtkXvk";
  }

  public api_get_token(data: {username: string, password: string}) {
    return this.baseService
      .post('/api/user/token', data)
      .then(body => {
        this.user = body;
        window.localStorage.setItem('token', body.token);
        return body;
      });
  }

  public api_get_info() {
    if (this.user) {
      return Promise.resolve(this.user);
    }
    return this.baseService
      .get('/api/user/')
      .then(body => {
        this.user = new User(body);
        return this.user;
      })
      .catch((error) => {
        // console.log(error);
        this.baseService.token = null;
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

  get has_login() {
    return this.user;
  }
}
