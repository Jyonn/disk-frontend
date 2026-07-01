import { Component } from "@angular/core";
import { BaseService } from "../../services/base.service";

@Component({
  selector: 'app-jumping',
  templateUrl: './jumping.component.html',
  styleUrls: [
    './jumping.component.css'
  ],
})
export class JumpingComponent {
  constructor(public baseService: BaseService) {}
}
