import {Component, OnInit} from '@angular/core';
import {UserService} from "./services/user.service";
import {User} from "./models/user";
import {BaseService} from "./services/base.service";
import {Resource} from "./models/resource";
import {ClockService} from "./services/clock.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['../assets/css/icon-fonts.css', '../assets/css/nav.less', '../assets/css/footer.less', '../assets/css/res.less']
})
export class AppComponent implements OnInit {
  // title = 'app';
  user: User;
  resource: Resource;

  constructor(
    private userService: UserService,
    private baseService: BaseService,
    private clockService: ClockService,
  ) {}
  ngOnInit(): void {
    this.userService.api_get_info()
      .then(() => {
        this.user = this.baseService.user;
      });
    this.clockService.startClock();
    this.resource = new Resource({
      rname: '林俊杰 - 伟大的渺小',
      rtype: Resource.RTYPE_FOLDER,
      sub_type: Resource.STYPE_FOLDER,
      description: '“小小的举动，会带来远大的效应”是林俊杰藏在心中多年的一个概念，但也因着还不能完整地呈现而一直搁置。过去的这些日子' +
      '，林俊杰在体会了来自他身旁人生的体悟与深刻情感后，思想在他的内心渐渐地产生了变化，他深刻地以珍贵的情感与瞬间融入到创作的生命力，' +
      '也以“真实”为驱动写下了这首歌曲，记录着他内心赤裸的撼动，也献给每一个身边重视的人们。[4] \n\n该曲也与新加坡作词人小寒首度合作。' +
      '当小寒问起歌词方向的时候，林俊杰团队答道“自由发挥”。她想起在网上看到一个视频“Look Beyond Borders - 4 minutes experiment”' +
      '，那是一个提高对难民关注的视频，安排多个难民和一般人两两配对，让他们对望四分钟，看他们有何反应。视频的基础是心理学家Arthur ' +
      'Aron的理论：两个人对望四分钟，能拉近彼此的距离。小寒认为，无论哪个国家的人民，对外来移民总有误解和负面情绪，这是因为对难民的不' +
      '谅解，于是朝“打破隔阂”的方向创作。同时她也认为每一个渺小的人都是伟大的，没有他们，就像一台机器少了一个螺丝，无法操作，因此为该' +
      '曲取名《伟大的渺小》，随后该词一次过关，未作任何修改。',
      cover: '../assets/img/joshua-newton-275881.jpg',
      owner: {
        token: null,
        user_id: 1,
        username: 'lqj',
        nickname: '工刀',
        avatar: '../assets/img/andrew-ridley-76547.jpg',
      },
      parent_id: 23,
      status: Resource.STATUS_PRIVATE,
      create_time: 1515609660,
      children: [
        new Resource({
          rname: '林俊杰 - 全都怪我不该沉默时沉默\n我就是想分两行看看怎么样.mp3',
          rtype: Resource.RTYPE_FILE,
          sub_type: Resource.STYPE_MUSIC,
          description: null,
          cover: '../assets/img/francisco-gomes-182329.jpg',
          owner: null,
          parent_id: null,
          status: Resource.STATUS_PUBLIC,
          create_time: 1515631336,
          children: null,
          dlcount: 12,
        }),
        new Resource({
          rname: '林俊杰 - 伟大的渺小.mp4',
          rtype: Resource.RTYPE_FILE,
          sub_type: Resource.STYPE_VIDEO,
          description: null,
          cover: '../assets/img/maxime-valcarce-269439.jpg',
          owner: null,
          parent_id: null,
          status: Resource.STATUS_PUBLIC,
          create_time: 1515631336,
          children: null,
          dlcount: 123,
        }),
        new Resource({
          rname: '你猜我是什么.txt',
          rtype: Resource.RTYPE_FILE,
          sub_type: Resource.STYPE_FILE,
          description: null,
          cover: '../assets/img/joshua-newton-275881.jpg',
          owner: null,
          parent_id: null,
          status: Resource.STATUS_PUBLIC,
          create_time: 1515631336,
          children: null,
          dlcount: 13,
        }),
        new Resource({
          rname: '林俊杰 - 高清写真.jpg',
          rtype: Resource.RTYPE_FILE,
          sub_type: Resource.STYPE_IMAGE,
          description: null,
          cover: '../assets/img/osman-rana-263709.jpg',
          owner: null,
          parent_id: null,
          status: Resource.STATUS_PUBLIC,
          create_time: 1515631336,
          children: null,
          dlcount: 33,
        }),
        new Resource({
          rname: '林俊杰 - 西界',
          rtype: Resource.RTYPE_FOLDER,
          sub_type: Resource.STYPE_FOLDER,
          description: null,
          cover: '../assets/img/seth-doyle-43132.jpg',
          owner: null,
          parent_id: null,
          status: Resource.STATUS_PUBLIC,
          create_time: 1515631336,
          children: null,
          dlcount: 0,
        }),
      ],
      dlcount: 0,
    });
  }
  get has_login() {
    return this.user && this.user.token;
  }
}
