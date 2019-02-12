import {Component, OnInit} from "@angular/core";
import {UserService} from "../../services/user.service";
import {Router} from "@angular/router";
import {Meta} from "@angular/platform-browser";

@Component({
  templateUrl: './home.component.html',
  styleUrls: [
    '../../../assets/css/icon-fonts.css',
    '../../../assets/css/home.less',
    '../../../assets/css/devices.min.css',
  ]
})
export class HomeComponent implements OnInit {
  constructor(
    public userService: UserService,
    public router: Router,
    private meta: Meta,
  ) {}
  ngOnInit() {
    this.meta.updateTag({name: 'description', content: `分享资源，连接世界`});
  }

  click_avatar() {
    this.router.navigate(['/res', this.userService.user.root_res]);
  }

  go_login() {
    window.location.href = this.userService.oauth_uri + '&state=' + encodeURI(this.router.url);
  }

  open_htx() {
    if (this.userService.has_login) {
      this.click_avatar();
    } else {
      this.go_login();
    }
  }
}
