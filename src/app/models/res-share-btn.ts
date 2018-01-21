import {Resource} from "./resource";

export class ResShareBtn {
  text: string;
  status: number;
  constructor(d: {text, status}) {
    this.text = d.text;
    this.status = d.status;
  }
}
