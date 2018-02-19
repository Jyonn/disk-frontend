import {Component, OnInit} from "@angular/core";
import {Router} from "@angular/router";
import {BaseService} from "../../services/base.service";

@Component({
  template: ''
})
export class RedirectComponent implements OnInit {
  constructor(
    public baseService: BaseService,
    public router: Router,
  ) {}

  ngOnInit() {
    window.location.href = `${this.baseService.host}${this.router.url}`;
  }
}
