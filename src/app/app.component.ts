import {Component, OnInit} from '@angular/core';
import {UserService} from "./services/user.service";
import {BaseService} from "./services/base.service";

@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>',
})
export class AppComponent implements OnInit {
  constructor(
    public userService: UserService,
    public baseService: BaseService,
  ) {}
  ngOnInit() {
    // BaseService.token_center.asObservable()
    //   .subscribe(() => {
    this.userService.api_get_info()
      .then();
      // });
  }
}
