import {Component, OnInit} from '@angular/core';
import {UserService} from "./services/user.service";
import {User} from "./models/user";
import {BaseService} from "./services/base.service";
import {Resource} from "./models/resource";
import {ClockService} from "./services/clock.service";
import {ResourceService} from "./services/resource.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['../assets/css/icon-fonts.css', '../assets/css/nav.less', '../assets/css/footer.less', '../assets/css/res.less']
})
export class AppComponent implements OnInit {
  // title = 'app';
  user: User;
  resource: Resource;
  children: Resource[] = [];
  show_list: Resource[] = [];

  resource_search_keyword: string;

  in_searching: boolean;

  foot_btns: Array<any>;
  foot_btn_active: string;

  constructor(
    private userService: UserService,
    private baseService: BaseService,
    private resService: ResourceService,
    private clockService: ClockService,
  ) {}
  ngOnInit(): void {
    this.userService.api_get_info()
      .then(() => {
        this.user = this.baseService.user;
        console.log(this.user.url_avatar);
        if (this.has_login) {
          this.resService.get_root_res()
            .then((resp) => {
              console.log(resp);
              this.resource = new Resource(resp.info);
              for (const item of resp.child_list) {
                item.parent_id = this.resource.res_id;
                const r_child = new Resource(item);
                this.children.push(r_child);
                this.show_list.push(r_child);
              }
            });
        }
      });
    this.clockService.startClock();
    this.resource_search_keyword = '';
    this.in_searching = false;
    this.foot_btns = [
      {
        icon: 'icon-share',
        text: '分享',
        folder: true,
        file: true,
      },
      {
        icon: 'icon-select',
        text: '多选',
        folder: true,
        file: false,
      },
      {
        icon: 'icon-upload',
        text: '上传',
        folder: true,
        file: false,
      },
      {
        icon: 'icon-modify',
        text: '修改',
        folder: true,
        file: true,
      },
      {
        icon: 'icon-delete',
        text: '删除',
        folder: true,
        file: true,
      }
    ];
    this.foot_btn_active = null;
  }
  get has_login() {
    return this.user;
  }

  resource_search() {
    this.show_list = [];
    for (const item of this.children) {
      if (item.rname.indexOf(this.resource_search_keyword) >= 0) {
        this.show_list.push(item);
      }
    }
  }

  go_search(searching: boolean) {
    this.in_searching = searching;
  }

  get search_class() {
    return this.in_searching ? 'searching' : '';
  }

  is_active(icon: string) {
    return (icon === this.foot_btn_active) ? 'active' : 'inactive';
  }

  activate_btn(icon: string) {
    if (this.foot_btn_active === icon) {
      this.foot_btn_active = null;
    } else {
      this.foot_btn_active = icon;
    }
  }
}
