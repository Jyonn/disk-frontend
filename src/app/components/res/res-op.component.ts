import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {FootBtnService} from "../../services/foot-btn.service";
import {Resource} from "../../models/res/resource";
import {ResourceService} from "../../services/resource.service";
import {RadioBtn} from "../../models/res/res-share-btn";
import {BaseService} from "../../services/base.service";
import {Info} from "../../models/base/info";

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
  @Input() path: Array<any>;
  @Input() tab_mode: string;
  @Output() onUploaded = new EventEmitter<Resource>();
  @Output() onDeleted = new EventEmitter();

  constructor(
    public footBtnService: FootBtnService,
    public resService: ResourceService,
    public baseService: BaseService,
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
  res_files: FileList;
  folder_name: string;
  is_uploading: boolean;
  link_name: string;
  link_url: string;

  // foot btn modify
  // res_name: string;
  res_cover_files: FileList;
  is_modifying: boolean;

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
    this.is_uploading = false;
  }

  initModify() {
    this.is_modifying = false;
  }

  is_active(foot_btn_str: string, btn: RadioBtn) {
    if (foot_btn_str === 'share') {
      return this.resource && this.resource.status === btn.value;
    } else if (foot_btn_str === 'upload') {
      return this.upload_active === btn.value;
    }
  }

  share_status_change(btn: RadioBtn) {
    if (this.resource.status === btn.value) {
      return;
    }
    this.resService.api_modify_res_info(this.path,
      {status: btn.value, description: null, visit_key: null, rname: null, right_bubble: null})
      .then((resp) => {
        this.resource.update(resp);
      });
  }

  get share_show_text() {
    const url = `${this.baseService.front_host}/res/${BaseService.path_to_slug(this.path)}`;
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
    const res_str_id = this.path[this.path.length - 1];
    return `${this.baseService.front_host}/s/${res_str_id}`;
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
    if (this.is_uploading) {
      BaseService.info_center.next(new Info({text: '正在上传', type: Info.TYPE_SUCC}));
      return;
    }
    const res_name = this.upload_res_text;
    if (!res_name) {
      BaseService.info_center.next(new Info({text: '没有选择文件', type: Info.TYPE_WARN}));
      return;
    }
    this.is_uploading = true;
    this.resService.api_get_upload_token(this.resource.res_str_id, {filename: res_name})
      .then((resp) => {
        this.baseService.api_upload_file(resp.key, resp.upload_token, this.res_files[0])
          .then((resp_) => {
            this.onUploaded.emit(new Resource(resp_));
            this.res_files = null;
            this.footBtnService.foot_btn_active = null;
            this.is_uploading = false;
          })
          .catch(() => {
            this.is_uploading = false;
          });
      })
      .catch(() => {
        this.is_uploading = false;
      });
  }

  modify_res_cover_action() {
    if (this.is_modifying) {
      BaseService.info_center.next(new Info({text: '正在更新', type: Info.TYPE_SUCC}));
      return;
    }
    const res_cover = this.res_cover_name;
    if (!res_cover) {
      BaseService.info_center.next(new Info({text: '没有选择图片', type: Info.TYPE_WARN}));
      return;
    }
    this.is_modifying = true;
    this.resService.api_get_cover_token(this.resource.res_str_id, {filename: res_cover})
      .then((resp) => {
        this.baseService.api_upload_file(resp.key, resp.upload_token, this.res_cover_files[0])
          .then((resp_) => {
            this.resource.update(resp_);
            // this.res_cover_files = null;
            this.footBtnService.foot_btn_active = null;
            this.is_modifying = false;
            BaseService.info_center.next(new Info({text: '更新封面成功', type: Info.TYPE_SUCC}));
          })
          .catch(() => {
            this.is_modifying = false;
          });
      })
      .catch(() => {
        this.is_modifying = false;
      });
  }

  create_folder_action() {
    if (this.is_uploading) {
      BaseService.info_center.next(new Info({text: '正在上传', type: Info.TYPE_SUCC}));
      return;
    }
    if (!this.folder_name) {
      BaseService.info_center.next(new Info({text: '文件夹名不能为空', type: Info.TYPE_WARN}));
      return;
    }
    this.is_uploading = true;
    this.resService.api_create_folder(this.resource.res_str_id, {folder_name: this.folder_name})
      .then((resp) => {
        this.onUploaded.emit(new Resource((resp)));
        this.folder_name = null;
        this.footBtnService.foot_btn_active = null;
        this.is_uploading = false;
        BaseService.info_center.next(new Info({text: '创建文件夹成功', type: Info.TYPE_SUCC}));
      })
      .catch(() => {
        this.is_uploading = false;
      });
  }

  create_link_action() {
    if (this.is_uploading) {
      BaseService.info_center.next(new Info({text: '正在上传', type: Info.TYPE_SUCC}));
      return;
    }
    if (!this.link_name) {
      BaseService.info_center.next(new Info({text: '链接名不能为空', type: Info.TYPE_WARN}));
      return;
    }
    this.is_uploading = true;
    this.resService.api_create_link(this.resource.res_str_id, {link_name: this.link_name, link: this.link_url})
      .then((resp) => {
        this.onUploaded.emit(new Resource((resp)));
        this.link_name = null;
        this.footBtnService.foot_btn_active = null;
        this.is_uploading = false;
        BaseService.info_center.next(new Info({text: '创建链接成功', type: Info.TYPE_SUCC}));
      })
      .catch(() => {
        this.is_uploading = false;
      });
  }

  modify_res_name_action() {
    if (this.is_modifying) {
      BaseService.info_center.next(new Info({text: '正在更新', type: Info.TYPE_SUCC}));
      return;
    }
    if (!this.res_name) {
      BaseService.info_center.next(new Info({text: '资源名不能为空', type: Info.TYPE_WARN}));
      return;
    }
    this.is_modifying = true;
    this.resService.api_modify_res_info(this.path,
      {status: null, visit_key: null, description: null, rname: this.res_name, right_bubble: null})
      .then((resp) => {
        this.resource.update(resp);
        this.footBtnService.foot_btn_active = null;
        this.is_modifying = false;
        BaseService.info_center.next(new Info({text: '修改资源名成功', type: Info.TYPE_SUCC}));
      })
      .catch(() => {
        this.is_modifying = false;
      });
  }

  modify_res_visit_key_action() {
    if (this.is_modifying) {
      BaseService.info_center.next(new Info({text: '正在更新', type: Info.TYPE_SUCC}));
      return;
    }
    if (!this.res_visit_key) {
      BaseService.info_center.next(new Info({text: '密码不能为空', type: Info.TYPE_WARN}));
      return;
    }
    this.is_modifying = true;
    this.resService.api_modify_res_info(this.path,
      {status: null, visit_key: this.res_visit_key, description: null, rname: null, right_bubble: null})
      .then((resp) => {
        this.resource.update(resp);
        this.footBtnService.foot_btn_active = null;
        this.is_modifying = false;
        BaseService.info_center.next(new Info({text: '修改资源访问密码成功', type: Info.TYPE_SUCC}));
      })
      .catch(() => {
        this.is_modifying = false;
      });
  }

  modify_bubble_action() {
    if (this.is_modifying) {
      BaseService.info_center.next(new Info({text: '正在更新', type: Info.TYPE_SUCC}));
      return;
    }
    if (!this.resource) {
      BaseService.info_center.next(new Info({text: '资源尚未加载', type: Info.TYPE_WARN}));
    }
    const right_bubble = !this.resource.right_bubble;
    this.resService.api_modify_res_info(this.path,
      {status: null, visit_key: null, description: null, rname: null, right_bubble: right_bubble})
      .then((resp) => {
        this.resource.update(resp);
        this.footBtnService.foot_btn_active = null;
        this.is_modifying = false;
        BaseService.info_center.next(new Info({text: '修改成功', type: Info.TYPE_SUCC}));
      })
      .catch(() => {
        this.is_modifying = false;
      });
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

  get delete_text() {
    if (this.resource && this.resource.rtype === Resource.RTYPE_FILE) {
      return '删除此资源且无法恢复。';
    } else {
      return '删除此文件夹下的所有资源和子文件夹且无法恢复。';
    }
  }

  delete_res_action() {
    this.resService.api_delete_res(this.path)
      .then((resp) => {
        BaseService.info_center.next(new Info({text: '删除成功', type: Info.TYPE_SUCC}));
        this.footBtnService.foot_btn_active = null;
        this.onDeleted.emit();
      });
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
    return this.resource && this.resource.status === Resource.STATUS_PUBLIC;
  }

  show_insecure_info() {
    BaseService.info_center.next({text: this.resource.secure_info, type: Info.TYPE_WARN});
  }

  get right_bubble_class() {
    if (!this.resource) {
      return '';
    }
    return this.resource.right_bubble ? 'icon-toggleon' : 'icon-toggleoff';
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

  ngOnInit() {
    this.initShare();
    this.initUpload();
    this.initModify();
  }
}
