import {Component, Input, OnInit} from "@angular/core";
import {FootBtnService} from "../../services/foot-btn.service";
import {Resource} from "../../models/resource";
import {ResourceService} from "../../services/resource.service";
import {ResShareBtn} from "../../models/res-share-btn";
import {BaseService} from "../../services/base.service";

@Component({
  selector: 'app-res-op',
  templateUrl: './res-op.component.html',
  styleUrls: [
    '../../../assets/css/icon-fonts.css',
    '../../../assets/css/operation.less',
  ]
})
export class ResOpComponent implements OnInit {
  @Input() resource: Resource;
  @Input() path: Array<any>;
  constructor(
    public footBtnService: FootBtnService,
    public resService: ResourceService,
    public baseService: BaseService,
  ) {}

  share_private: ResShareBtn;
  share_protect: ResShareBtn;
  share_public: ResShareBtn;
  share_btns: Array<ResShareBtn>;

  initShare() {
    this.share_private = new ResShareBtn({
      text: '私有资源',
      status: Resource.STATUS_PRIVATE,
    });
    this.share_protect = new ResShareBtn({
      text: '加密分享',
      status: Resource.STATUS_PROTECT,
    });
    this.share_public = new ResShareBtn({
      text: '公开分享',
      status: Resource.STATUS_PUBLIC,
    });
    this.share_btns = [this.share_private, this.share_protect, this.share_public];
  }

  is_active(btn: ResShareBtn) {
    return this.resource && this.resource.status === btn.status;
  }

  share_status_change(btn: ResShareBtn) {
    this.resService.modify_res_info(this.path, {status: btn.status, description: null, visit_key: null, rname: null})
      .then((resp) => {
        this.resource.status = resp.status;
        this.resource.visit_key = resp.visit_key;
      });
  }

  get share_show_text() {
    const url = `${this.baseService.front_host}/res/${BaseService.path_to_slug(this.path)}`;
    if (!this.resource) {
      return;
    }
    if (this.resource.status === Resource.STATUS_PRIVATE) {
      return url;
    } else if (this.resource.status === Resource.STATUS_PROTECT) {
      return `我分享了加密资源“${this.resource.rname}”：${url}，密码：${this.resource.visit_key}，快点进来看看吧！`;
    } else {
      return `我分享了“${this.resource.rname}”：${url}，快点进来看看吧！`;
    }
  }

  ngOnInit() {
    this.initShare();
  }
}
