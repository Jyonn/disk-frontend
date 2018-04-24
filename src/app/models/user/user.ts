export class User {
  user_id: number;
  nickname: string;
  avatar: string;
  root_res: string;

  constructor(d: {user_id, nickname, avatar, root_res} = null) {
    if (d) {
      this.update(d);
    }
  }

  update(d: {user_id, nickname, avatar, root_res}) {
    this.user_id = d.user_id;
    this.nickname = d.nickname;
    this.avatar = d.avatar;
    this.root_res = d.root_res;
  }

  get url_avatar() {
    if (this.avatar) {
      return `url('${this.avatar}')`;
    } else {
      return `url('https://unsplash.6-79.cn/random/small')`;
    }
  }
}
