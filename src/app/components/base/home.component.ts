import {Component, OnInit} from "@angular/core";
import {UserService} from "../../services/user.service";
import {Router} from "@angular/router";
import {Meta} from "@angular/platform-browser";

@Component({
  templateUrl: './home.component.html',
  styleUrls: [
    '../../../assets/css/mywebicon.css',
    '../../../assets/css/home.less',
  ]
})
export class HomeComponent implements OnInit {
  heroCommands = [
    'htx login',
    'htx ls @Ab12Cd',
    'htx upload ./archive /Backups',
  ];

  featureCards = [
    {
      label: '01',
      title: '直链优先',
      text: '分享出来的链接可以直接落到下载动作，不强迫收件人再走一遍多余页面。'
    },
    {
      label: '02',
      title: '目录像终端一样清晰',
      text: '目录树、文件信息和资源状态保持高密度展示，适合熟悉命令行的用户快速扫读。'
    },
    {
      label: '03',
      title: 'SSO 进入工作台',
      text: '登录链路保持轻，进入后直接回到你的根目录，不把注意力耗在流程噪声上。'
    },
  ];

  workflow = [
    '用 SSO 登录，进入你的根目录。',
    '上传文件、文件夹，或直接生成外链资源。',
    '把页面链接或直链发给协作者，下载链路一步到位。',
  ];

  constructor(
    public userService: UserService,
    public router: Router,
    private meta: Meta,
  ) {}
  ngOnInit() {
    this.meta.updateTag({name: 'description', content: `极客风格的网盘工作台，支持目录树浏览、SSO 登录与直链下载。`});
  }

  click_avatar() {
    this.router.navigate(['/res', this.userService.user.rootRes]);
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

  open_cli_docs() {
    this.router.navigate(["/cli"]);
  }

  get primaryActionText() {
    return this.userService.has_login ? '进入我的工作台' : '用 SSO 进入工作台';
  }
}
