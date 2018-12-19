export class OperationResItem {
  readable_path: string;
  res_id: string;
  data: any;

  constructor(d: {res_str_id, readable_path}, data = null) {
    this.res_id = d.res_str_id;
    this.readable_path = d.readable_path;
    this.data = data;
  }
}
