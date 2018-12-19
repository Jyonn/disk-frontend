import {Injectable} from "@angular/core";
import {FootBtn} from "../models/res/foot-btn";

@Injectable()
export class FootBtnService {
  foot_btn_share: FootBtn;
  foot_btn_select: FootBtn;
  foot_btn_upload: FootBtn;
  foot_btn_modify: FootBtn;
  foot_btn_move: FootBtn;
  foot_btn_delete: FootBtn;
  foot_btn_tips: FootBtn;
  foot_btn_list: Array<FootBtn>;
  foot_btn_active: FootBtn;

  is_ajax_uploading: boolean;
  is_ajax_modifying: boolean;

  is_btn_hide(key) {
    return !!window.localStorage.getItem('hide-' + key);
  }

  constructor() {
    this.is_ajax_modifying = this.is_ajax_uploading = false;

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
      mask: true,
    });
    this.foot_btn_move = new FootBtn({
      icon: 'icon-move',
      text: '移动',
      folder: true,
      file: true,
      mask: true,
    });
    this.foot_btn_delete = new FootBtn({
      icon: 'icon-delete',
      text: '删除',
      folder: true,
      file: true,
      mask: true,
    });
    this.foot_btn_tips = new FootBtn({
      icon: 'icon-tips',
      text: '贴士',
      folder: true,
      file: true,
      mask: true,
    });
    this.foot_btn_list = [
      this.foot_btn_share,
      this.foot_btn_select,
      this.foot_btn_upload,
      this.foot_btn_modify,
      this.foot_btn_move,
      this.foot_btn_delete,
      this.foot_btn_tips,
    ];
    this.foot_btn_active = null;
    this.update_btns();
  }

  update_btns() {
    for (const foot_btn of this.foot_btn_list) {
      foot_btn.hide = this.is_btn_hide(foot_btn.icon);
    }
  }

  btn_hide(btn: FootBtn) {
    window.localStorage.setItem('hide-' + btn.icon, '1');
    this.update_btns();
  }

  btn_show(btn: FootBtn) {
    window.localStorage.removeItem('hide-' + btn.icon);
    this.update_btns();
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

  get is_moving() {
    return this.foot_btn_active === this.foot_btn_move;
  }
  get active_move() {
    return (this.foot_btn_active === this.foot_btn_move) ? 'active' : 'inactive';
  }

  get is_deleting() {
    return this.foot_btn_active === this.foot_btn_delete;
  }
  get active_delete() {
    return (this.foot_btn_active === this.foot_btn_delete) ? 'active' : 'inactive';
  }

  get active_tips() {
    return (this.foot_btn_active === this.foot_btn_tips) ? 'active' : 'inactive';
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
