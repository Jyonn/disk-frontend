export class FootBtn {
  icon: string;
  text: string;
  file: boolean;
  folder: boolean;
  hide: boolean;
  mask: boolean;
  root: boolean;  // true：根目录也显示，false：根目录不显示
  login: boolean;  // true：只有登陆时才显示，false：显示与否与此无关
  no_login: boolean;  // true：只有未登陆时才显示，false：显示与否与此无关

  constructor(d: {icon, text, file, folder, mask, root, login, no_login}) {
    this.icon = d.icon;
    this.text = d.text;
    this.file = d.file;
    this.folder = d.folder;
    this.mask = d.mask;
    this.root = d.root;
    this.login = d.login;
    this.no_login = d.no_login;
  }
}
