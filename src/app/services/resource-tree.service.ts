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
    if (node.is_getting_children) {
      return;
    }
    node.is_getting_children = true;
    node.has_get_children = false;
    this.get_res_info_for_selector(node.res_str_id)
      .then((resp) => {
        node.rname = resp.info.rname;
        node.feed_child_list(resp.child_list);
        node.is_getting_children = false;
        node.has_get_children = true;
        node.show_children = true;
      });
  }
}
