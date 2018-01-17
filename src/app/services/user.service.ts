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
      "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdmF0YXIiOiJodHRwczovL3Jlcy42LTc5LmNuL2Rpc2svdXNlci8yL2F2YXRhci8x" +
      "NTE1ODEwMTQ3LjI0MTk2OC9hbmRyZXctcmlkbGV5LTc2NTQ3LmpwZy1zbWFsbD9lPTE1MTYwODgzMDEmdG9rZW49b1g2akptanVkUC0zQ" +
      "lhISjNBOGxZakVRUmxRSEJjNzA3MzRaeVRSNDpkMVMyOUVOc0ZwLWRxT3B2aGlIVTdhczFhSE09IiwidXNlcl9pZCI6Miwibmlja25hbW" +
      "UiOiJcdTVkZTVcdTUyMDAiLCJjdGltZSI6MTUxNjA4NDcwMS4xMTEzNDMsImV4cGlyZSI6ODY0MDAsInVzZXJuYW1lIjoiZ29uZ2RhbyJ" +
      "9.f7417uXwWy3PmirYTpEafC8Z8g3F5M_M7TiWuJbJ-9w";
  }

  public api_get_token(username: string, password: string) {
    const data = {
      username: username,
      password: password,
    };
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

  public api_create_user(username: string, password: string, nickname: string) {
    const data = {
      username: username,
      password: password,
      nickname: nickname,
    };
    return this.baseService
      .post('/api/user/', data)
      .then(body => {
        return body;
      });
  }

  public api_change_password(password: string, old_password: string) {
    const data = {
      password: password,
      old_password: old_password,
    };
    return this.baseService
      .put('/api/user/', data);
  }

  public api_get_avatar_token(filename: string) {
    const data = {
      filename: filename,
    };
    return this.baseService
      .get('/api/user/avatar', data);
  }

  get has_login() {
    return this.user;
  }
}
