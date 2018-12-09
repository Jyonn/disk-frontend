import {Injectable} from "@angular/core";
import {BaseService} from "./base.service";
import {User} from "../models/user/user";
import {Subject} from "rxjs/Subject";
import {ResourceTreeService} from "./resource-tree.service";

@Injectable()
export class UserService {
  public oauth_uri = 'https://sso.6-79.cn/oauth/?app_id=R41nXZEwpfl6tw6KYyoEZ4FYST4BXPlF';
  public user: User;
  public user_update_center = new Subject<User>();
  public has_get_user: boolean;

  constructor(
    private baseService: BaseService,
    private resTreeService: ResourceTreeService,
  ) {
    BaseService.token = BaseService.loadToken();
    this.user = null;
    this.has_get_user = false;
  }

  public exit() {
    window.localStorage.removeItem('token');
    this.user = null;
    BaseService.token = null;
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
        this.has_get_user = true;
        this.resTreeService.init_root(this.user.root_res);
        return this.user;
      })
      .catch((error) => {
        // console.log(error);
        BaseService.token = null;
        this.user_update_center.next(null);
        this.has_get_user = true;
        throw error;
        // BaseService.token_center.next(null);
      });
  }

  public api_qtb_oauth_check(data: {code: string}) {
    return this.baseService
      .get('/api/oauth/qtb/callback', data);
  }

  get has_login() {
    return this.user;
  }
}
