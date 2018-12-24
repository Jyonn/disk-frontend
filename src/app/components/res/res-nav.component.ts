import {Component, EventEmitter, Input, Output} from "@angular/core";
import {UserService} from "../../services/user.service";
import {Resource} from "../../models/res/resource";
import {BaseService} from "../../services/base.service";
import {Info} from "../../models/base/info";
import {Router} from "@angular/router";
import {FootBtnService} from "../../services/foot-btn.service";

@Component({
  selector: 'app-res-nav',
  templateUrl: './res-nav.component.html',
  styleUrls: [
    '../../../assets/css/icon-fonts.css',
    '../../../assets/css/nav.less',
  ]
})
export class ResNavComponent {
  @Input() resource: Resource;
  @Input() is_mine: boolean;
  @Input() hide_nav: boolean;
  @Output() onGoParent = new EventEmitter();
  @Output() onGoLogin = new EventEmitter();
  is_showing: boolean;
  show_menu: boolean;

  constructor(
    public userService: UserService,
    public baseService: BaseService,
    public footBtnService: FootBtnService,
    public router: Router,
  ) {
    this.is_showing = true;
    this.show_menu = false;
  }

  switch_show_mode() {
    if (this.show_menu) {
      this.show_menu = false;
    } else {
      this.is_showing = !this.is_showing;
    }
  }

  show_insecure_info($event) {
    $event.cancelBubble = true;
    $event.stopPropagation();
    BaseService.info_center.next(new Info({text: this.resource.secure_info, type: Info.TYPE_WARN}));
  }

  go_parent($event) {
    $event.cancelBubble = true;
    $event.stopPropagation();
    this.onGoParent.emit();
  }

  go_login($event) {
    $event.cancelBubble = true;
    $event.stopPropagation();
    // this.router.navigate(['/user', 'login', 'next', this.router.url]);
    window.location.href = this.userService.oauth_uri + '&state=' + encodeURI(this.router.url);
  }

  click_avatar($event) {
    $event.cancelBubble = true;
    $event.stopPropagation();
    this.show_menu = !this.show_menu;
    if (this.show_menu) {
      this.is_showing = true;
    }
  }

  go_owner_home($event) {
    $event.cancelBubble = true;
    $event.stopPropagation();
    if (this.resource) {
      const link = ['/res', this.resource.owner.root_res];
      this.router.navigate(link);
    }
  }

  menu_handler($event, s: string) {
    $event.cancelBubble = true;
    $event.stopPropagation();
    if (s === 'mine') {
      this.router.navigate(['/res', this.userService.user.root_res]);
    } else if (s === 'profile') {
      window.location.href = `https://sso.6-79.cn/user/info-modify?from=https%3A%2F%2Fd.6-79.cn%2F/user/refresh`;
    } else if (s === 'code') {
      window.open('https://github.com/lqj679ssn/disk-frontend');
    } else if (s === 'tips') {
      this.is_showing = false;
      this.show_menu = false;
      this.footBtnService.activate_btn(this.footBtnService.foot_btn_tips);
    } else if (s === 'updates') {
      this.is_showing = false;
      this.show_menu = false;
      this.footBtnService.activate_btn(this.footBtnService.foot_btn_update);
    }
  }

  get nav_foot_owner() {
    let owner = null;
    if (this.resource) {
      owner = this.resource.owner.nickname;
    }
    if (this.is_mine) {
      owner = '我';
    }
    return owner;
  }
}
