import {Component} from "@angular/core";
import {BaseService} from "../../services/base.service";

@Component({
  selector: 'app-loading',
  templateUrl: './res-loading.component.html',
  styleUrls: [
    '../../../assets/css/loading.css',
    './res-loading.component.css'
  ],
})
export class ResLoadingComponent {
  constructor(public baseService: BaseService) {}
}
