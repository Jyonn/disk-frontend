import {Component, EventEmitter, Input, Output} from "@angular/core";
import {UserService} from "../../services/user.service";
import {Resource} from "../../models/resource";
import {BaseService} from "../../services/base.service";
import {Info} from "../../models/info";

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
  // @Input() user: User;
  @Output() onGoParent = new EventEmitter();
  is_showing: boolean;

  constructor(
    public userService: UserService,
    public baseService: BaseService,
  ) {
    this.is_showing = false;
  }

  get show_mode() {
    if (this.is_showing) {
      return 'showing';
    } else {
      return null;
    }
  }
  switch_show_mode() {
    if (this.resource && this.resource.cover) {
      this.is_showing = !this.is_showing;
    } else {
      BaseService.info_center.next(new Info({text: '无法放大随机封面', type: Info.TYPE_WARN}));
    }
  }

  go_parent($event) {
    $event.cancelBubble = true;
    $event.stopPropagation();
    this.onGoParent.emit();
  }

  get is_mine() {
    return this.resource && this.userService.user && this.userService.user.user_id === this.resource.owner.user_id;
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
