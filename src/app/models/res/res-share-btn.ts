import {Resource} from "./resource";

export class RadioBtn {
  text: string;
  value: number;
  constructor(d: {text, value}) {
    this.text = d.text;
    this.value = d.value;
  }
}
