import {Component, OnInit} from '@angular/core';
import {UserService} from "./services/user.service";
import {User} from "./models/user";
import {Resource} from "./models/resource";
import {ClockService} from "./services/clock.service";
import {ResourceService} from "./services/resource.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-res',
  templateUrl: './res.component.html',
  styleUrls: [
    '../assets/css/icon-fonts.css',
    '../assets/css/nav.less',
    '../assets/css/footer.less',
    '../assets/css/res.less'
  ]
})
export class ResComponent implements OnInit {
  slug: null;

  user: User;
  resource: Resource;
  children: Resource[] = [];
  show_list: Resource[] = [];

  resource_search_keyword: string;

  search_mode: boolean;

  foot_btns: Array<any>;
  foot_btn_active: string;

  constructor(
    public userService: UserService,
    public resService: ResourceService,
    public clockService: ClockService,
    private activateRoute: ActivatedRoute,
    private router: Router,
  ) {
    this.user = null;
    this.resource = null;
  }
  ngOnInit(): void {
    this.activateRoute.params.subscribe((params) => {
      this.slug = params['slug'];
      this.userService.api_get_info()
        .then((user: User) => {
          this.user = user;
          this.resService.get_res_info(this.slug, null)
            .then((resp) => {
              this.children = [];
              this.show_list = [];
              this.resource = new Resource(resp.info);
              for (const item of resp.child_list) {
                item.parent_id = this.resource.res_id;
                const r_child = new Resource(item);
                this.children.push(r_child);
                this.show_list.push(r_child);
              }
            });
        });
    });
    this.clockService.startClock();
    this.resource_search_keyword = '';
    this.search_mode = false;
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

  resource_search() {
    this.show_list = [];
    for (const item of this.children) {
      if (item.rname.indexOf(this.resource_search_keyword) >= 0) {
        this.show_list.push(item);
      }
    }
  }

  go_search(searching: boolean) {
    this.search_mode = searching;
  }

  get search_class() {
    return this.search_mode ? 'searching' : '';
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

  navigate(res_id) {
    const link = ['/res', `${this.slug}-${res_id}`];
    this.router.navigate(link);
  }
}
