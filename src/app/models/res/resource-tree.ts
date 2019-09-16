import {Resource} from "./resource";

export class ResourceTree {
  rname: string;
  rtype: number;
  sub_type: number;
  res_str_id: string;
  parent_str_id: number;

  childList: ResourceTree[];
  isGettingChildren: boolean;
  hasGetChildren: boolean;
  showChildren: boolean;

  constructor(d: {rname, rtype, sub_type, res_str_id, parent_str_id}) {
    this.res_str_id = d.res_str_id;
    this.rname = d.rname;
    this.rtype = d.rtype;
    this.sub_type = d.sub_type;
    this.parent_str_id = d.parent_str_id;
    this.isGettingChildren = false;
    this.hasGetChildren = false;
    this.showChildren = false;
  }

  feed_child_list(child_list: Array<any>, res_filter = null) {
    this.childList = [];
    for (const child of child_list) {
      if (!res_filter || res_filter(child)) {
        this.childList.push(new ResourceTree({
          rname: child.rname,
          rtype: child.rtype,
          sub_type: child.sub_type,
          res_str_id: child.res_str_id,
          parent_str_id: this.res_str_id,
        }));
      }
    }
  }

  get icon() {
    switch (this.sub_type) {
      case Resource.STYPE_FOLDER:
        return this.showChildren ? 'icon-right expend' : 'icon-right';
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
}
