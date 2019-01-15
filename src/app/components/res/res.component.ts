import { Component, OnInit } from '@angular/core';
import { UserService } from "../../services/user.service";
import { Resource } from "../../models/res/resource";
import { ClockService } from "../../services/clock.service";
import { ResourceService } from "../../services/resource.service";
import { ActivatedRoute, Router } from "@angular/router";
import { FootBtnService } from "../../services/foot-btn.service";
import { FootBtn } from "../../models/res/foot-btn";
import { Subject } from "rxjs/Subject";

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import { BaseService } from "../../services/base.service";
import { Info } from "../../models/base/info";
import { Meta } from "@angular/platform-browser";
import { OperationResItem } from "../../models/res/operation-res-item";
import { Observable } from "rxjs";
import { ResourceTreeService } from "../../services/resource-tree.service";

@Component({
  selector: 'app-res',
  templateUrl: './res.component.html',
  styleUrls: [
    '../../../assets/css/mywebicon.css',
    '../../../assets/css/icon-fonts.css',
    '../../../assets/css/nav.less',
    '../../../assets/css/footer.less',
    '../../../assets/css/res.less',
  ],
})
export class ResComponent implements OnInit {
  static sort_accord = 'name';
  static sort_ascend = true;
  static icon_width = 66;

  res_str_id: string;

  resource: Resource;
  children: Resource[];
  search_list: Resource[];

  search_value: string;
  search_terms: Subject<string>;

  search_mode: boolean;
  tab_mode: string;

  sort_mode: boolean;  // 排序模式 分为name time type
  show_more_option: boolean;

  visit_key: string;  // 资源密钥

  description: string;  // 资源描述

  total_op_num: number;  // 所有待操作的资源数目
  current_op_num: number;  // 当前正在操作的数目
  current_path: string;  // 当前操作的路径
  current_item_percentage: number;  // 正在上传的文件的上传比例
  show_op_process: boolean; // 是否进入操作画面
  op_text: string;
  op_identifier: string;
  op_append_msg: string;
  operations: any;

  margin_left: number;

  operation_list: OperationResItem[];  // 操作列表
  delete_text: string;  // 删除文字

  is_multi_mode: boolean;  // 是否在多选模式下的operation模式

  constructor(
    public baseService: BaseService,
    public userService: UserService,
    public resService: ResourceService,
    public clockService: ClockService,
    public footBtnService: FootBtnService,
    public resTreeService: ResourceTreeService,
    private activateRoute: ActivatedRoute,
    private router: Router,
    private meta: Meta,
  ) {
    this.resource = null;
    this.res_str_id = '';
    this.visit_key = null;
    this.search_list = [];
    this.search_value = null;
    this.search_mode = false;
    this.sort_mode = false;
    this.current_op_num = 0;
    this.total_op_num = 0;
    this.show_op_process = false;
    this.margin_left = 0;
    this.show_more_option = false;
    this.operations = {
      delete: {
        text: '删除',
        func: this.recursiveDelete.bind(this),
      },
      move: {
        text: '移动',
        func: this.directMove.bind(this),
      },
      upload: {
        text: '上传',
        func: this.multipleUpload.bind(this),
      }
    };
  }
  baseInitResource(resp) {
    this.children = [];
    this.resource = new Resource(this.baseService, resp.info);
    this.description = this.resource.description;
    if (!this.description && !this.is_mine) {
      this.description = '暂无介绍资料';
    }
    for (const item of resp.child_list) {
      item.parent_str_id = this.resource.res_str_id;
      const r_child = new Resource(null, item);
      this.children.push(r_child);
    }
    this.resource_search();
    this.meta.updateTag({name: 'description', content: `${this.resource.owner.nickname}分享了“${this.resource.rname}”，快来看看吧！`});
    this.meta.updateTag({name: 'image', content: this.resource.cover_small});
  }
  initResLose(base_resp) {
    base_resp.info.rtype = Resource.RTYPE_ENCRYPT;
    this.resource = new Resource(this.baseService, base_resp.info);
    this.description = '无法查看介绍资料';
    this.children = [];
    this.search_list = this.children.concat();
  }
  initResource() {
    const v_key = ResourceService.loadVK(this.res_str_id);
    this.resService.get_base_res_info(this.res_str_id)
      .then((base_resp) => {
        // console.log(resp);
        if (base_resp.readable || v_key) {
          this.resService.get_res_info(this.res_str_id, {visit_key: v_key})
            .then((resp) => {
              this.baseInitResource(resp);
            })
            .catch(() => {
              ResourceService.clearVK(this.res_str_id);
              this.initResLose(base_resp);
            });
        } else {
          this.initResLose(base_resp);
        }
        this.baseService.is_jumping = false;
      });
      // .catch(msg => console.log(msg));
  }

