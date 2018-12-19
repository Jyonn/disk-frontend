import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {ResourceTree} from "../../models/res/resource-tree";
import {ResourceTreeService} from "../../services/resource-tree.service";

@Component({
  selector: 'app-res-tree',
  templateUrl: './res-tree.component.html',
  styleUrls: [
    '../../../assets/css/res-tree.css',
    '../../../assets/css/icon-fonts.css',
  ]
})
export class ResTreeComponent implements OnInit {
  @Input() resTree: ResourceTree;
  @Input() filter: any;
  @Input() data: any;

  constructor(
    public resTreeService: ResourceTreeService,
  ) {}

  get active_refresh() {
    return (this.resTree && this.resTree.is_getting_children) ? 'active' : 'inactive';
  }

  click_rname() {
    ResourceTreeService.selectedResName = this.resTree.rname;
    ResourceTreeService.selectResStrId = this.resTree.res_str_id;
    if (!this.resTree.is_getting_children) {
      if (this.resTree.has_get_children && this.resTree.show_children) {
        this.resTree.show_children = false;
      } else {
        this.resTreeService.refresh_node(this.resTree);
      }
    }
  }

  get selected() {
    return (this.resTree && ResourceTreeService.selectResStrId === this.resTree.res_str_id) ? 'selected' : 'unselected';
  }

  sort_by_name(ra: ResourceTree, rb: ResourceTree) {
    return ra.rname.localeCompare(rb.rname, 'zh');
  }

  ngOnInit(): void {}
}
