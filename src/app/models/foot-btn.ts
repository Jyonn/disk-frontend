export class FootBtn {
  icon: string;
  text: string;
  file: boolean;
  folder: boolean;

  constructor(d: {icon, text, file, folder}) {
    this.icon = d.icon;
    this.text = d.text;
    this.file = d.file;
    this.folder = d.folder;
  }
}
