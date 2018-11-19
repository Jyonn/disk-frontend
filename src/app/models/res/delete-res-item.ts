export class DeleteResItem {
  readablePath: string;
  path: Array<string>;

  constructor(d: {path, readablePath}) {
    this.path = d.path;
    this.readablePath = d.readablePath;
  }
}
