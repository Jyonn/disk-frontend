import {Component, OnInit} from "@angular/core";
import {UserService} from "../../services/user.service";
import {User} from "../../models/user/user";
import {ResourceService} from "../../services/resource.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  template: '',
})
export class ResHomeComponent implements OnInit {
  next_url: string;

  constructor(
    private userService: UserService,
    private resService: ResourceService,
    private router: Router,
    public activateRoute: ActivatedRoute,
  ) {}

  jump_user_home(user) {
    if (user) {
      if (this.next_url) {
        this.router.navigate([decodeURIComponent(this.next_url)]);
      } else {
        this.router.navigate(['/res', this.userService.user.root_res]);
      }
    }
  }

  ngOnInit() {
    this.activateRoute.params.subscribe((params) => {
      this.next_url = params['next'];
    });
    if (this.userService.user) {
      this.jump_user_home(this.userService.user);
    } else if (this.userService.has_get_user) {
      window.location.href = this.userService.oauth_uri + '&state=' + encodeURI(this.router.url);
    }
    this.userService.user_update_center.asObservable()
      .subscribe((user: User) => {
        if (user) {
          this.jump_user_home(user);
        } else {
          window.location.href = this.userService.oauth_uri + '&state=' + encodeURI(this.router.url);
        }
      });
  }
}
