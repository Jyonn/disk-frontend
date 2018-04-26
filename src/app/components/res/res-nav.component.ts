import {Component, EventEmitter, Input, Output} from "@angular/core";
import {UserService} from "../../services/user.service";
import {Resource} from "../../models/res/resource";
import {BaseService} from "../../services/base.service";
import {Info} from "../../models/base/info";
import {Router} from "@angular/router";

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
  @Output() onGoParent = new EventEmitter();
  @Output() onGoLogin = new EventEmitter();
  is_showing: boolean;

  constructor(
    public userService: UserService,
    public baseService: BaseService,
    public router: Router,
  ) {
    this.is_showing = true;
  }

  get show_mode() {
    if (this.is_showing) {
      return 'showing';
    } else {
      return null;
    }
  }
  switch_show_mode() {
    // if (this.resource && this.resource.cover) {
    //   this.is_showing = !this.is_showing;
    // } else {
    //   BaseService.info_center.next(new Info({text: '无法放大随机封面', type: Info.TYPE_WARN}));
    // }
    this.is_showing = !this.is_showing;
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

  go_profile($event) {
    $event.cancelBubble = true;
    $event.stopPropagation();
    this.router.navigate(['/user', 'profile', 'next', this.router.url]);
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
