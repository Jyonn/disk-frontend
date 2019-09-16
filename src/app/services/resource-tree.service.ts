import {Injectable} from "@angular/core";
import {BaseService} from "./base.service";
import {ResourceTree} from "../models/res/resource-tree";
import {Resource} from "../models/res/resource";

@Injectable()
export class ResourceTreeService {
  static selectedResName: string = null;
  static selectResStrId: string = null;

  root: ResourceTree = null;

  constructor(private baseService: BaseService) {}

  public get_res_info_for_selector(res_str_id: string) {
    return this.baseService
      .get(`/api/res/${res_str_id}/selector`);
  }

  public get_res_path(res_str_id: string) {
    return this.baseService
      .get(`/api/res/${res_str_id}/path`);
  }

  public async show_res_path(res_str_id: string, set_res: boolean) {
    let res_path = await this.get_res_path(res_str_id);
    let crt_res = this.root;
    res_path.pop();
    res_path = res_path.reverse();
    for (const res_item of res_path) {
      const resp = await this.get_res_info_for_selector(crt_res.res_str_id);
      crt_res.rname = resp.info.rname;
      crt_res.feed_child_list(resp.child_list);
      crt_res.isGettingChildren = false;
      crt_res.hasGetChildren = true;
      crt_res.showChildren = true;
      let find = false;
      for (const child of crt_res.childList) {
        if (child.res_str_id === res_item) {
          find = true;
          crt_res = child;
        }
      }
      if (!find) {
        return;
      }
    }
    if (set_res) {
      ResourceTreeService.selectedResName = crt_res.rname;
      ResourceTreeService.selectResStrId = crt_res.res_str_id;
    }
  }

  public init_root(res_str_id: string) {
    this.root = new ResourceTree({
      rname: '',
      rtype: Resource.RTYPE_FOLDER,
      sub_type: Resource.STYPE_FOLDER,
      res_str_id: res_str_id,
      parent_str_id: 'root',
    });
    this.refresh_node(this.root);
  }

  public refresh_node(node: ResourceTree) {
    if (node.isGettingChildren) {
      return;
    }
    node.isGettingChildren = true;
    node.hasGetChildren = false;
    this.get_res_info_for_selector(node.res_str_id)
      .then((resp) => {
        node.rname = resp.info.rname;
        node.feed_child_list(resp.child_list);
        node.isGettingChildren = false;
        node.hasGetChildren = true;
        node.showChildren = true;
      });
  }
}
