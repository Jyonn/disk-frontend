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
import {Info} from "../../models/info";

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

  // user: User;
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
    // this.user = null;
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
          // this.user = user;
          this.resService.get_res_info(this.path, null)
            .then((resp) => {
              this.children = [];
              this.resource = new Resource(resp.info);
              this.description = this.resource.description;
              for (const item of resp.child_list) {
                item.parent_str_id = this.resource.res_str_id;
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

  get dl_link() {
    const slug = BaseService.path_to_slug(this.path);
    return `${this.baseService.host}/api/res/${slug}/dl?token=${this.baseService.token}&visit_key=${this.resource.visit_key}`;
  }

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

  get is_modifying_desc() {
    return this.footBtnService.is_modifying && this.tab_mode === 'description';
  }

  go_modify_desc() {
    this.footBtnService.foot_btn_active = this.footBtnService.foot_btn_modify;
  }

  cancel_modify_desc() {
    if (this.resource) {
      this.description = this.resource.description;
    } else {
      this.description = '';
    }
    this.footBtnService.foot_btn_active = null;
  }

  modify_desc_action() {
    this.resService.modify_res_info(this.path, {rname: null, description: this.description, visit_key: null, status: null})
      .then((resp) => {
        this.resource.update(resp);
        this.description = this.resource.description;
        this.footBtnService.foot_btn_active = null;
      });
  }

  onUploaded(res: Resource) {
    this.children.push(res);
    this.resource_search();
  }

  onDeleted() {
    this.go_parent();
  }

  get resource_title() {
    if (this.search_value) {
      let _v = '';
      if (this.search_value.length > 2) {
        _v = this.search_value.substr(0, 2) + '…';
      }
      else {
        _v = this.search_value;
      }
      return `搜索“${_v}”的结果`;
    }
    return '资源';
  }
}
