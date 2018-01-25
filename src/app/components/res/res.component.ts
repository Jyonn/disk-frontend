import {Component, OnInit} from '@angular/core';
import {UserService} from "../../services/user.service";
import {User} from "../../models/user";
import {Resource} from "../../models/resource";
import {ClockService} from "../../services/clock.service";
import {ResourceService} from "../../services/resource.service";
import {ActivatedRoute, Router} from "@angular/router";
import {FootBtnService} from "../../services/foot-btn.service";
import {FootBtn} from "../../models/foot-btn";
import {Subject} from "rxjs/Subject";

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import {BaseService} from "../../services/base.service";

@Component({
  selector: 'app-res',
  templateUrl: './res.component.html',
  styleUrls: [
    '../../../assets/css/icon-fonts.css',
    '../../../assets/css/nav.less',
    '../../../assets/css/footer.less',
    '../../../assets/css/res.less'
  ],
})
export class ResComponent implements OnInit {
  path: Array<any>;

  user: User;
  resource: Resource;
  children: Resource[];
  search_list: Resource[];
  // show_list: Resource[];

  search_value: string;
  search_terms: Subject<string>;

  search_mode: boolean;
  tab_mode: string;

  visit_key: string;

  description: string;

  constructor(
    public baseService: BaseService,
    public userService: UserService,
    public resService: ResourceService,
    public clockService: ClockService,
    public footBtnService: FootBtnService,
    private activateRoute: ActivatedRoute,
    private router: Router,
  ) {
    this.user = null;
    this.resource = null;
    this.path = [];
    this.visit_key = null;
    this.children = [];
    this.search_list = [];
    this.search_value = null;
    // this.show_list = [];
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
              this.resource = new Resource(resp.info);
              this.description = this.resource.description || '暂无介绍资料';
              for (const item of resp.child_list) {
                item.parent_id = this.resource.res_id;
                const r_child = new Resource(item);
                this.children.push(r_child);
              }
              this.search_list = this.children.concat();
            });
        });
    });
    this.clockService.startClock();
    this.search_mode = false;
    this.tab_mode = 'resource';
    this.search_terms = new Subject<string>();
    this.search_terms
      .debounceTime(300)
      .distinctUntilChanged()
      .subscribe(keyword => this.resource_search(keyword));
  }

  resource_search(keyword: string = null) {
    if (!keyword) {
      keyword = "";
    }
    if (this.search_value) {
      keyword = this.search_value;
    }
    this.search_list = [];
    for (const item of this.children) {
      if (item.rname.indexOf(keyword) >= 0) {
        this.search_list.push(item);
      }
    }
  }

  // do_search(term: string) {
  //   this.search_terms.next(term);
  // }
  //
  select_res(res: Resource) {
    res.selected = !res.selected;
  }

  select_res_help(help: string) {
    if (help === 'all') {
      for (const item of this.search_list) {
        item.selected = true;
      }
    } else if (help === 'adverse') {
      for (const item of this.search_list) {
        item.selected = !item.selected;
      }
    } else if (help === 'cancel') {
      for (const item of this.search_list) {
        item.selected = false;
      }
      this.footBtnService.foot_btn_active = null;
    } else if (help === 'delete') {
      // TODO: delete
    }
  }

  go_search(searching: boolean) {
    this.search_mode = searching;
  }

  clear_search() {
    this.search_value = null;
    this.resource_search();
  }

  get search_class() {
    return this.search_mode ? 'searching' : '';
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
    for (const foot_btn of this.footBtnService.foot_btn_list) {
      if (this.resource) {
        if ((this.resource.is_folder && foot_btn.folder) ||
          (!this.resource.is_folder && foot_btn.file)) {
          if (foot_btn === this.footBtnService.foot_btn_delete && this.resource.is_home) {
            continue;
          }
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

  get dl_link() {
    const slug = BaseService.path_to_slug(this.path);
    return `${this.baseService.host}/api/res/${slug}/dl?token=${this.baseService.token}&visit_key=${this.resource.visit_key}`;
  }
  // download() {
  //   this.resService.get_dl_link(this.path, {visit_key: this.visit_key})
  //     .then((resp) => {
  //       window.open(resp.link);
  //     });
  // }
  //
  switch_tab_mode(tm: string) {
    this.tab_mode = tm;
  }

  get show_search_icon() {
    return this.resource && this.resource.is_folder && this.tab_mode === 'resource' && !this.search_mode;
  }

  activate_btn(btn: FootBtn) {
    this.footBtnService.activate_btn(btn);
    if (this.footBtnService.foot_btn_active === this.footBtnService.foot_btn_select) {
      this.tab_mode = "resource";
    }
  }

  onUploaded(res: Resource) {
    this.children.push(res);
    this.resource_search();
  }

  onDeleted() {
    this.go_parent();
  }
}
