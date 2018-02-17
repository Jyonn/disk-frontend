import {Component, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {UserService} from "../../services/user.service";
import {BaseService} from "../../services/base.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: [
    '../../../assets/css/icon-fonts.css',
    '../../../assets/css/login.less',
  ]
})
export class LoginComponent implements OnInit {
  public current_mode: string;
  next_url: string;
  username: string;
  password: string;
  constructor(
    public baseService: BaseService,
    public userService: UserService,
    public activateRoute: ActivatedRoute,
    private router: Router,
  ) {}

  navigate() {
    this.router.navigate([this.next_url ? this.next_url : '/res']);
  }

  ngOnInit() {
    this.activateRoute.params.subscribe((params) => {
      this.current_mode = params['mode'] === 'login' ? 'login' : 'register';
      this.next_url = params['next'];
    });
    if (this.userService.user) {
      this.navigate();
    }
  }

  is_active(mode) {
    return (this.current_mode === mode) ? 'active' : 'inactive';
  }

  user_login() {
    this.userService.get_token({username: this.username, password: this.password})
      .then(() => {
        this.navigate();
      });
  }
}
