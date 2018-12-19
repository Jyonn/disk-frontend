import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {Resource} from "../../models/res/resource";
import {ResourceService} from "../../services/resource.service";
import {RadioBtn} from "../../models/res/res-share-btn";
import {BaseService} from "../../services/base.service";
import {Info} from "../../models/base/info";
import {TipsService} from "../../services/tips.service";
import {UpdateService} from "../../services/update.service";
import {ResourceTreeService} from "../../services/resource-tree.service";
import {FootBtnService} from "../../services/foot-btn.service";

@Component({
  selector: 'app-res-op',
  templateUrl: './res-op.component.html',
  styleUrls: [
    '../../../assets/css/icon-fonts.css',
    '../../../assets/css/operation.less',
  ]
})
export class ResOpComponent implements OnInit {
  @Input() resource: Resource;
  @Input() res_str_id: string;
  @Input() tab_mode: string;
  @Input() delete_text: string;
  @Output() onUploaded = new EventEmitter<any>();
  @Output() onAddChildRes = new EventEmitter<Resource>();
  @Output() onDeleted = new EventEmitter();
  @Output() onMove = new EventEmitter();
  @Output() onRefreshNavHide = new EventEmitter();

  constructor(
    public footBtnService: FootBtnService,
    public resService: ResourceService,
    public baseService: BaseService,
    public tipsService: TipsService,
    public updateService: UpdateService,
    public resTreeService: ResourceTreeService,
  ) {}

  // foot btn share
  share_private: RadioBtn;
  share_protect: RadioBtn;
  share_public: RadioBtn;
  share_btns: Array<RadioBtn>;

  // foot btn upload
  upload_file: RadioBtn;
  upload_folder: RadioBtn;
  upload_link: RadioBtn;
  upload_btns: Array<RadioBtn>;
  upload_active: number;

  // foot btn modify
  cover_random: RadioBtn;
  cover_upload: RadioBtn;
  cover_father: RadioBtn;
  cover_outlnk: RadioBtn;
  cover_self: RadioBtn;
  cover_resource: RadioBtn;
  cover_btn_list: Array<RadioBtn>;

  res_files: FileList;
  file_name: string;
  folder_name: string;
  link_name: string;
  link_url: string;

  // foot btn modify
  // res_name: string;
  res_cover_files: FileList;

  initShare() {
    this.share_private = new RadioBtn({
      text: '私有资源',
      value: Resource.STATUS_PRIVATE,
    });
    this.share_protect = new RadioBtn({
      text: '加密分享',
      value: Resource.STATUS_PROTECT,
    });
    this.share_public = new RadioBtn({
      text: '公开分享',
      value: Resource.STATUS_PUBLIC,
    });
    this.share_btns = [this.share_private, this.share_protect, this.share_public];
  }

  initUpload() {
    this.upload_file = new RadioBtn({
      text: '上传文件',
      value: Resource.RTYPE_FILE,
    });
    this.upload_folder = new RadioBtn({
      text: '创建文件夹',
      value: Resource.RTYPE_FOLDER,
    });
    this.upload_link = new RadioBtn({
      text: '创建链接',
      value: Resource.RTYPE_LINK,
    });
    this.upload_btns = [this.upload_file, this.upload_folder, this.upload_link];
    this.upload_active = Resource.RTYPE_FILE;

    this.folder_name = null;
    this.link_name = null;
    this.link_url = null;
  }

  initCover() {
    this.cover_random = new RadioBtn({
      text: '随机',
      value: Resource.COVER_RANDOM,
    });
    this.cover_upload = new RadioBtn({
      text: '上传',
      value: Resource.COVER_UPLOAD,
    });
    this.cover_father = new RadioBtn({
      text: '接力',
      value: Resource.COVER_FATHER,
    });
    this.cover_outlnk = new RadioBtn({
      text: '外链',
      value: Resource.COVER_OUTLNK,
    });
    this.cover_self = new RadioBtn({
      text: '本图',
      value: Resource.COVER_SELF,
    });
    this.cover_resource = new RadioBtn({
      text: '资源',
      value: Resource.COVER_RESOURCE,
    });
    this.cover_btn_list = [
      this.cover_random,
      this.cover_upload,
      this.cover_father,
      this.cover_outlnk,
      this.cover_self,
      this.cover_resource
    ];
  }

  get cover_btns() {
    const _cover_btns = [];
    for (const cover_btn of this.cover_btn_list) {
      if (this.resource && (cover_btn.value !== Resource.COVER_SELF || this.resource.sub_type === Resource.STYPE_IMAGE)) {
        _cover_btns.push(cover_btn);
      }
    }
    return _cover_btns;
  }

