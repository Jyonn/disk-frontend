import {Component, OnInit} from "@angular/core";
import {UserService} from "../../services/user.service";
import {User} from "../../models/user/user";
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

  jump_user_home(user) {
    if (user) {
        const link = ['/res', user.root_res];
        this.router.navigate(link);
    }
  }

  ngOnInit() {
    if (this.userService.user) {
      this.jump_user_home(this.userService.user);
    }
    this.userService.user_update_center.asObservable()
      .subscribe((user: User) => {
        if (user) {
          this.jump_user_home(user);
        }
      });
  }
}
