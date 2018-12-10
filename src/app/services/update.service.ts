import {Injectable} from "@angular/core";
import {UpdateLog} from "../models/base/update-log";

@Injectable()
export class UpdateService {
  current_index: number;
  constructor() {
    this.current_index = 0;
  }

  get length() {
    return UpdateLog.logs.length;
  }

  get crt_logs() {
    return UpdateLog.logs[this.current_index].updates;
  }

  get version() {
    return UpdateLog.logs[this.current_index].time + ' v' + UpdateLog.logs[this.current_index].version;
  }

  go_next() {
    this.current_index = (this.current_index + 1) % UpdateLog.logs.length;
  }

  go_last() {
    this.current_index = (this.current_index + UpdateLog.logs.length - 1) % UpdateLog.logs.length;
  }

  get readable_index() {
    return this.current_index + 1;
  }
}
