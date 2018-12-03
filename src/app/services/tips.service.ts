import {Injectable} from "@angular/core";

@Injectable()
export class TipsService {
  tips: Array<string>;
  current_index: number;

  constructor() {
    this.tips = [
      '多选操作可以配合搜索功能和排序功能批量操作具有相似属性的资源。',
      '在封面图上进行右滑操作可以返回到父目录。',
      '资源介绍支持Markdown格式编辑，可以添加对资源文件的说明。',
      '上传图片等资源后设置公开，获得直链，可以复制到朋友圈评论，朋友点击链接即可看到查看。',
      '修改封面图片与父目录相同，子资源可以免去再次上传图片的工作。',
      '有些浏览器点击下载按钮后会直接打开资源，可以使用“右键另存为”的方法保存资源。',
      '加密资源需要用户输入密钥才能访问，可以用这个方式提供有偿服务，并把联系方式作为封面。',
      '资源默认以名称升序排序，点击排序按钮可切换排序方式与升序降序方式。',
      '灵活使用资源模式（独立资源和附属资源）可以让你的资源分享方式如迷宫一样有趣。',
      '如果你需要更多的功能，可以联系我（QQ：842176277），请注明浑天匣用户。',
    ];
    this.current_index = 0;
  }

  get crt_tip() {
    return this.tips[this.current_index];
  }

  go_next() {
    this.current_index = (this.current_index + 1) % this.tips.length;
  }

  go_last() {
    this.current_index = (this.current_index + this.tips.length - 1) % this.tips.length;
  }
}