  b2s(b: boolean) {
    return b ? 'active' : 'inactive';
  }

  is_active(foot_btn_str: string, btn: RadioBtn) {
    if (foot_btn_str === 'share') {
      return this.resource && this.resource.status === btn.value;
    } else if (foot_btn_str === 'upload') {
      return this.upload_active === btn.value;
    } else if (foot_btn_str === 'cover') {
      return this.resource && this.resource.cover_type === btn.value;
    }
  }

  share_status_change(btn: RadioBtn) {
    if (this.resource.status === btn.value) {
      return;
    }
    this.resService.modify_res_info(this.res_str_id,
      {status: btn.value, description: null, visit_key: null, rname: null, right_bubble: null, parent_str_id: null})
      .then((resp) => {
        this.resource.update(null, resp);
      });
  }

  cover_type_change(btn: RadioBtn) {
    if (this.resource.cover_type === btn.value) {
      return;
    }
    // upload和outlnk, resource不能立即修改
    if (btn.value === Resource.COVER_UPLOAD || btn.value === Resource.COVER_OUTLNK || btn.value === Resource.COVER_RESOURCE) {
      this.resource.cover_type = btn.value;
      return;
    }

    if (btn.value === Resource.COVER_FATHER && this.resource.is_home) {
      BaseService.info_center.next(new Info({text: '根目录无法设置封面与父目录一致', type: Info.TYPE_WARN}));
      return;
    }

    this.resService.modify_res_cover(this.res_str_id,
      {cover: '', cover_type: btn.value})
      .then((resp) => {
        this.resource.update(this.baseService, resp);
        BaseService.info_center.next(new Info({text: '更新封面成功', type: Info.TYPE_SUCC}));
      });
  }

  get share_show_text() {
    const url = `${this.baseService.front_host}/res/${this.res_str_id}`;
    if (!this.resource) {
      return;
    }
    if (this.resource.status === Resource.STATUS_PRIVATE) {
      return url;
    } else if (this.resource.status === Resource.STATUS_PROTECT) {
      return `我分享了加密资源“${this.resource.rname}”：${url}，密码：${this.resource.visit_key}，快点进来看看吧！`;
    } else {
      return `我分享了“${this.resource.rname}”：${url}，快点进来看看吧！`;
    }
  }

  get share_direct_link() {
    const res_str_id = this.res_str_id;
    return `${this.baseService.short_link_host}/${res_str_id}`;
  }

  get upload_res_text() {
    if (this.res_files && this.res_files[0]) {
      return this.res_files[0].name;
    } else {
      return null;
    }
  }

  get res_cover_name() {
    if (this.res_cover_files && this.res_cover_files[0]) {
      return this.res_cover_files[0].name;
    } else {
      return null;
    }
  }

  upload_file_action() {
    if (this.footBtnService.is_ajax_uploading) {
      BaseService.info_center.next(new Info({text: '正在上传', type: Info.TYPE_SUCC}));
      return;
    }
    const res_name = this.upload_res_text;
    if (!res_name) {
      BaseService.info_center.next(new Info({text: '没有选择文件', type: Info.TYPE_WARN}));
      return;
    }
    this.footBtnService.is_ajax_uploading = true;

    this.onUploaded.emit({
      res_files: this.res_files,
      file_name: this.file_name,
      callback: () => {
        this.file_name = '';
        this.res_files = null;
        this.footBtnService.is_ajax_uploading = false;
      }
    });
  }

  modify_res_cover_action() {
    if (this.footBtnService.is_ajax_modifying) {
      BaseService.info_center.next(new Info({text: '正在更新', type: Info.TYPE_SUCC}));
      return;
    }
    const res_cover = this.res_cover_name;
    if (!res_cover) {
      BaseService.info_center.next(new Info({text: '没有选择图片', type: Info.TYPE_WARN}));
      return;
    }
    this.footBtnService.is_ajax_modifying = true;
    this.resService.get_cover_token(this.res_str_id, {filename: res_cover})
      .then((resp) => {
        this.baseService.api_upload_file(resp.key, resp.upload_token, this.res_cover_files[0])
          .then((resp_) => {
            this.resource.update(null, resp_);
            this.res_cover_files = null;
            // this.footBtnService.foot_btn_active = null;
            this.footBtnService.is_ajax_modifying = false;
            BaseService.info_center.next(new Info({text: '更新封面成功', type: Info.TYPE_SUCC}));
          })
          .catch(() => {
            this.footBtnService.is_ajax_modifying = false;
          });
      })
      .catch(() => {
        this.footBtnService.is_ajax_modifying = false;
      });
  }

