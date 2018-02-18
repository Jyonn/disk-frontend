export class User {
  user_id: number;
  username: string;
  nickname: string;
  avatar: string;

  constructor(d: {user_id, username, nickname, avatar} = null) {
    if (d) {
      this.update(d);
    }
  }

  update(d: {user_id, username, nickname, avatar}) {
    this.user_id = d.user_id;
    this.username = d.username;
    this.nickname = d.nickname;
    this.avatar = d.avatar;
  }

  get url_avatar() {
    if (this.avatar) {
      return `url('${this.avatar}')`;
    } else {
      return `url('https://unsplash.6-79.cn/random/small')`;
    }
  }
}
