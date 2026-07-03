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
  @Input() zip_nav: boolean;
  @Input() search_mode: boolean;
  @Input() search_value: string;
  @Output() onGoParent = new EventEmitter();
  @Output() onGoLogin = new EventEmitter();
  @Output() onToggleSearch = new EventEmitter<void>();
  @Output() onSearchValue = new EventEmitter<string>();
  @Output() onClearSearch = new EventEmitter<void>();
  show_menu: boolean;

  constructor(
    public userService: UserService,
    public baseService: BaseService,
    public footBtnService: FootBtnService,
    public router: Router,
  ) {
    this.show_menu = false;
  }

  dismiss_menu() {
    if (this.show_menu) {
      this.show_menu = false;
    }
  }

  toggle_search($event) {
    $event.cancelBubble = true;
    $event.stopPropagation();
    this.onToggleSearch.emit();
  }

  update_search(value: string, $event = null) {
    if ($event) {
      $event.cancelBubble = true;
      $event.stopPropagation();
    }
    this.onSearchValue.emit(value);
  }

  clear_search($event) {
    $event.cancelBubble = true;
    $event.stopPropagation();
    this.onClearSearch.emit();
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
  }

  go_owner_home($event) {
    $event.cancelBubble = true;
    $event.stopPropagation();
    if (this.resource) {
      const link = ['/res', this.resource.owner.rootRes];
      this.router.navigate(link);
    }
  }

  menu_handler($event, s: string) {
    $event.cancelBubble = true;
    $event.stopPropagation();
    if (s === 'mine') {
      this.router.navigate(['/res', this.userService.user.rootRes]);
    } else if (s === 'profile') {
      window.location.href = `https://sso.6-79.cn/user/info-modify?from=https%3A%2F%2Fd.6-79.cn%2F/user/refresh`;
    } else if (s === 'code') {
      window.open('https://github.com/lqj679ssn/disk-frontend');
    } else if (s === 'tips') {
      this.show_menu = false;
      this.footBtnService.activate_btn(this.footBtnService.foot_btn_tips);
    } else if (s === 'updates') {
      this.show_menu = false;
      this.footBtnService.activate_btn(this.footBtnService.foot_btn_update);
    } else if (s === 'setting') {
      this.show_menu = false;
      this.footBtnService.activate_btn(this.footBtnService.foot_btn_setting);
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

  get show_search_control() {
    return !!this.resource?.is_folder;
  }
}
