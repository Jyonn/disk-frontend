import {Component, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {UserService} from "../../services/user.service";
import {BaseService} from "../../services/base.service";
import {User} from "../../models/user/user";

@Component({
  template: '',
})
export class OauthComponent implements OnInit {
  code: string;

  constructor(
    public activateRoute: ActivatedRoute,
    public userService: UserService,
    public baseService: BaseService,
    public router: Router,
  ) {
    this.code = null;
  }

  ngOnInit() {
    this.activateRoute.queryParams.subscribe((params) => {
      this.code = params['code'];

      this.userService
        .api_qtb_oauth_check({code: this.code})
        .then((resp) => {
          BaseService.saveToken(resp.token);
          this.userService.api_get_info()
            .then((user: User) => {
              this.router.navigate(['/res', user.root_res]);
            });
        });
    });
  }
}
