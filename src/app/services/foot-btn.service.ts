import {Injectable, OnInit} from "@angular/core";
import {FootBtn} from "../models/foot-btn";

@Injectable()
export class FootBtnService {
  foot_btn_share: FootBtn;
  foot_btn_select: FootBtn;
  foot_btn_upload: FootBtn;
  foot_btn_modify: FootBtn;
  foot_btn_delete: FootBtn;
  foot_btn_list: Array<FootBtn>;
  foot_btn_active: FootBtn;

  constructor() {
    this.foot_btn_share = new FootBtn({
      icon: 'icon-share',
      text: '分享',
      folder: true,
      file: true,
      mask: true,
    });
    this.foot_btn_select = new FootBtn({
      icon: 'icon-select',
      text: '多选',
      folder: true,
      file: false,
      mask: false,
    });
    this.foot_btn_upload = new FootBtn({
      icon: 'icon-upload',
      text: '上传',
      folder: true,
      file: false,
      mask: true,
    });
    this.foot_btn_modify = new FootBtn({
      icon: 'icon-modify',
      text: '修改',
      folder: true,
      file: true,
      mask: false,
    });
    this.foot_btn_delete = new FootBtn({
      icon: 'icon-delete',
      text: '删除',
      folder: true,
      file: true,
      mask: true,
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

  is_active(btn: FootBtn) {
    return (btn === this.foot_btn_active) ? 'active' : 'inactive';
  }

  get is_sharing() {
    return this.foot_btn_active === this.foot_btn_share;
  }
  get active_share() {
    return (this.foot_btn_active === this.foot_btn_share) ? 'active' : 'inactive';
  }

  get is_selecting() {
    return this.foot_btn_active === this.foot_btn_select;
  }
  get active_select() {
    return (this.foot_btn_active === this.foot_btn_select) ? 'active' : 'inactive';
  }

  get is_uploading() {
    return this.foot_btn_active === this.foot_btn_upload;
  }
  get active_upload() {
    return (this.foot_btn_active === this.foot_btn_upload) ? 'active' : 'inactive';
  }

  get is_modifying() {
    return this.foot_btn_active === this.foot_btn_modify;
  }
  get active_modify() {
    return (this.foot_btn_active === this.foot_btn_modify) ? 'active' : 'inactive';
  }

  get is_deleting() {
    return this.foot_btn_active === this.foot_btn_delete;
  }
  get active_delete() {
    return (this.foot_btn_active === this.foot_btn_delete) ? 'active' : 'inactive';
  }

  activate_btn(btn: FootBtn) {
    if (this.foot_btn_active === btn) {
      this.foot_btn_active = null;
    } else {
      this.foot_btn_active = btn;
    }
  }

  inactivate() {
    this.foot_btn_active = null;
  }
}
