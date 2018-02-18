export class Info {
  public static TYPE_WARN = 'warn';
  public static TYPE_SUCC = 'success';
  text: string;
  type: string;

  constructor(d: {text, type}) {
    this.text = d.text;
    this.type = d.type;
  }
}
