import {Component, OnInit} from "@angular/core";
import {UserService} from "../../services/user.service";
import {Router} from "@angular/router";

@Component({
  template: '',
})
export class RefreshComponent implements OnInit {
  constructor(
    public userService: UserService,
    public router: Router,
  ) {}

  ngOnInit() {
    this.userService.api_get_info()
      .then(() => {
        this.router.navigate(['/res', this.userService.user.root_res])
      })
      .catch(() => {
        window.location.href = this.userService.oauth_uri;
      });
  }
}
