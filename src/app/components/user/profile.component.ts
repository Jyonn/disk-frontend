import {Component, OnInit} from "@angular/core";
import {UserService} from "../../services/user.service";
import {ProfileBtnService} from "../../services/profile-btn.service";
import {ActivatedRoute, Router} from "@angular/router";
import {BaseService} from "../../services/base.service";
import {Info} from "../../models/base/info";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: [
    '../../../assets/css/icon-fonts.css',
    '../../../assets/css/profile.less',
  ]
})
export class ProfileComponent implements OnInit {
  nickname: string;
  old_password: string;
  new_password: string;
  avatar_files: FileList;
  is_modifying: boolean;

  next_url: string;

  constructor(
    public baseService: BaseService,
    public userService: UserService,
    public profileBtnService: ProfileBtnService,
    public activateRoute: ActivatedRoute,
    public router: Router,
  ) {
    this.is_modifying = false;
  }

  ngOnInit() {
    this.activateRoute.params.subscribe((params) => {
      this.next_url = params['next'];
    });
  }

  modify_activate(b: string) {
    if (b === this.profileBtnService.b_enter_box) {
      this.router.navigate(['/res', this.userService.user.root_res]);
    } else if (b === this.profileBtnService.b_code) {
      window.open('https://github.com/lqj679ssn/disk-frontend');
    } else if (b === this.profileBtnService.b_exit) {
      this.userService.exit();
      this.go_back();
    } else if (b === this.profileBtnService.b_modify_info) {
      window.location.href = `https://sso.6-79.cn/user/info-modify?from=https%3A%2F%2Fd.6-79.cn%2F/user/refresh`;
    } else {
      this.profileBtnService.b_active = b;
    }
  }

  get avatar_name() {
    if (this.avatar_files && this.avatar_files[0]) {
      return this.avatar_files[0].name;
    } else {
      return null;
    }
  }

  // modify_nickname() {
  //   this.userService.api_modify_user({password: null, old_password: null, nickname: this.nickname})
  //     .then((resp) => {
  //       this.userService.user.nickname = this.nickname;
  //       BaseService.info_center.next(new Info({text: '昵称修改成功', type: Info.TYPE_SUCC}));
  //       this.profileBtnService.b_active = null;
  //     });
  // }
  //
  // modify_password() {
  //   this.userService.api_modify_user({password: this.new_password, old_password: this.old_password, nickname: null})
  //     .then(() => {
  //       BaseService.info_center.next(new Info({text: '密码修改成功，需要重新登录', type: Info.TYPE_SUCC}));
  //       this.profileBtnService.b_active = null;
  //       this.router.navigate(['/user', 'login', 'next', this.router.url]);
  //     });
  // }
  //
  // modify_avatar() {
  //   if (this.is_modifying) {
  //     BaseService.info_center.next(new Info({text: '正在更新', type: Info.TYPE_SUCC}));
  //     return;
  //   }
  //   const avatar_file = this.avatar_name;
  //   if (!avatar_file) {
  //     BaseService.info_center.next(new Info({text: '没有选择图片', type: Info.TYPE_WARN}));
  //     return;
  //   }
  //   this.is_modifying = true;
  //   this.userService.api_get_avatar_token({filename: avatar_file})
  //     .then((resp) => {
  //       this.baseService.api_upload_file(resp.key, resp.upload_token, this.avatar_files[0])
  //         .then((resp_) => {
  //           this.userService.user.update(resp_);
  //           this.profileBtnService.b_active = null;
  //           this.is_modifying = false;
  //           BaseService.info_center.next(new Info({text: '头像更新成功', type: Info.TYPE_SUCC}));
  //         })
  //         .catch(() => {
  //           this.is_modifying = false;
  //         });
  //     })
  //     .catch(() => {
  //       this.is_modifying = false;
  //     });
  // }

  cancel_modify() {
    this.profileBtnService.b_active = null;
  }

  go_back() {
    if (this.next_url) {
      this.router.navigate([this.next_url]);
    } else {
      this.router.navigate(['/res', this.userService.user.root_res]);
    }
  }
}
