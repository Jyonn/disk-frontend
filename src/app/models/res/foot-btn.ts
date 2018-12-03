export class FootBtn {
  icon: string;
  text: string;
  file: boolean;
  folder: boolean;
  hide: boolean;
  mask: boolean;

  constructor(d: {icon, text, file, folder, mask}) {
    this.icon = d.icon;
    this.text = d.text;
    this.file = d.file;
    this.folder = d.folder;
    this.mask = d.mask;
  }
}