  modify_res_cover_link() {
    const res_cover = this.res_cover_value;
    if (!res_cover) {
      BaseService.info_center.next(new Info({text: '外部链接不能为空', type: Info.TYPE_WARN}));
      return;
    }
    this.resService.modify_res_cover(this.res_str_id,
      {cover: res_cover, cover_type: Resource.COVER_OUTLNK})
      .then((resp) => {
        this.resource.update(this.baseService, resp);
        BaseService.info_center.next(new Info({text: '更新封面为外部链接', type: Info.TYPE_SUCC}));
      });
  }

  modify_res_cover_resource() {
    this.resService.modify_res_cover(this.res_str_id,
      {cover: ResourceTreeService.selectResStrId, cover_type: Resource.COVER_RESOURCE})
      .then((resp) => {
        this.resource.update(this.baseService, resp);
        BaseService.info_center.next(new Info({text: `更新封面与资源“${ResourceTreeService.selectedResName}”一致`, type: Info.TYPE_SUCC}));
      });
  }

  create_folder_action() {
    if (this.footBtnService.is_ajax_uploading) {
      BaseService.info_center.next(new Info({text: '正在上传', type: Info.TYPE_SUCC}));
      return;
    }
    if (!this.folder_name) {
      BaseService.info_center.next(new Info({text: '文件夹名不能为空', type: Info.TYPE_WARN}));
      return;
    }
    this.footBtnService.is_ajax_uploading = true;
    this.resService.create_folder(this.resource.res_str_id, {folder_name: this.folder_name})
      .then((resp) => {
        this.onAddChildRes.emit(new Resource(this.baseService, resp));
        this.folder_name = null;
        this.footBtnService.foot_btn_active = null;
        this.footBtnService.is_ajax_uploading = false;
        BaseService.info_center.next(new Info({text: '创建文件夹成功', type: Info.TYPE_SUCC}));
      })
      .catch(() => {
        this.footBtnService.is_ajax_uploading = false;
      });
  }

  create_link_action() {
    if (this.footBtnService.is_ajax_uploading) {
      BaseService.info_center.next(new Info({text: '正在上传', type: Info.TYPE_SUCC}));
      return;
    }
    if (!this.link_name) {
      BaseService.info_center.next(new Info({text: '链接名不能为空', type: Info.TYPE_WARN}));
      return;
    }
    this.footBtnService.is_ajax_uploading = true;
    this.resService.create_link(this.resource.res_str_id, {link_name: this.link_name, link: this.link_url})
      .then((resp) => {
        this.onAddChildRes.emit(new Resource(this.baseService, resp));
        this.link_name = null;
        this.footBtnService.foot_btn_active = null;
        this.footBtnService.is_ajax_uploading = false;
        BaseService.info_center.next(new Info({text: '创建链接成功', type: Info.TYPE_SUCC}));
      })
      .catch(() => {
        this.footBtnService.is_ajax_uploading = false;
      });
  }

  modify_res_name_action() {
    if (this.footBtnService.is_ajax_modifying) {
      BaseService.info_center.next(new Info({text: '正在更新', type: Info.TYPE_SUCC}));
      return;
    }
    if (!this.res_name) {
      BaseService.info_center.next(new Info({text: '资源名不能为空', type: Info.TYPE_WARN}));
      return;
    }
    this.footBtnService.is_ajax_modifying = true;
    this.resService.modify_res_info(this.res_str_id,
      {status: null, visit_key: null, description: null, rname: this.res_name, right_bubble: null, parent_str_id: null})
      .then((resp) => {
        this.resource.update(null, resp);
        // this.footBtnService.foot_btn_active = null;
        this.footBtnService.is_ajax_modifying = false;
        BaseService.info_center.next(new Info({text: '修改资源名成功', type: Info.TYPE_SUCC}));
      })
      .catch(() => {
        this.footBtnService.is_ajax_modifying = false;
      });
  }

  modify_res_visit_key_action() {
    if (this.footBtnService.is_ajax_modifying) {
      BaseService.info_center.next(new Info({text: '正在更新', type: Info.TYPE_SUCC}));
      return;
    }
    if (!this.res_visit_key) {
      BaseService.info_center.next(new Info({text: '密码不能为空', type: Info.TYPE_WARN}));
      return;
    }
    this.footBtnService.is_ajax_modifying = true;
    this.resService.modify_res_info(this.res_str_id,
      {status: null, visit_key: this.res_visit_key, description: null, rname: null, right_bubble: null, parent_str_id: null})
      .then((resp) => {
        this.resource.update(null, resp);
        this.footBtnService.foot_btn_active = null;
        this.footBtnService.is_ajax_modifying = false;
        BaseService.info_center.next(new Info({text: '修改资源访问密码成功', type: Info.TYPE_SUCC}));
      })
      .catch(() => {
        this.footBtnService.is_ajax_modifying = false;
      });
  }

