import {Component, OnInit} from '@angular/core';
import {UserService} from "../../services/user.service";
import {User} from "../../models/user";
import {Resource} from "../../models/resource";
import {ClockService} from "../../services/clock.service";
import {ResourceService} from "../../services/resource.service";
import {ActivatedRoute, Router} from "@angular/router";
import {FootBtn} from "../../models/foot-btn";

@Component({
  selector: 'app-res',
  templateUrl: './res.component.html',
  styleUrls: [
    '../../../assets/css/icon-fonts.css',
    '../assets/css/nav.less',
    '../assets/css/footer.less',
    '../assets/css/res.less'
  ]
})
export class ResComponent implements OnInit {
  path: Array<any>;

  user: User;
  resource: Resource;
  children: Resource[] = [];
  show_list: Resource[] = [];

  resource_search_keyword: string;

  search_mode: boolean;
  tab_mode: string;

  foot_btn_share: FootBtn;
  foot_btn_select: FootBtn;
  foot_btn_upload: FootBtn;
  foot_btn_modify: FootBtn;
  foot_btn_delete: FootBtn;
  foot_btn_list: Array<FootBtn>;
  foot_btn_active: FootBtn;
  visit_key: string;

  description: string;

  constructor(
    public userService: UserService,
    public resService: ResourceService,
    public clockService: ClockService,
    private activateRoute: ActivatedRoute,
    private router: Router,
  ) {
    this.user = null;
    this.resource = null;
    this.path = [];
    this.visit_key = null;
  }
  ngOnInit(): void {
    this.activateRoute.params.subscribe((params) => {
      this.path = params['slug'].split('-');
      this.userService.api_get_info()
        .then((user: User) => {
          this.user = user;
          this.resService.get_res_info(this.path, null)
            .then((resp) => {
              this.children = [];
              this.show_list = [];
              this.resource = new Resource(resp.info);
              this.description = this.resource.description;
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
    this.tab_mode = 'resource';

    this.foot_btn_share = new FootBtn({
      icon: 'icon-share',
      text: '分享',
      folder: true,
      file: true,
    });
    this.foot_btn_select = new FootBtn({
      icon: 'icon-select',
      text: '多选',
      folder: true,
      file: false,
    });
    this.foot_btn_upload = new FootBtn({
      icon: 'icon-upload',
      text: '上传',
      folder: true,
      file: false,
    });
    this.foot_btn_modify = new FootBtn({
      icon: 'icon-modify',
      text: '修改',
      folder: true,
      file: true,
    });
    this.foot_btn_delete = new FootBtn({
      icon: 'icon-delete',
      text: '删除',
      folder: true,
      file: true,
    });
    this.foot_btn_list = [
      this.foot_btn_share,
      this.foot_btn_select,
      this.foot_btn_upload,
      this.foot_btn_modify,
      this.foot_btn_delete
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

  is_active(btn: FootBtn) {
    return (btn === this.foot_btn_active) ? 'active' : 'inactive';
  }

  get is_sharing() {
    return this.foot_btn_active === this.foot_btn_share;
  }

  get is_selecting() {
    return this.foot_btn_active === this.foot_btn_select;
  }

  get is_uploading() {
    return this.foot_btn_active === this.foot_btn_upload;
  }

  get is_modifying() {
    return this.foot_btn_active === this.foot_btn_modify;
  }

  get is_deleting() {
    return this.foot_btn_active === this.foot_btn_delete;
  }

  activate_btn(btn: FootBtn) {
    if (this.foot_btn_active === btn) {
      this.foot_btn_active = null;
    } else {
      this.foot_btn_active = btn;
    }
  }

  navigate(res_id) {
    const link = ['/res', `${this.path.join('-')}-${res_id}`];
    this.router.navigate(link);
  }

  go_parent() {
    const link = ['/res', this.path.slice(0, -1).join('-')];
    this.router.navigate(link);
  }

  get foot_btns() {
    const _foot_btns = [];
    for (const foot_btn of this.foot_btn_list) {
      if (this.resource) {
        if ((this.resource.is_folder && foot_btn.folder) ||
            (!this.resource.is_folder && foot_btn.file)) {
          _foot_btns.push(foot_btn);
        }
      }
    }
    return _foot_btns;
  }

  get is_mine() {
    return this.resource && this.user && this.user.user_id === this.resource.owner.user_id;
  }
  get nav_foot_owner() {
    let owner = null;
    if (this.resource) {
      owner = this.resource.owner;
    }
    if (this.is_mine) {
      owner = '我';
    }
    return owner;
  }

  download() {
    this.resService.get_dl_link(this.path, this.visit_key)
      .then((resp) => {
        window.open(resp.link);
      });
  }

  switch_tab_mode(tm: string) {
    this.tab_mode = tm;
  }

  get show_search_icon() {
    return this.resource && this.resource.is_folder && this.tab_mode === 'resource';
  }

  get start_mask() {
    return [this.foot_btn_share, this.foot_btn_upload, this.foot_btn_delete]
      .findIndex(v => v === this.foot_btn_active) >= 0 ? 'active' : 'inactive';
  }
}
