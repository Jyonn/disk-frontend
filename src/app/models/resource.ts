import {User} from "./user";
import {ClockService} from "../services/clock.service";

export class Resource {
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
  rname: string;
  rtype: number;
  sub_type: number;
  description: string;
  cover: string;
  owner: User;
  parent_id: number;
  status: number;
  create_time: number;
  children: Resource[] = [];
  dlcount: number;

  constructor(d: {rname, rtype, sub_type, description, cover, owner, parent_id, status, create_time, children, dlcount}) {
    this.rname = d.rname;
    this.rtype = d.rtype;
    this.sub_type = d.sub_type;
    this.description = d.description;
    this.cover = d.cover;
    this.owner = d.owner;
    this.parent_id = d.parent_id;
    this.status = d.status;
    this.create_time = d.create_time;
    this.children = d.children;
    this.dlcount = d.dlcount;
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
    return `url('${this.cover}')`;
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
}
