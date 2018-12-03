import {User} from "../user/user";
import {ClockService} from "../../services/clock.service";
import {BaseService} from "../../services/base.service";

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
  public static COVER_RANDOM = 0;
  public static COVER_UPLOAD = 1;
  public static COVER_FATHER = 2;
  public static COVER_OUTLNK = 3;
  public static COLORS = [
    ['#C4E0E5', '#4CA1AF'],
    ['#EECDA3', '#EF629F'],
    ['#4B79A1', '#283E51'],
    ['#CCCCB2', '#757519'],
    ['#F1F2B5', '#135058'],
    ['#6441A5', '#2a0845'],
    ['#FFA17F', '#00223E'],

  ];

  res_str_id: string;
  rname: string;
  former_rname: string;
  rtype: number;
  rsize: number;
  sub_type: number;
  description: string;
  cover: string;
  cover_small: string;
  cover_type: number;
  cover_for_outlnk: string;
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
  load_cover: boolean;
  load_small_cover: boolean;
  loaded_class: boolean;
  is_random: boolean;

  constructor(baseService: BaseService, d: {
    res_str_id, // 资源唯一随机ID
    rname, // 资源名称
    rtype, // 资源类型（RTYPE_FILE, RTYPE_FOLDER, RTYPE_LINK）
    rsize, // 资源大小
    sub_type, // 资源子类型（STYPE_FOLDER, STYPE_IMAGE, STYPE_VIDEO, STYPE_MUSIC, STYPE_FILE, STYPE_LINK）
    description, // 资源介绍
    cover, // 资源封面
    cover_small,  // 封面缩略图
    cover_type, // 封面类型（COVER_UOLOAD, COVER_FATHER, COVER_OUTLNK）
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
    this.update(baseService, d);
  }

  update(baseService: BaseService,
         d: {rname, cover, cover_small, cover_type, status, dlcount, visit_key, description, right_bubble, owner, secure_env}) {
    this.rname = d.rname;
    this.former_rname = d.rname;
    this.cover = d.cover;
    this.cover_type = d.cover_type;
    this.cover_small = d.cover_small;
    this.cover_for_outlnk = d.cover_type === Resource.COVER_OUTLNK ? d.cover : null;
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
    if (d.secure_env === true || !d.secure_env) {
      this.is_secure_env = true;
    } else {
      this.is_secure_env = false;
      this.insecure_parent = d.secure_env;
    }

    this.load_small_cover = false;
    this.load_cover = false;
    this.loaded_class = false;
    if (!d.cover_small || d.cover_small === '' || d.cover_type === Resource.COVER_RANDOM) {
      this.is_random = true;
      if (baseService) {
        baseService.random_image().then((resp) => {
          this.cover_small = resp.thumb;
          this.cover = resp.regular;
          this.pre_load_cover();
        });
      }
    } else {
      this.is_random = false;
      this.pre_load_cover();
    }
  }

  pre_load_cover() {
    const small_cover_load = new Image();
    const cover_load = new Image();
    const this_ = this;

    small_cover_load.src = this.cover_small;
    small_cover_load.onload = function () {
      this_.load_small_cover = true;

      if (this_.cover) {
        cover_load.src = this_.cover;
        cover_load.onload = function () {
          this_.load_cover = true;
          setTimeout(() => {
            this_.loaded_class = true;
          }, 1000);
        };
      }
    };
  }

  get load_cover_class() {
    return this.loaded_class ? 'loaded' : '';
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

  get color() {
    const index = Math.floor(this.create_time) % Resource.COLORS.length;
    return `linear-gradient(to bottom left, ${Resource.COLORS[index][0]}, ${Resource.COLORS[index][1]})`;
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

  get is_emoji() {
    const c = this.rname.charCodeAt(0);
    if (0xd800 <= c && c <= 0xdbff) {
      if (this.rname.length > 1) {
        const ls = this.rname.charCodeAt(1);
        const uc = ((c - 0xd800) * 0x400) + (ls - 0xdc00) + 0x10000;
        if (0x1d000 <= uc && uc <= 0x1f77f) {
          return true;
        }
      }
    } else if (this.rname.length > 1) {
      const ls = this.rname.charCodeAt(1);
      if (ls === 0x20e3) {
        return true;
      }
    } else {
      if (0x2100 <= c && c <= 0x27ff) {
        return true;
      } else if (0x2B05 <= c && c <= 0x2b07) {
        return true;
      } else if (0x2934 <= c && c <= 0x2935) {
        return true;
      } else if (0x3297 <= c && c <= 0x3299) {
        return true;
      } else if (c === 0xa9 || c === 0xae || c === 0x303d || c === 0x3030
        || c === 0x2b55 || c === 0x2b1c || c === 0x2b1b
        || c === 0x2b50) {
        return true;
      }
    }
    return false;
  }

  get first_letter() {
    if (!this.is_random) {
      return '';
    } else if (this.is_emoji) {
      return this.rname[0] + this.rname[1];
    } else {
      return this.rname[0].toUpperCase();
    }
  }

  get url_cover() {
    if (!this.is_random) {
      return `url('${this.cover}')`;
    } else {
      return this.color;
    }
  }

  get url_cover_small() {
    if (!this.is_random) {
      return `url('${this.cover_small}')`;
    } else {
      return this.color;
    }
  }

  get url_cover_random() {
    if (this.load_cover) {
      return `url('${this.cover}')`;
    } else if (this.load_small_cover) {
      return `url('${this.cover_small}')`;
    } else {
      return this.color;
    }
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
      case Resource.STYPE_LINK:
        return 'icon-link';
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

  get is_link() {
    return this.rtype === Resource.RTYPE_LINK;
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

  get is_protected() {
    return this.status === Resource.STATUS_PROTECT;
  }

  get is_private() {
    return this.status === Resource.STATUS_PRIVATE;
  }
}
