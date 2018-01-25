import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {FootBtnService} from "../../services/foot-btn.service";
import {Resource} from "../../models/resource";
import {ResourceService} from "../../services/resource.service";
import {RadioBtn} from "../../models/res-share-btn";
import {BaseService} from "../../services/base.service";
import {Info} from "../../models/info";

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
  upload_btns: Array<RadioBtn>;
  upload_active: number;
  res_files: FileList;
  folder_name: string;
  is_uploading: boolean;

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
    this.upload_btns = [this.upload_file, this.upload_folder];
    this.upload_active = Resource.RTYPE_FILE;

    this.folder_name = null;
    this.is_uploading = false;
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
    this.resService.modify_res_info(this.path, {status: btn.value, description: null, visit_key: null, rname: null})
      .then((resp) => {
        this.resource.status = resp.status;
        this.resource.visit_key = resp.visit_key;
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

  get upload_res_text() {
    if (this.res_files && this.res_files[0]) {
      return this.res_files[0].name;
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
    this.resService.get_upload_token(this.resource.res_id, {filename: res_name})
      .then((resp) => {
        this.resService.upload_file(resp.key, resp.upload_token, this.res_files[0])
          .then((resp_) => {
            this.onUploaded.emit(new Resource(resp_));
            this.res_files = null;
            this.footBtnService.foot_btn_active = null;
            this.is_uploading = false;
          });
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
    this.resService.create_folder(this.resource.res_id, {folder_name: this.folder_name})
      .then((resp) => {
        this.onUploaded.emit(new Resource((resp)));
        this.folder_name = null;
        this.footBtnService.foot_btn_active = null;
        this.is_uploading = false;
      });
  }

  copy_error() {
    BaseService.info_center.next(new Info({text: '复制失败', type: Info.TYPE_WARN}));
  }

  copy_succ() {
    BaseService.info_center.next(new Info({text: '复制成功', type: Info.TYPE_SUCC}));
  }

  get delete_text() {
    if (this.resource && this.resource.rtype === Resource.RTYPE_FILE) {
      return '删除此资源且无法恢复。';
    } else {
      return '删除此文件夹下的所有资源和子文件夹且无法恢复。';
    }
  }

  delete_res_action() {
    this.resService.delete_res(this.path)
      .then((resp) => {
        BaseService.info_center.next(new Info({text: '删除成功', type: Info.TYPE_SUCC}));
        this.footBtnService.foot_btn_active = null;
        this.onDeleted.emit();
      });
  }

  ngOnInit() {
    this.initShare();
    this.initUpload();
  }
}
