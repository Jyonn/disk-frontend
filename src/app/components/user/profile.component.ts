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

  go_back() {
    if (this.next_url) {
      this.router.navigate([this.next_url]);
    } else {
      this.router.navigate(['/res', this.userService.user.root_res]);
    }
  }
}
