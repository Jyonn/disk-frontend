import {Injectable} from "@angular/core"
import {LoadCallback} from "../models/base/load-callback";
import {BaseService} from "./base.service";

declare let videojs: any;

@Injectable()
export class VideoService {
  jsLC: LoadCallback;
  ele: HTMLElement;

  constructor(
    private baseService: BaseService,
  ) {
    this.jsLC = new LoadCallback();
    this.loadJS();
  }

  loadJS() {
    const script = document.createElement('script');
    script.type = "text/javascript";
    script.src = "https://vjs.zencdn.net/7.6.0/video.js";
    document.getElementsByTagName('head')[0].appendChild(script);
    script.onload = () => {
      this.jsLC.load();
    };
  }

  getPlayer(id) {
    this.ele = document.getElementById(id);
    return videojs(this.ele);
  }
}
