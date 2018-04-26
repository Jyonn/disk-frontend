import {Injectable} from "@angular/core";

@Injectable()
export class ProfileBtnService {
  b_enter_box: string;
  // b_modify_nickname: string;
  // b_modify_avatar: string;
  // b_modify_password: string;
  b_modify_info: string;
  b_code: string;
  b_active: string;
  b_exit: string;
  b_list: Array<string>;

  constructor() {
    this.b_enter_box = "进入我的浑天匣";
    this.b_modify_info = "个人信息";
    // this.b_modify_nickname = "修改昵称";
    // this.b_modify_avatar = "修改头像";
    // this.b_modify_password = "修改密码";
    this.b_code = "代码开源";
    this.b_exit = '退出登录';
    this.b_active = null;
    this.b_list = [
      this.b_enter_box,
      // this.b_modify_nickname,
      // this.b_modify_avatar,
      // this.b_modify_password,
      this.b_modify_info,
      this.b_code,
      this.b_exit,
    ];
  }

  is_active(b: string) {
    return (b === this.b_active) ? 'active' : 'inactive';
  }
}
