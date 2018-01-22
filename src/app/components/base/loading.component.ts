import { Component } from "@angular/core";
import { BaseService } from "../../services/base.service";

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: [
    '../../../assets/css/loading.css',
    './loading.component.css'
  ],
})
export class LoadingComponent {
  constructor(public baseService: BaseService) {}
}
