export class OperationResItem {
  readablePath: string;
  resId: string;
  data: any;

  constructor(d: {res_str_id, readablePath}, data = null) {
    this.resId = d.res_str_id;
    this.readablePath = d.readablePath;
    this.data = data;
  }
}