  ngOnInit(): void {
    this.activateRoute.params.subscribe((params) => {
      this.res_str_id = params['res_str_id'];

      this.initResource();
      this.clockService.startClock();
      this.search_mode = false;
      this.tab_mode = 'resource';
    });
    this.search_terms = new Subject<string>();
    this.search_terms
      .debounceTime(300)
      .distinctUntilChanged()
      .subscribe(keyword => this.resource_search(keyword));
    Observable.fromEvent(window, 'resize')
      .debounceTime(300)
      .subscribe(() => {
        this.do_swipe(0);
      });
  }

  do_swipe(delta) {
    const total_width = Math.max(this.foot_btns.length * ResComponent.icon_width, window.innerWidth);
    let margin_left = this.margin_left + delta;
    if (margin_left > 0) {
      margin_left = 0;
    }
    if (-margin_left + window.innerWidth > total_width) {
      margin_left = window.innerWidth - total_width;
    }
    this.margin_left = margin_left;
  }

  footer_swipe($event) {
    const delta = $event.deltaX * 2;
    this.do_swipe(delta);
  }

  get op_percent() {
    return Math.floor((this.current_op_num + this.current_item_percentage / 100) / this.total_op_num * 95 + 5) + '%';
  }

  async multipleUpload(upload_res_list: Array<OperationResItem>) {
    for (const upload_res_item of upload_res_list) {
      this.current_item_percentage = 0;
      this.current_path = upload_res_item.readable_path;
      const resp = await this.resService.get_upload_token(this.res_str_id, {filename: upload_res_item.readable_path});
      const res_data = await this.baseService.api_upload_file(resp.key, resp.upload_token, upload_res_item.data,
        (process) => {
        this.current_item_percentage = process.percentage;
        this.op_append_msg = '，当前文件' + process.percentage + '%';
      });
      this.addChildRes(new Resource(null, res_data));
      this.current_op_num += 1;
    }
  }

  async directMove(move_res_list: Array<OperationResItem>) {
    this.current_item_percentage = 0;
    for (const move_res_item of move_res_list) {
      // console.log(move_res_item);
      this.current_path = move_res_item.readable_path;
      // await this.fake_wait();
      await this.resService.modify_res_info(move_res_item.res_id,
        {
          rname: null,
          right_bubble: null,
          description: null,
          visit_key: null,
          status: null,
          parent_str_id: ResourceTreeService.selectResStrId
        });
      this.current_op_num += 1;
    }
  }

  async recursiveDelete(delete_res_list: Array<OperationResItem>) {
    this.current_item_percentage = 0;
    for (let index = 0; index < delete_res_list.length; index++) {
      const delete_res_item = delete_res_list[index];
      const resp = await this.resService.get_res_info(delete_res_item.res_id, null);
      if (resp.info.sub_type === Resource.STYPE_FOLDER) {
        this.total_op_num += resp.child_list.length;
        for (let i = 0; i < resp.child_list.length; i++) {
          const child_res_id = resp.child_list[i].res_str_id;
          const child_readable_path = delete_res_item.readable_path + "   /   " + resp.child_list[i].rname;
          if (resp.child_list[i].sub_type === Resource.STYPE_FOLDER) {
            await this.recursiveDelete([new OperationResItem({
              res_str_id: child_res_id,
              readable_path: child_readable_path,
            })]);
          } else {
            this.current_op_num += 1;
            // console.log(child_res_id);
            this.current_path = child_readable_path;
            await this.resService.delete_res(child_res_id);
            // await this.fake_wait();
          }
        }
      }
      this.current_op_num += 1;
      this.current_path = delete_res_item.readable_path;
      await this.resService.delete_res(delete_res_item.res_id);
      // await this.fake_wait();
      // console.log(deleteResItem.path);
    }
  }

  fake_wait() {
    return new Promise((resolve, object) => {
      setTimeout(() => resolve(), 2000);
    });
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
    this.sort_by(true);
  }

  select_res(res: Resource) {
    res.selected = !res.selected;
  }

  get active_more_option() {
    return this.show_more_option ? 'active' : 'inactive';
  }

