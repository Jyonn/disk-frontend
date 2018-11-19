import {Component, OnInit} from "@angular/core";
import {BaseService} from "../../services/base.service";

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: [
    '../../../assets/css/icon-fonts.css',
    '../../../assets/css/info.less',
  ],
})
export class InfoComponent implements OnInit {
  public info_text: string;
  public info_class: string;
  private interval;
  constructor(public baseService: BaseService) {
    this.info_text = null;
    this.info_class = null;
  }
  ngOnInit() {
    BaseService.info_center.asObservable()
      .subscribe(info => {
        this.info_text = info.text;
        this.info_class = info.type;
        clearTimeout(this.interval);
        const t = this.info_text.length * 250;
        this.interval = setTimeout(() => {this.info_text = null; }, t);
        // console.log(this.info_text);
      });
  }

  clear_info() {
    this.info_text = null;
    clearTimeout(this.interval);
  }
}
