import {User} from "./user";
import {ClockService} from "../services/clock.service";

export class Resource {
  public static ROOT_ID = 1;
  public static RTYPE_FILE = 0;
  public static RTYPE_FOLDER = 1;
  public static RTYPE_LINK = 2;
  public static STATUS_PUBLIC = 0;
  public static STATUS_PRIVATE = 1;
  public static STATUS_PROTECT = 2;
  public static STYPE_FOLDER = 0;
  public static STYPE_IMAGE = 1;
  public static STYPE_VIDEO = 2;
  public static STYPE_MUSIC = 3;
  public static STYPE_FILE = 4;
  public static STYPE_LINK = 5;
  res_id: number;
  rname: string;
  rtype: number;
  rsize: number;
  sub_type: number;
  description: string;
  cover: string;
  owner: User;
  parent_id: number;
  status: number;
  create_time: number;
  dlcount: number;
  visit_key: string;
  selected: boolean;

  constructor(d: {res_id, rname, rtype, rsize, sub_type, description, cover, owner, parent_id, status, create_time, dlcount, visit_key}) {
    this.res_id = d.res_id;
    this.rname = d.rname;
    this.rtype = d.rtype;
    this.rsize = d.rsize;
    this.sub_type = d.sub_type;
    this.description = d.description;
    this.cover = d.cover;
    if (d.owner instanceof User) {
      this.owner = d.owner;
    } else {
      this.owner = new User(d.owner);
    }
    this.parent_id = d.parent_id;
    this.status = d.status;
    this.create_time = d.create_time;
    this.dlcount = d.dlcount;
    this.visit_key = d.visit_key;
    this.selected = false;
  }

  update(d: {rname, cover, status, dlcount, visit_key, description}) {
    this.rname = d.rname;
    this.cover = d.cover;
    this.status = d.status;
    this.dlcount = d.dlcount;
    this.visit_key = d.visit_key;
    this.description = d.description;
  }

  get readable_time() {
    let time_str = '';
    const offset = ClockService.ct - this.create_time;
    if (offset < 60) {
      time_str = '刚刚';
    } else if (offset < 60 * 60) {
      time_str = `${Math.floor(offset / 60)}分钟前`;
    } else if (offset < 24 * 60 * 60) {
      time_str = `${Math.floor(offset / 60 / 60)}小时前`;
    } else if (offset < 30 * 24 * 60 * 60) {
      time_str = `${Math.floor(offset / 60 / 60 / 24)}天前`;
    } else if (offset < 12 * 30 * 24 * 60 * 60) {
      time_str = `${Math.floor(offset / 60 / 60 / 24 / 30)}个月前`;
    } else {
      time_str = `${Math.floor(offset / 60 / 60 / 24 / 30 / 12)}年前`;
    }
    return time_str;
  }

  get readable_status() {
    if (this.status === Resource.STATUS_PRIVATE) {
      return '私有资源';
    } else if (this.status === Resource.STATUS_PUBLIC) {
      return '公开资源';
    } else {
      return '加密资源';
    }
  }

  get url_cover() {
    if (this.cover) {
      return `url('${this.cover}')`;
    } else {
      return `url('https://unsplash.6-79.cn/random/thumb?r=${this.create_time}')`;
    }
    // return `url('${this.cover}')`;
  }
  get icon() {
    switch (this.sub_type) {
      case Resource.STYPE_FOLDER:
        return 'icon-folder';
      case Resource.STYPE_IMAGE:
        return 'icon-image';
      case Resource.STYPE_VIDEO:
        return 'icon-video';
      case Resource.STYPE_MUSIC:
        return 'icon-music';
      default:
        return 'icon-file';
    }
  }

  get icon_select() {
    if (this.selected) {
      return 'icon-check';
    } else {
      return 'icon-uncheck';
    }
  }

  get is_home() {
    return this.parent_id === Resource.ROOT_ID;
  }

  get is_folder() {
    return this.rtype === Resource.RTYPE_FOLDER;
  }

  get size() {
    const base = 'BKMGT';
    let size = this.rsize;
    if (!this.rsize) {
      return null;
    }
    for (let i = 0; i < base.length; i++) {
      if (size < 1024) {
        return `${Math.round(size)} ${base[i]}`;
      }
      size /= 1024;
    }
  }
}
