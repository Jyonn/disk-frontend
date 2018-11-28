import {Component, OnInit} from '@angular/core';
import {UserService} from "./services/user.service";
import {BaseService} from "./services/base.service";
import {Router} from "@angular/router";
import {Info} from "./models/base/info";

@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>',
})
export class AppComponent implements OnInit {
  constructor(
    public userService: UserService,
    public baseService: BaseService,
    private router: Router,
  ) {}
  ngOnInit() {
    // BaseService.token_center.asObservable()
    //   .subscribe(() => {
    this.userService.api_get_info()
      .then()
      .catch((resp) => {
        if (resp === BaseService.relogin_warn) {
          setTimeout(() => {
            window.location.href = this.userService.oauth_uri + '&state=' + encodeURI(this.router.url);
          }, 3000);
        }
      });
  }
}
