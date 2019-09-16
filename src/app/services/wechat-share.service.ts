import {Injectable} from "@angular/core";
import {BaseService} from "./base.service";
import {Router} from "@angular/router";
import {PlatformLocation} from "@angular/common";
import {LoadCallback} from "../models/base/load-callback";

declare let wx: any;

@Injectable()
export class WechatShareService {
  title: string;
  desc: string;
  link: string;
  imgUrl: string;

  jsLC: LoadCallback;

  constructor(
    private baseService: BaseService,
    private router: Router,
    private location: PlatformLocation,
  ) {
    this.jsLC = new LoadCallback();
    // this.loadJS();
  }

  loadJS() {
    const script = document.createElement('script');
    script.type = "text/javascript";
    script.src = "https://res.wx.qq.com/open/js/jweixin-1.4.0.js";
    document.getElementsByTagName('head')[0].appendChild(script);
    script.onload = () => {
      this.jsLC.load();
    };
  }

  sharePrepare() {
    this.link = this.location['location'].href;
    this.link = this.link.split('#')[0];
    this.baseService
      .post('https://sso.6-79.cn/api/wechat/config', {url: this.link})
      .then((resp) => {
        const appid = resp.appid;
        const signature = resp.signature;
        const noncestr = resp.noncestr;
        const timestamp = resp.timestamp;

        wx.config({
          debug: false,
          appId: appid,
          timestamp: timestamp,
          nonceStr: noncestr,
          signature: signature,
          jsApiList: [
            'updateAppMessageShareData',
            'updateTimelineShareData',
          ]
        });

        wx.ready(() => {
          const shareData = {
            title: this.title,
            desc: this.desc,
            link: this.link,
            imgUrl: this.imgUrl,
            success: () => {
              console.log('success set');
            }
          };
          wx.updateAppMessageShareData(shareData);
          wx.updateTimelineShareData(shareData);
        });
      });
  }
}
