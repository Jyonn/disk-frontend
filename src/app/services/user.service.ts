import {Injectable} from "@angular/core";
import {BaseService} from "./base.service";

@Injectable()
export class UserService {
  constructor(private baseService: BaseService) {
    const token = window.localStorage.getItem('token');
    // console.log(token);
    if (token) {
      baseService.user.token = token;
    }
  }

  public api_get_token(username: string, password: string) {
    const data = {
      username: username,
      password: password,
    };
    return this.baseService
      .post('/api/user/token', data)
      .then(body => {
          this.baseService.user = body;
          window.localStorage.setItem('token', body.token);
          return body;
      });
  }

  public api_get_info() {
    return this.baseService
      .get('/api/user/')
      .then(body => {
          body.token = this.baseService.get_token();
          this.baseService.user = body;
          return body;
      })
      .catch(() => {
        this.baseService.user.token = null;
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
        console.log(body);
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
}