  modify_bubble_action() {
    if (this.footBtnService.is_ajax_modifying) {
      BaseService.info_center.next(new Info({text: '正在更新', type: Info.TYPE_SUCC}));
      return;
    }
    if (!this.resource) {
      BaseService.info_center.next(new Info({text: '资源尚未加载', type: Info.TYPE_WARN}));
    }
    const right_bubble = !this.resource.right_bubble;
    this.resService.modify_res_info(this.res_str_id,
      {status: null, visit_key: null, description: null, rname: null, right_bubble: right_bubble, parent_str_id: null})
      .then((resp) => {
        this.resource.update(null, resp);
        // this.footBtnService.foot_btn_active = null;
        this.footBtnService.is_ajax_modifying = false;
        BaseService.info_center.next(new Info({text: '修改资源属性成功', type: Info.TYPE_SUCC}));
      })
      .catch(() => {
        this.footBtnService.is_ajax_modifying = false;
      });
  }

  move_res_action() {
    this.footBtnService.foot_btn_active = null;
    this.onMove.emit();
  }

  copy_error() {
    BaseService.info_center.next(new Info({text: '复制失败', type: Info.TYPE_WARN}));
  }

  copy_succ() {
    BaseService.info_center.next(new Info({text: '复制成功', type: Info.TYPE_SUCC}));
  }

  copy_link_succ() {
    BaseService.info_center.next(new Info({text: '复制成功，支持在链接后加扩展名（如.mp3）', type: Info.TYPE_SUCC}));
  }

  folder_filter() {
    return function (resource: any) {
      return resource.rtype === Resource.RTYPE_FOLDER;
    };
  }

  default_filter() {
    return function () {
      return true;
    };
  }

  delete_res_action() {
    this.footBtnService.foot_btn_active = null;
    this.onDeleted.emit();
  }

  get res_cover_value() {
    if (this.resource) {
      return this.resource.cover_for_outlnk;
    } else {
      return null;
    }
  }

  set res_cover_value(c: string) {
    if (this.resource) {
      this.resource.cover_for_outlnk = c;
    }
  }

  get res_name() {
    if (this.resource) {
      return this.resource.rname;
    } else {
      return null;
    }
  }

  set res_name(r: string) {
    if (this.resource) {
      this.resource.rname = r;
    }
  }

  get res_visit_key() {
    if (this.resource) {
      return this.resource.visit_key;
    } else {
      return null;
    }
  }

  set res_visit_key(r: string) {
    if (this.resource) {
      this.resource.visit_key = r;
    }
  }

  get active_block() {
    if (!this.footBtnService.foot_btn_active) {
      return false;
    }
    if (!this.footBtnService.foot_btn_active.mask) {
      return false;
    }
    return !(this.footBtnService.is_modifying && this.tab_mode === 'description');
  }

  get is_protect() {
    return this.resource && this.resource.status === Resource.STATUS_PROTECT;
  }

  get is_public() {
    return this.resource
      && (this.resource.rtype === Resource.RTYPE_FILE || this.resource.rtype === Resource.RTYPE_LINK)
      && (this.resource.status === Resource.STATUS_PUBLIC ||
        (this.resource.status === Resource.STATUS_PRIVATE && !this.resource.is_secure_env));
  }

  get selected_rname() {
    return ResourceTreeService.selectedResName ? ResourceTreeService.selectedResName : '暂未选择';
  }

  get cover_res_select_rname() {
    return `与资源“${this.selected_rname}”的封面一致`;
  }

  select_cover_resource() {

  }

  show_insecure_info() {
    BaseService.info_center.next({text: this.resource.secure_info, type: Info.TYPE_WARN});
  }

  get right_bubble_text() {
    if (!this.resource) {
      return null;
    }
    if (this.resource.right_bubble) {
      return '附属资源，能访问父资源就能访问我';
    } else {
      return '独立资源，不受父资源分享状态影响';
    }
  }

  nav_hide() {
    window.localStorage.setItem('hide-nav', '1');
    this.onRefreshNavHide.emit();
  }

  nav_show() {
    window.localStorage.removeItem('hide-nav');
    this.onRefreshNavHide.emit();
  }

  ngOnInit() {
    this.initShare();
    this.initUpload();
    this.initCover();
  }
}
