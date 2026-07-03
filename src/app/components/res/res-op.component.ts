import {AfterViewChecked, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from "@angular/core";
import {Resource} from "../../models/res/resource";
import {ResourceService} from "../../services/resource.service";
import {RadioBtn} from "../../models/res/radio-btn";
import {BaseService} from "../../services/base.service";
import {Info} from "../../models/base/info";
import {TipsService} from "../../services/tips.service";
import {UpdateService} from "../../services/update.service";
import {ResourceTreeService} from "../../services/resource-tree.service";
import {FootBtnService} from "../../services/foot-btn.service";
import {UserService} from "../../services/user.service";

@Component({
  selector: 'app-res-op',
  templateUrl: './res-op.component.html',
  styleUrls: [
    '../../../assets/css/icon-fonts.css',
    '../../../assets/css/operation.less',
  ]
})
export class ResOpComponent implements OnInit, AfterViewChecked {
  @Input() resource: Resource;
  @Input() res_str_id: string;
  @Input() tab_mode: string;
  @Input() delete_text: string;
  @ViewChild('renameInput') renameInputRef: ElementRef<HTMLInputElement>;
  @Output() onUploaded = new EventEmitter<any>();
  @Output() onUploadedFolder = new EventEmitter<any>();
  @Output() onAddChildRes = new EventEmitter<Resource>();
  @Output() onDeleted = new EventEmitter();
  @Output() onMove = new EventEmitter();

  constructor(
    public footBtnService: FootBtnService,
    public resService: ResourceService,
    public baseService: BaseService,
    public tipsService: TipsService,
    public updateService: UpdateService,
    public resTreeService: ResourceTreeService,
    public userService: UserService,
  ) {}

  // foot btn share
  share_private: RadioBtn;
  share_protect: RadioBtn;
  share_public: RadioBtn;
  share_btns: Array<RadioBtn>;

  // foot btn upload
  upload_file: RadioBtn;
  upload_folder: RadioBtn;
  create_folder: RadioBtn;
  upload_link: RadioBtn;
  upload_btns: Array<RadioBtn>;
  upload_active: number;
  upload_folder_ok: boolean;  // chrome浏览器才支持

  res_files: FileList;
  file_name: string;
  folder_name: string;
  link_name: string;
  link_url: string;

  res_folder: FileList;
  upload_folder_name: string;
  copy_short: boolean;
  rename_draft: string;
  pending_rename_focus: boolean;
  rename_modal_opened: boolean;

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
      text: '上传文件夹',
      value: 666,
    });
    this.create_folder = new RadioBtn({
      text: '创建文件夹',
      value: Resource.RTYPE_FOLDER,
    });
    this.upload_link = new RadioBtn({
      text: '创建链接',
      value: Resource.RTYPE_LINK,
    });
    if (this.upload_folder_ok) {
      this.upload_btns = [this.upload_file, this.upload_folder, this.create_folder, this.upload_link];
    } else {
      this.upload_btns = [this.upload_file, this.create_folder, this.upload_link];
    }
    this.upload_active = Resource.RTYPE_FILE;

    this.folder_name = null;
    this.link_name = null;
    this.link_url = null;
  }

  b2s(b: boolean) {
    return b ? 'active' : 'inactive';
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
    this.resService.modify_res_info(this.res_str_id,
      {status: btn.value, description: null, visit_key: null, rname: null, right_bubble: null, parent_str_id: null})
      .then((resp) => {
        this.resource.update(null, resp);
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
    let link = `${this.baseService.short_link_host}/${this.res_str_id}`;
    if (!this.copy_short && this.resource) {
      link += `/${this.resource.rname.replace(' ', '%20')}`;
    }
    return link;
  }

  get short_or_long() {
    return this.copy_short ? '长' : '短';
  }

  toggle_copy_mode() {
    this.copy_short = !this.copy_short;
    if (this.copy_short) {
      window.localStorage.setItem('copy-short', '1');
    } else {
      window.localStorage.removeItem('copy-short');
    }
  }

  get upload_res_text() {
    if (this.res_files && this.res_files[0]) {
      return this.res_files[0].name;
    } else {
      return null;
    }
  }

  choose_folder_onchange($event) {
    this.res_folder = $event.target.files;
    this.upload_folder_name = '';
    if (this.res_folder.length) {
      const path = this.res_folder[0].webkitRelativePath;
      this.upload_folder_name = path.substr(0, path.indexOf('/'));
    }

    this.upload_folder_action();
  }

  upload_folder_action() {
    if (this.footBtnService.is_ajax_uploading) {
      BaseService.info_center.next(new Info({text: '正在上传', type: Info.TYPE_SUCC}));
      return;
    }
    if (!this.res_folder.length) {
      BaseService.info_center.next(new Info({text: '没有选择文件夹或文件夹为空', type: Info.TYPE_WARN}));
      return;
    }
    this.footBtnService.is_ajax_uploading = true;

    this.onUploadedFolder.emit({
      res_folder: this.res_folder,
      callback: () => {
        this.res_folder = null;
        this.upload_folder_name = '';
        this.footBtnService.is_ajax_uploading = false;
      }
    });
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
        this.footBtnService.inactivate();
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
        this.footBtnService.inactivate();
        this.footBtnService.is_ajax_uploading = false;
        BaseService.info_center.next(new Info({text: '创建链接成功', type: Info.TYPE_SUCC}));
      })
      .catch(() => {
        this.footBtnService.is_ajax_uploading = false;
      });
  }

  rename_res_action() {
    if (this.footBtnService.is_ajax_modifying) {
      BaseService.info_center.next(new Info({text: '正在更新', type: Info.TYPE_SUCC}));
      return;
    }
    const next_name = (this.rename_draft || '').trim();
    if (!next_name) {
      BaseService.info_center.next(new Info({text: '资源名称不能为空', type: Info.TYPE_WARN}));
      return;
    }
    if (this.resource && next_name === this.resource.rname) {
      this.footBtnService.inactivate();
      return;
    }
    this.footBtnService.is_ajax_modifying = true;
    this.resService.modify_res_info(this.res_str_id,
      {status: null, visit_key: null, description: null, rname: next_name, right_bubble: null, parent_str_id: null})
      .then((resp) => {
        this.resource.update(null, resp);
        this.rename_draft = this.resource.rname;
        this.footBtnService.inactivate();
        BaseService.info_center.next(new Info({text: '重命名成功', type: Info.TYPE_SUCC}));
      })
      .catch(() => null)
      .finally(() => {
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
        this.footBtnService.inactivate();
        this.footBtnService.is_ajax_modifying = false;
        BaseService.info_center.next(new Info({text: '修改资源访问密码成功', type: Info.TYPE_SUCC}));
      })
      .catch(() => {
        this.footBtnService.is_ajax_modifying = false;
      });
  }

  move_res_action() {
    this.footBtnService.inactivate();
    this.onMove.emit();
  }

  copy_error() {
    BaseService.info_center.next(new Info({text: '复制失败', type: Info.TYPE_WARN}));
  }

  copy_succ() {
    BaseService.info_center.next(new Info({text: '复制成功', type: Info.TYPE_SUCC}));
  }

  copy_link_succ() {
    let info_text = '复制成功，支持在链接后加扩展名（如.mp3）';
    if (!this.copy_short) {
      info_text = '复制成功，可随意编辑链接末尾的文件名';
    }
    BaseService.info_center.next(new Info({text: info_text, type: Info.TYPE_SUCC}));
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
    this.footBtnService.inactivate();
    this.onDeleted.emit();
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
    return this.footBtnService.foot_btn_active.mask;
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

  get is_renaming() {
    return this.footBtnService.is_renaming;
  }

  show_insecure_info() {
    BaseService.info_center.next({text: this.resource.secure_info, type: Info.TYPE_WARN});
  }

  nav_zip() {
    window.localStorage.removeItem('normal-nav');
    this.resService.refresh_zip_nav();
  }

  nav_normal() {
    window.localStorage.setItem('normal-nav', '1');
    this.resService.refresh_zip_nav();
  }

  cover_show() {
    window.localStorage.removeItem('cover-normal');
  }

  cover_normal() {
    window.localStorage.setItem('cover-normal', '1');
  }

  get is_owner() {
    return this.userService.user && this.resource && this.userService.user.user_id === this.resource.owner.user_id;
  }

  ngOnInit() {
    const tmpInput = document.createElement('input');
    this.upload_folder_ok = 'webkitdirectory' in tmpInput;
    this.rename_draft = '';
    this.pending_rename_focus = false;
    this.rename_modal_opened = false;

    this.initShare();
    this.initUpload();
    this.copy_short = !!window.localStorage.getItem('copy-short');
  }

  ngAfterViewChecked() {
    if (this.is_renaming && !this.rename_modal_opened) {
      this.rename_draft = this.resource?.rname || '';
      this.pending_rename_focus = true;
      this.rename_modal_opened = true;
    } else if (!this.is_renaming && this.rename_modal_opened) {
      this.rename_modal_opened = false;
      this.pending_rename_focus = false;
    }

    if (!this.pending_rename_focus || !this.renameInputRef) {
      return;
    }
    const input = this.renameInputRef.nativeElement;
    input.focus();
    input.select();
    this.pending_rename_focus = false;
  }
}
