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
  res_str_id: number;
  rname: string;
  rtype: number;
  rsize: number;
  sub_type: number;
  description: string;
  cover: string;
  owner: User;
  parent_str_id: number;
  status: number;
  create_time: number;
  dlcount: number;
  visit_key: string;
  selected: boolean;
  is_home: boolean;

  constructor(d: {
    res_str_id, // 资源唯一随机ID
    rname, // 资源名称
    rtype, // 资源类型（RTYPE_FILE, RTYPE_FOLDER, RTYPE_LINK）
    rsize, // 资源大小
    sub_type, // 资源子类型（STYPE_FOLDER, STYPE_IMAGE, STYPE_VIDEO, STYPE_MUSIC, STYPE_FILE, STYPE_LINK）
    description, // 资源介绍
    cover, // 资源封面
    owner, // 资源拥有者
    parent_str_id, // 资源所在目录
    status, // 资源加密状态
    create_time, // 资源创建时间
    dlcount, // 资源下载量
    visit_key, // 资源访问密钥
    is_home // 是否是用户根目录
  }) {
    this.res_str_id = d.res_str_id;
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
    this.parent_str_id = d.parent_str_id;
    this.status = d.status;
    this.create_time = d.create_time;
    this.dlcount = d.dlcount;
    this.visit_key = d.visit_key;
    this.selected = false;
    this.is_home = d.is_home;
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
