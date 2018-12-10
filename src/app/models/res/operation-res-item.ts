export class OperationResItem {
  readable_path: string;
  res_id: string;

  constructor(d: {res_str_id, readable_path}) {
    this.res_id = d.res_str_id;
    this.readable_path = d.readable_path;
  }
}
