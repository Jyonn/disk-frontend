import {User} from "../user/user";
import {ClockService} from "../../services/clock.service";

export class Resource {
  public static ROOT_ID = 1;
  public static RTYPE_ENCRYPT = -1;
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
  right_bubble: boolean;
  is_secure_env: boolean;
  insecure_parent: string;

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
    is_home, // 是否是用户根目录
    secure_env, // 是否在安全环境 不安全（公开）的祖先目录名
    right_bubble, // 是否附属父级
  }) {
    this.res_str_id = d.res_str_id;
    this.rtype = d.rtype;
    this.rsize = d.rsize;
    this.sub_type = d.sub_type;
    this.parent_str_id = d.parent_str_id;
    this.create_time = d.create_time;
    this.selected = false;
    this.is_home = d.is_home;
    this.update(d);
  }

  update(d: {rname, cover, status, dlcount, visit_key, description, right_bubble, owner, secure_env}) {
    this.rname = d.rname;
    this.cover = d.cover;
    this.status = d.status;
    this.dlcount = d.dlcount;
    this.visit_key = d.visit_key;
    this.description = d.description;
    this.right_bubble = d.right_bubble;
    if (d.owner instanceof User) {
      this.owner = d.owner;
    } else {
      this.owner = new User(d.owner);
    }
    if (d.secure_env === true) {
      this.is_secure_env = true;
    } else {
      this.is_secure_env = false;
      this.insecure_parent = d.secure_env;
    }
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

  get chinese_status() {
    if (this.status === Resource.STATUS_PRIVATE) {
      return '私有';
    } else if (this.status === Resource.STATUS_PUBLIC) {
      return '公开';
    } else {
      return '加密';
    }
  }

  get readable_status() {
    return this.chinese_status + '资源';
  }

  get secure_word() {
    if (this.is_secure_env) {
      return '';
    } else {
      return ' 有风险';
    }
  }

  get secure_info() {
    return `由于目录“${this.insecure_parent}”设置了公开，此${this.readable_status}仍然公开。若不想公开此资源，可进入“修改”设置为独立资源，或修改父元素权限为加密或私有。`;
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

  get is_file() {
    return this.rtype === Resource.RTYPE_FILE;
  }

  get is_encrypt() {
    return this.rtype === Resource.RTYPE_ENCRYPT;
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
