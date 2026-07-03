import { Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import { UserService } from "../../services/user.service";
import { Resource } from "../../models/res/resource";
import { ClockService } from "../../services/clock.service";
import { ResourceService } from "../../services/resource.service";
import { ActivatedRoute, Router } from "@angular/router";
import { FootBtnService } from "../../services/foot-btn.service";
import { FootBtn } from "../../models/res/foot-btn";
import { Subject } from "rxjs";
import { debounceTime, distinctUntilChanged } from "rxjs/operators";

import { BaseService } from "../../services/base.service";
import { Info } from "../../models/base/info";
import { Meta } from "@angular/platform-browser";
import { OperationResItem } from "../../models/res/operation-res-item";
import { ResourceTreeService } from "../../services/resource-tree.service";
import {WechatShareService} from "../../services/wechat-share.service";
import {VideoService} from "../../services/video.service";

@Component({
  selector: 'app-res',
  templateUrl: './res.component.html',
  styleUrls: [
    '../../../assets/css/icon-fonts.css',
    '../../../assets/css/nav.less',
    '../../../assets/css/footer.less',
    '../../../assets/css/res.less',
  ],
})
export class ResComponent implements OnInit {
  static sort_accord = 'name';
  static sort_ascend = true;
  static relative_time = true;
  static readonly HTX_DISPLAY_MODE = 'list';
  static readonly HTX_DOWNLOAD_MODE = 'download';
  static readonly HTX_MORE_MODE = 'more';

  @ViewChild('resList') resListElement: ElementRef;

  res_str_id: string;

  resource: Resource;
  children: Resource[];
  search_list: Resource[];

  search_value: string;
  search_terms: Subject<string>;

  search_mode: boolean;
  tab_mode: string;

  sort_mode: boolean;  // 排序模式 分为name time type
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

  operation_list: OperationResItem[];  // 操作列表
  delete_text: string;  // 删除文字

  is_multi_mode: boolean;  // 是否在多选模式下的operation模式

  scroll_top: string;

  modify_desc: boolean;
  htx_command_mode: string;
  is_htx_menu_open: boolean;

  player: any;

  constructor(
    public baseService: BaseService,
    public userService: UserService,
    public resService: ResourceService,
    public clockService: ClockService,
    public footBtnService: FootBtnService,
    public resTreeService: ResourceTreeService,
    private activateRoute: ActivatedRoute,
    private wechatShare: WechatShareService,
    private video: VideoService,
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
    this.tab_mode = 'resource';
    this.modify_desc = false;
    this.htx_command_mode = ResComponent.HTX_DISPLAY_MODE;
    this.is_htx_menu_open = false;

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
      },
      'upload-folder': {
        text: '上传',
        func: this.uploadFolder.bind(this),
      }
    };

    if (video.jsLC.loaded) {
      this.initVideo();
    } else {
      video.jsLC.calling(this.initVideo.bind(this));
    }
  }

  initVideo() {
    // this.player = this.video.getPlayer('video-js');
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
    this.reset_htx_command_mode();
    this.resource_search();
    this.meta.updateTag({name: 'description', content: `${this.resource.owner.nickname}分享了“${this.resource.rname}”，快来看看吧！`});
    this.meta.updateTag({name: 'image', content: this.resource.cover_small});

    // this.wechatShare.title = `浑天匣 - ${this.resource.rname}`;
    // this.wechatShare.desc = `${this.resource.owner.nickname}分享了“${this.resource.rname}”，快来看看吧！`;
    // this.wechatShare.imgUrl = this.resource.cover_small;
    // if (this.wechatShare.jsLC.loaded) {
    //   this.wechatShare.sharePrepare();
    // } else {
    //   this.wechatShare.jsLC.reset().calling(this.wechatShare.sharePrepare.bind(this.wechatShare));
    // }
  }
  initResLose(base_resp) {
    base_resp.info.rtype = Resource.RTYPE_ENCRYPT;
    this.resource = new Resource(this.baseService, base_resp.info);
    this.description = '无法查看介绍资料';
    this.children = [];
    this.search_list = this.children.concat();
    this.reset_htx_command_mode();
  }
  initResource() {
    const v_key = ResourceService.loadVK(this.res_str_id);
    const cookie = BaseService.loadPageCookie(this.res_str_id);
    this.search_value = cookie.kw;
    this.search_mode = !!cookie.kw;
    this.resService.get_base_res_info(this.res_str_id)
      .then((base_resp) => {
        if (base_resp.readable || v_key) {
          this.resService.get_res_info(this.res_str_id, {visit_key: v_key})
            .then((resp) => {
              this.baseInitResource(resp);
              this.scroll_top = cookie.scroll || '0';
            })
            .catch((e) => {
              ResourceService.clearVK(this.res_str_id);
              this.initResLose(base_resp);
            });
        } else {
          this.initResLose(base_resp);
        }
        this.baseService.is_jumping = false;
      })
      .catch(() => {
        BaseService.info_center.next(new Info({text: '资源加载失败', type: Info.TYPE_WARN}));
        this.baseService.is_jumping = false;
      });
      // .catch(msg => console.log(msg));
  }

  onscroll(scroll) {
    this.scroll_top = scroll;
  }

  ngOnInit(): void {
    this.activateRoute.params.subscribe((params) => {
      this.res_str_id = params['res_str_id'];

      this.initResource();
      this.clockService.startClock();
      if (params['tab'] === 'resource' || params['tab'] === 'description') {
        this.tab_mode = params['tab'];
      }
      // this.tab_mode = 'resource';
    });
    this.search_terms = new Subject<string>();
    this.search_terms.pipe(
      debounceTime(300),
      distinctUntilChanged(),
    )
      .subscribe(keyword => this.resource_search(keyword));
  }

  @HostListener('document:click')
  onDocumentClick() {
    this.is_htx_menu_open = false;
  }

  get op_percent() {
    if (!this.total_op_num) {
      return '0%';
    }
    return Math.floor((this.current_op_num + this.current_item_percentage / 100) / this.total_op_num * 95 + 5) + '%';
  }

  async multipleUpload(upload_res_list: Array<OperationResItem>) {
    for (const upload_res_item of upload_res_list) {
      this.current_item_percentage = 0;
      this.current_path = upload_res_item.readablePath;
      const resp = await this.resService.get_upload_token(this.res_str_id, {filename: upload_res_item.readablePath});
      const res_data = await this.baseService.api_upload_file(resp.key, resp.upload_token, upload_res_item.data,
        (process) => {
        this.current_item_percentage = process.percentage;
        this.op_append_msg = '，当前文件' + process.percentage + '%';
      });
      this.addChildRes(new Resource(null, res_data));
      this.current_item_percentage = 0;
      this.current_op_num += 1;
    }
  }

  async directMove(move_res_list: Array<OperationResItem>) {
    this.current_item_percentage = 0;
    for (const move_res_item of move_res_list) {
      // console.log(move_res_item);
      this.current_path = move_res_item.readablePath;
      // await this.fake_wait();
      await this.resService.modify_res_info(move_res_item.resId,
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

  randomString(len) {
    len = len || 32;
    const $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
    const maxPos = $chars.length;
    let pwd = '';
    for (let i = 0; i < len; i++) {
      pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return pwd;
  }

  async uploadFolder(upload_res_list: Array<OperationResItem>) {
    const folder_tree = {children: {}, res_id: this.res_str_id};
    for (const upload_res_item of upload_res_list) {
      this.current_item_percentage = 0;
      const paths = upload_res_item.data.webkitRelativePath.split('/');
      paths.pop();
      let current_directory = folder_tree;
      for (const directory of paths) {
        if (!(directory in current_directory.children)) {
          this.current_item_percentage = 0;
          this.total_op_num += 1;
          this.current_path = paths.join(' / ');
          const _resp = await this.resService.create_folder(current_directory.res_id, {folder_name: directory});
          // const _resp = await this.fake_wait();
          current_directory.children[directory] = {children: {}, res_id: _resp.res_str_id};
          if (current_directory.res_id === this.res_str_id) {
            this.addChildRes(new Resource(null, _resp));
          }
          this.current_op_num += 1;
        }
        current_directory = current_directory.children[directory];
      }

      this.current_path = upload_res_item.readablePath;
      // const resp = await this.fake_wait();
      const resp = await this.resService.get_upload_token(current_directory.res_id, {filename: upload_res_item.data.name});
      const res_data = await this.baseService.api_upload_file(resp.key, resp.upload_token, upload_res_item.data,
        (process) => {
          this.current_item_percentage = process.percentage;
          this.op_append_msg = '，当前文件' + process.percentage + '%';
        });
      if (current_directory.res_id === this.res_str_id) {
        this.addChildRes(new Resource(null, res_data));
      }
      this.current_op_num += 1;
    }
  }

  async recursiveDelete(delete_res_list: Array<OperationResItem>) {
    this.current_item_percentage = 0;
    for (let index = 0; index < delete_res_list.length; index++) {
      const delete_res_item = delete_res_list[index];
      const resp = await this.resService.get_res_info(delete_res_item.resId, null);
      if (resp.info.sub_type === Resource.STYPE_FOLDER) {
        this.total_op_num += resp.child_list.length;
        for (let i = 0; i < resp.child_list.length; i++) {
          const child_res_id = resp.child_list[i].res_str_id;
          const child_readable_path = delete_res_item.readablePath + "   /   " + resp.child_list[i].rname;
          if (resp.child_list[i].sub_type === Resource.STYPE_FOLDER) {
            await this.recursiveDelete([new OperationResItem({
              res_str_id: child_res_id,
              readablePath: child_readable_path,
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
      this.current_path = delete_res_item.readablePath;
      await this.resService.delete_res(delete_res_item.resId);
      // await this.fake_wait();
      // console.log(deleteResItem.path);
    }
  }

  fake_wait() {
    return new Promise<void>((resolve, object) => {
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

  select_res(res: Resource, event?: Event) {
    event?.stopPropagation();
    res.selected = !res.selected;
  }

  clear_selection() {
    for (const item of this.search_list) {
      item.selected = false;
    }
  }

  toggle_select_all(event?: Event) {
    event?.stopPropagation();
    const next_state = !this.all_search_list_selected;
    for (const item of this.search_list) {
      item.selected = next_state;
    }
  }

  toggle_selection_mode() {
    if (!this.is_owner) {
      return;
    }
    if (this.footBtnService.is_selecting) {
      this.select_res_help('cancel');
      return;
    }
    this.activate_btn(this.footBtnService.foot_btn_select);
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
      this.clear_selection();
      this.footBtnService.inactivate();
    } else if (help === 'delete' || help === 'move') {
      this.is_multi_mode = true;
      this.operation_list = [];
      for (const item of this.search_list) {
        if (item.selected) {
          this.operation_list.push(new OperationResItem({
            res_str_id: item.res_str_id,
            readablePath: this.resource.rname + '   /   ' + item.rname,
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

  go_search(searching: boolean) {
    this.search_mode = searching;
  }

  toggle_search_mode() {
    if (this.search_mode) {
      this.search_mode = false;
      if (this.search_value) {
        this.search_value = null;
        this.resource_search();
      }
      return;
    }
    this.search_mode = !this.search_mode;
  }

  open_search_mode() {
    if (!this.search_mode) {
      this.search_mode = true;
    }
  }

  collapse_search_mode() {
    if (!this.search_mode) {
      return;
    }
    this.search_mode = false;
    if (this.search_value) {
      this.search_value = null;
      this.resource_search();
    }
  }

  update_search_value(value: string) {
    this.search_value = value;
    this.search_terms.next(value);
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
    BaseService.savePageCookie(this.res_str_id, this.scroll_top, this.search_value, this.search_mode);
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
    BaseService.savePageCookie(this.res_str_id, this.scroll_top, this.search_value, this.search_mode);
    this.router.navigate(link)
      .then();
  }

  get foot_btns() {
    const _foot_btns = [];
    for (const foot_btn of this.footBtnService.foot_btn_list) {
      if (this.resource && !foot_btn.hide) {
        if ((this.resource.is_folder && foot_btn.folder) || (!this.resource.is_folder && foot_btn.file)) {
          if (this.resource.is_home && !foot_btn.root) {
            continue;
          }
          if (foot_btn.login && !this.is_owner) {
            continue;
          }
          if (foot_btn.noLogin && this.is_owner) {
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
    const params = new URLSearchParams();
    params.set('token', BaseService.token || '');
    const visitKey = this.resolved_visit_key;
    if (visitKey) {
      params.set('visit_key', visitKey);
    }
    return `${this.baseService.host}/api/res/${this.resource.res_str_id}/dl?${params.toString()}`;
  }

  get direct_link() {
    if (!this.resource || this.resource.is_folder) {
      return null;
    }

    let link = `${this.baseService.short_link_host}/${this.resource.res_str_id}`;
    if (this.resource.rname) {
      link += `/${encodeURIComponent(this.resource.rname)}`;
    }

    if (this.resource.is_effectively_public) {
      return link;
    }

    const visitKey = this.resolved_visit_key;
    if (this.resource.is_protected && !visitKey) {
      return null;
    }
    if (this.resource.is_protected) {
      link += `?visit_key=${encodeURIComponent(visitKey)}`;
      return link;
    }

    return null;
  }

  get download_href() {
    return this.direct_link || this.dl_link;
  }

  get download_command() {
    if (!this.resource) {
      return "htx download";
    }

    const file_name = this.resource.rname || 'download.bin';
    return `htx download @${this.resource.res_str_id} "./${this.escapeCliPathSegment(file_name)}"`;
  }

  get download_directory_command() {
    if (!this.current_res_ref) {
      return 'htx download @resource-id ./workspace';
    }
    const directory_name = this.resource?.rname || 'workspace';
    return `htx download @${this.current_res_ref} "./${this.escapeCliPathSegment(directory_name)}"`;
  }

  get can_copy_direct_link() {
    return !!this.direct_link;
  }

  get download_action_text() {
    if (this.resource?.is_link) {
      return '打开目标';
    }
    return '下载资源';
  }

  get resolved_visit_key() {
    return this.resource?.visit_key || this.visit_key || ResourceService.loadVK(this.res_str_id);
  }

  get terminal_list_command() {
    if (!this.current_res_ref) {
      return "htx ls";
    }
    return `htx ls @${this.current_res_ref}`;
  }

  get parent_list_command() {
    const parent_ref = this.resource?.parent_str_id;
    if (!parent_ref || parent_ref === Resource.ROOT_ID) {
      return 'htx ls';
    }
    return `htx ls @${parent_ref}`;
  }

  get htx_command_options() {
    return [
      {value: ResComponent.HTX_DOWNLOAD_MODE, label: '下载'},
      {value: ResComponent.HTX_DISPLAY_MODE, label: '展示'},
      {value: ResComponent.HTX_MORE_MODE, label: '更多'},
    ];
  }

  get active_htx_command_label() {
    const active = this.htx_command_options.find((option) => option.value === this.htx_command_mode);
    return active?.label || '展示';
  }

  get display_command() {
    if (!this.resource) {
      return 'htx ls';
    }
    if (this.resource.is_folder) {
      return this.terminal_list_command;
    }
    if (this.resource.is_file || this.resource.is_link) {
      return this.parent_list_command;
    }
    return this.workspace_prompt_command;
  }

  get active_htx_command() {
    switch (this.htx_command_mode) {
      case ResComponent.HTX_DOWNLOAD_MODE:
        return this.resource?.is_folder ? this.download_directory_command : this.download_command;
      case ResComponent.HTX_DISPLAY_MODE:
      default:
        return this.display_command;
    }
  }

  get workspace_prompt_command() {
    if (!this.current_res_ref) {
      return "htx";
    }
    if (!this.resource) {
      return `htx open @${this.current_res_ref}`;
    }
    if (this.resource.is_folder) {
      return this.terminal_list_command;
    }
    if (this.resource.is_file || this.resource.is_link) {
      return this.download_command;
    }
    if (this.resource.is_protected) {
      return `htx access @${this.current_res_ref}`;
    }
    if (this.resource.is_private) {
      return `htx open @${this.current_res_ref}`;
    }
    return `htx inspect @${this.current_res_ref}`;
  }

  toggle_htx_menu(event?: Event) {
    event?.stopPropagation();
    this.is_htx_menu_open = !this.is_htx_menu_open;
  }

  select_htx_command_mode(mode: string, event?: Event) {
    event?.stopPropagation();
    this.is_htx_menu_open = false;
    if (mode === ResComponent.HTX_MORE_MODE) {
      const cliUrl = this.router.serializeUrl(this.router.createUrlTree(['/cli']));
      window.open(cliUrl, '_blank', 'noopener');
      return;
    }
    this.htx_command_mode = mode;
  }

  get sort_name_active() {
    return ResComponent.sort_accord === 'name';
  }

  get sort_time_active() {
    return ResComponent.sort_accord === 'time';
  }

  get sort_type_active() {
    return ResComponent.sort_accord === 'type';
  }

  get sort_direction() {
    return ResComponent.sort_ascend ? '↑' : '↓';
  }

  get time_header_label() {
    return ResComponent.relative_time ? '相对时间' : '绝对时间';
  }

  get time_toggle_icon() {
    return ResComponent.relative_time ? 'icon-toggleon' : 'icon-toggleoff';
  }

  resource_time(resource: Resource) {
    if (!resource) {
      return '-';
    }
    return ResComponent.relative_time ? resource.readable_time : resource.absolute_time;
  }

  toggle_time_display(event?: Event) {
    event?.stopPropagation();
    ResComponent.relative_time = !ResComponent.relative_time;
  }

  sort_state(accord: string) {
    if (ResComponent.sort_accord !== accord) {
      return 'inactive';
    }
    return ResComponent.sort_ascend ? 'asc' : 'desc';
  }

  private escapeCliPathSegment(name: string) {
    return name
      .replace(/\\/g, "\\\\")
      .replace(/"/g, '\\"');
  }

  private default_htx_command_mode() {
    return ResComponent.HTX_DISPLAY_MODE;
  }

  private reset_htx_command_mode() {
    this.htx_command_mode = this.default_htx_command_mode();
    this.is_htx_menu_open = false;
  }

  switch_tab_mode(tm: string) {
    this.tab_mode = tm;
  }

  sort_by_new_created(_: Resource, rb: Resource) {
    if (_.new_created === rb.new_created) {
      return 0;
    }
    return _.new_created ? -1 : 1;
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

  sort_by_size(ra: Resource, rb: Resource) {
    const left = typeof ra.rsize === 'number' ? ra.rsize : -1;
    const right = typeof rb.rsize === 'number' ? rb.rsize : -1;
    if (ResComponent.sort_ascend) {
      return left - right;
    } else {
      return right - left;
    }
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
      case 'size':
        this.search_list.sort(this.sort_by_size);
        break;
      case 'type':
        this.search_list.sort(this.sort_by_type);
        break;
      default:
        break;
    }
    this.search_list.sort(this.sort_by_new_created);
    this.sort_mode = false;
  }

  get show_back_icon() {
    return this.tab_mode === 'description' && !this.modify_desc;
  }

  copy_error() {
    BaseService.info_center.next(new Info({text: '复制失败', type: Info.TYPE_WARN}));
  }

  copy_succ(text = '复制成功') {
    BaseService.info_center.next(new Info({text, type: Info.TYPE_SUCC}));
  }

  activate_btn(btn: FootBtn) {
    this.is_multi_mode = false;
    this.footBtnService.activate_btn(btn);
    if (this.footBtnService.is_selecting) {
      this.tab_mode = "resource";
    } else if (this.footBtnService.is_deleting) {
      this.operation_list = [new OperationResItem({
        res_str_id: this.resource.res_str_id,
        readablePath: this.resource.rname,
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
        readablePath: this.resource.rname,
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

  cancel_modify_desc() {
    if (this.resource) {
      this.description = this.resource.description;
    } else {
      this.description = '';
    }
    this.modify_desc = false;
  }

  modify_desc_action() {
    this.resService.modify_res_info(this.res_str_id,
      {rname: null, description: this.description, visit_key: null, status: null, right_bubble: null, parent_str_id: null})
      .then((resp) => {
        this.resource.update(null, resp);
        this.description = this.resource.description;
        // this.footBtnService.inactivate();
        this.modify_desc = false;
      });
  }

  addChildRes(res: Resource) {
    res.new_created = true;
    this.children.push(res);
    this.resource_search();
  }

  removeChildren(res_str_ids: string[]) {
    if (!res_str_ids.length) {
      return;
    }
    this.children = this.children.filter((item) => !res_str_ids.includes(item.res_str_id));
    this.search_list = this.search_list.filter((item) => !res_str_ids.includes(item.res_str_id));
  }

  onUploadFolder(data: any) {
    const res_folder: FileList = data.res_folder;
    this.operation_list = [];

    for (let index = 0; index < res_folder.length; index++) {
      const res = res_folder[index];
      this.operation_list.push(new OperationResItem({
        res_str_id: null,
        readablePath: res.webkitRelativePath.replace('/', ' / '),
      }, res));
    }

    this.op_identifier = 'upload-folder';
    this.footBtnService.inactivate();
    this.start_operation(data.callback);
  }

  onUpload(data: any) {
    const res_files = data.res_files;
    const file_name = data.file_name;
    this.operation_list = [];
    if (res_files.length === 1) {
      this.operation_list.push(new OperationResItem({
        res_str_id: null,
        readablePath: file_name,
      }, res_files[0]));
    } else {
      for (let index = 0; index < res_files.length; index++) {
        const res = res_files[index];
        this.operation_list.push(new OperationResItem({
          res_str_id: null,
          readablePath: res.name,
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
      const deleted_res_ids = this.operation_list
        .map((item) => item.resId)
        .filter((item) => !!item);
      this.removeChildren(deleted_res_ids);
      this.operation_list = [];
      if (!this.is_multi_mode) {
        this.go_parent();
      } else {
        this.resService.get_res_info(this.res_str_id, null)
          .then((resp) => {
            this.baseInitResource(resp);
            this.resTreeService.refresh_node(this.resTreeService.root);
          });
      }
    });
  }

  onMove() {
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
    return '目录';
  }

  get current_res_ref() {
    return this.resource?.res_str_id || this.res_str_id || '';
  }

  get show_selection_column() {
    return !!(this.is_owner && this.resource?.is_folder);
  }

  get selected_count() {
    return this.search_list.filter((item) => item.selected).length;
  }

  get has_selection() {
    return this.selected_count > 0;
  }

  get all_search_list_selected() {
    return this.search_list.length > 0 && this.search_list.every((item) => item.selected);
  }

  get selection_header_icon() {
    return this.all_search_list_selected ? 'icon-check' : 'icon-uncheck';
  }

  get visibility_headline() {
    if (!this.resource) {
      return '';
    }
    if (!this.resource.is_secure_env) {
      return '实际公开';
    }
    if (this.resource.is_protected) {
      return '加密分享';
    }
    if (this.resource.is_private) {
      return '私有资源';
    }
    return '公开资源';
  }

  get visibility_detail() {
    if (!this.resource) {
      return '';
    }
    if (!this.resource.is_secure_env) {
      return `当前资源保持附属模式，因祖先目录“${this.resource.insecure_parent}”公开，访问效果等同公开资源。`;
    }
    if (this.resource.is_protected) {
      return '访客需要访问密码。页面直链会自动带 visit_key，适合一次性分发。';
    }
    if (this.resource.is_private) {
      return '只有当前账号体系内有权限的用户可以访问，页面不会暴露公开直链。';
    }
    return '任何拿到直链或页面链接的访客都可以直接访问此资源。';
  }

  get visibility_tone() {
    if (!this.resource) {
      return 'public';
    }
    if (!this.resource.is_secure_env) {
      return 'warn';
    }
    if (this.resource.is_protected) {
      return 'protect';
    }
    if (this.resource.is_private) {
      return 'private';
    }
    return 'public';
  }

  get readme_empty_hint() {
    if (this.is_owner) {
      return '补一段用途、下载方式或命令说明，这个资源页会清楚很多。';
    }
    return '当前资源还没有附带 README。';
  }

  open_readme_editor() {
    this.modify_desc = true;
    this.tab_mode = 'description';
  }

  open_inspector_action(btn: FootBtn) {
    this.is_multi_mode = false;
    this.footBtnService.open_btn(btn);
    if (this.footBtnService.is_deleting) {
      this.operation_list = [new OperationResItem({
        res_str_id: this.resource.res_str_id,
        readablePath: this.resource.rname,
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
        readablePath: this.resource.rname,
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

  show_insecure_info() {
    if (!this.resource) {
      return;
    }
    BaseService.info_center.next(new Info({text: this.resource.secure_info, type: Info.TYPE_WARN}));
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