  click_icon() {
    if (this.is_owner) {
      this.footBtnService.activate_btn(this.footBtnService.foot_btn_select);
    }
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
      this.footBtnService.inactivate();
    } else if (help === 'more-option') {
      this.show_more_option = !this.show_more_option;
    } else if (help === 'delete' || help === 'move') {
      this.show_more_option = false;
      this.is_multi_mode = true;
      this.operation_list = [];
      for (const item of this.search_list) {
        if (item.selected) {
          this.operation_list.push(new OperationResItem({
            res_str_id: item.res_str_id,
            readable_path: this.resource.rname + '   /   ' + item.rname,
          }));
        }
      }
      if (this.operation_list.length === 0) {
        BaseService.info_center.next(new Info({text: '请选择至少一项资源后操作', type: Info.TYPE_WARN}));
      } else {
        if (help === 'delete') {
          this.delete_text = `删除选定的${this.operation_list.length}项资源且无法恢复。`;
          this.footBtnService.activate_btn(this.footBtnService.foot_btn_delete);
        } else {
          this.footBtnService.activate_btn(this.footBtnService.foot_btn_move);
        }
      }
    }
  }

  start_operation(callback = null, fail_call = null) {
    this.op_append_msg = '';
    this.show_op_process = true;
    this.current_op_num = 0;
    this.total_op_num = this.operation_list.length;
    // this.op_text = (this.op_identifier === 'delete') ? '删除' : (this.op_identifier === '')'移动';
    // const promise = (this.op_identifier === 'delete') ? this.recursiveDelete(op_list) : this.directMove(op_list);
    this.op_text = this.operations[this.op_identifier].text;
    const promise = this.operations[this.op_identifier].func(this.operation_list);
    promise
      .then(() => {
        BaseService.info_center.next(new Info({
          text: this.total_op_num > 1 ? '批量' : '' + this.op_text + '成功',
          type: Info.TYPE_SUCC
        }));
        if (callback) {
          callback();
        }
        setTimeout(() => {
          this.show_op_process = false;
        }, 300);
      })
      .catch(() => {
        if (fail_call) {
          fail_call();
        }
        setTimeout(() => {
          this.show_op_process = false;
        }, 300);
      });
  }

  get active_real_operation() {
    return this.show_op_process ? 'active' : 'inactive';
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

  get sort_class() {
    return this.sort_mode ? 'sorting' : '';
  }

  navigate(res_str_id) {
    const link = ['/res', res_str_id];
    this.baseService.is_jumping = true;
    this.router.navigate(link)
      .then();
  }

  go_parent($event = null) {
    if ($event) {
      $event.stopPropagation();
    }
    if (this.resource.is_home) {
      return;
    }
    const link = ['/res', this.resource.parent_str_id];
    this.baseService.is_jumping = true;
    this.router.navigate(link)
      .then();
  }

  get foot_btns() {
    const _foot_btns = [];
    for (const foot_btn of this.footBtnService.foot_btn_list) {
      if (this.resource && !foot_btn.hide) {
        if ((this.resource.is_folder && foot_btn.folder) ||
          (!this.resource.is_folder && foot_btn.file)) {
          if (this.resource.is_home) {
            if (foot_btn === this.footBtnService.foot_btn_delete || foot_btn === this.footBtnService.foot_btn_move) {
              continue;
            }
          }
          if (foot_btn.login && !this.is_owner) {
            continue;
          }
          _foot_btns.push(foot_btn);
        }
      }
    }
    return _foot_btns;
  }

  get is_owner() {
    return this.userService.user && this.resource && this.userService.user.user_id === this.resource.owner.user_id;
  }

  get dl_link() {
    return `${this.baseService.host}/api/res/${this.resource.res_str_id}/dl?` +
      `token=${BaseService.token}&visit_key=${this.resource.visit_key}`;
  }

  switch_tab_mode(tm: string) {
    this.tab_mode = tm;
  }

  sort_by_time(ra: Resource, rb: Resource) {
    if (ResComponent.sort_ascend) {
      return ra.create_time - rb.create_time;
    } else {
      return rb.create_time - ra.create_time;
    }
  }

  sort_by_type(ra: Resource, rb: Resource) {
    if (ResComponent.sort_ascend) {
      return ra.sub_type - rb.sub_type;
    } else {
      return rb.sub_type - ra.sub_type;
    }
  }

  sort_by_name(ra: Resource, rb: Resource) {
    if (ResComponent.sort_ascend) {
      return ra.rname.localeCompare(rb.rname, 'zh');
    } else {
      return -ra.rname.localeCompare(rb.rname, 'zh');
    }
  }

  toggle_sort_mode() {
    this.sort_mode = !this.sort_mode;
  }

  sort_by(follow_last, accord = null) {
    if (!follow_last) {
      if (ResComponent.sort_accord === accord) {
        ResComponent.sort_ascend = !ResComponent.sort_ascend;
      } else {
        ResComponent.sort_accord = accord;
        ResComponent.sort_ascend = true;
      }
    }
    switch (ResComponent.sort_accord) {
      case 'time':
        this.search_list.sort(this.sort_by_time);
        break;
      case 'name':
        this.search_list.sort(this.sort_by_name);
        break;
      case 'type':
        this.search_list.sort(this.sort_by_type);
        break;
      default:
        break;
    }
    this.sort_mode = false;
  }

  get show_side_icon() {
    return this.resource && this.resource.is_folder && this.tab_mode === 'resource' && !this.search_mode;
  }

  activate_btn(btn: FootBtn) {
    this.is_multi_mode = false;
    this.footBtnService.activate_btn(btn);
    if (this.footBtnService.is_selecting) {
      this.tab_mode = "resource";
    } else if (this.footBtnService.is_deleting) {
      this.operation_list = [new OperationResItem({
        res_str_id: this.resource.res_str_id,
        readable_path: this.resource.rname,
      })];
      if (this.resource && this.resource.rtype === Resource.RTYPE_FILE) {
        this.delete_text = '删除此资源且无法恢复。';
      } else {
        this.delete_text = '删除此文件夹下的所有资源和子文件夹且无法恢复。';
      }
    } else if (this.footBtnService.is_moving) {
      this.resTreeService.show_res_path(this.res_str_id, false);
      this.operation_list = [new OperationResItem({
        res_str_id: this.resource.res_str_id,
        readable_path: this.resource.rname,
      })];
      if (this.res_str_id === ResourceTreeService.selectResStrId) {
        ResourceTreeService.selectResStrId = ResourceTreeService.selectedResName = null;
      }
    } else if (this.footBtnService.is_modifying) {
      if (this.resource.cover_type === Resource.COVER_RESOURCE) {
        this.resTreeService.show_res_path(this.resource.raw_cover, true);
      }
    }
  }

  get is_modifying_desc() {
    return this.footBtnService.is_modifying && this.tab_mode === 'description';
  }

  go_modify_desc() {
    this.footBtnService.activate_btn(this.footBtnService.foot_btn_modify);
  }

  cancel_modify_desc() {
    if (this.resource) {
      this.description = this.resource.description;
    } else {
      this.description = '';
    }
    this.footBtnService.inactivate();
  }

  modify_desc_action() {
    this.resService.modify_res_info(this.res_str_id,
      {rname: null, description: this.description, visit_key: null, status: null, right_bubble: null, parent_str_id: null})
      .then((resp) => {
        this.resource.update(null, resp);
        this.description = this.resource.description;
        this.footBtnService.inactivate();
      });
  }

  addChildRes(res: Resource) {
    this.children.push(res);
    this.resource_search();
  }

  onUpload(data: any) {
    const res_files = data.res_files;
    const file_name = data.file_name;
    this.operation_list = [];
    if (res_files.length === 1) {
      this.operation_list.push(new OperationResItem({
        res_str_id: null,
        readable_path: file_name,
      }, res_files[0]));
    } else {
      for (let index = 0; index < res_files.length; index++) {
        const res = res_files[index];
        this.operation_list.push(new OperationResItem({
          res_str_id: null,
          readable_path: res.name,
        }, res));
      }
    }

    this.op_identifier = 'upload';
    this.footBtnService.inactivate();
    this.start_operation(data.callback);
  }

  onDeleted() {
    if (this.operation_list.length === 0) {
      return;
    }

    this.op_identifier = 'delete';
    this.start_operation( () => {
      this.operation_list = [];
      if (!this.is_multi_mode) {
        this.go_parent();
      } else {
        this.resService.get_res_info(this.res_str_id, null)
          .then((resp) => {
            this.baseInitResource(resp);
          });
      }
    });
  }

  onMove() {
    console.log(this.operation_list);
    if (this.operation_list.length === 0) {
      return;
    }

    this.op_identifier = 'move';
    this.start_operation(() => {
      this.operation_list = [];
      this.resService.get_res_info(this.res_str_id, null)
        .then((resp) => {
          this.baseInitResource(resp);
          this.resTreeService.refresh_node(this.resTreeService.root);
        });
    });
  }

  get resource_title() {
    if (this.search_value && this.resource && this.resource.rtype === Resource.RTYPE_FOLDER) {
      let _v = '';
      if (this.search_value.length > 2) {
        _v = this.search_value.substr(0, 2) + '…';
      } else {
        _v = this.search_value;
      }
      return `搜索“${_v}”的结果`;
    }
    return '资源';
  }

  get is_mine() {
    return this.resource && this.userService.user && this.userService.user.user_id === this.resource.owner.user_id;
  }

  go_login() {
    if (this.userService.user) {
      this.router.navigate(['/res']);
    } else {
      window.location.href = this.userService.oauth_uri + '&state=' + encodeURI(this.router.url);
    }
  }

  check_visit_key() {
    this.resService.get_res_info(this.res_str_id, {visit_key: this.visit_key})
      .then((resp) => {
        ResourceService.storeVK(this.res_str_id, this.visit_key);
        this.baseInitResource(resp);
        BaseService.info_center.next(new Info({text: '成功获取资源', type: Info.TYPE_SUCC}));
      });
  }
}
