export class DeleteResItem {
  readablePath: string;
  path: string;

  constructor(d: {path, readablePath}) {
    this.path = d.path;
    this.readablePath = d.readablePath;
  }
}
