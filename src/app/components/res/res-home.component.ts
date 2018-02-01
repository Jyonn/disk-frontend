import {Component, OnInit} from "@angular/core";
import {UserService} from "../../services/user.service";
import {User} from "../../models/user";
import {ResourceService} from "../../services/resource.service";
import {Router} from "@angular/router";

@Component({
  template: '',
})
export class ResHomeComponent implements OnInit {
  constructor(
    private userService: UserService,
    private resService: ResourceService,
    private router: Router,
  ) {}
  ngOnInit() {
    this.userService.api_get_info()
      .then((user: User) => {
        if (user) {
          this.resService.get_root_res()
            .then((resp) => {
              const link = ['/res', resp.info.res_str_id];
              this.router.navigate(link);
            });
        }
      });
  }
}
