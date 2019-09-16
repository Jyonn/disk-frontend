export class LinearDirection {
  top: boolean;
  bottom: boolean;
  left: boolean;
  right: boolean;
  deg: number;

  // tslint:disable-next-line:max-line-length
  constructor(_: {top?, bottom?, right?, left?, topLeft?, topRight?, bottomLeft?, bottomRight?, deg?}) {
    this.top = this.bottom = this.left = this.right = this.deg = null;

    if (_.deg) {
      this.deg = _.deg;
    }
    if (_.top || _.topLeft || _.topRight) {
      this.top = true;
      this.bottom = false;
    }
    if (_.bottom || _.bottomLeft || _.bottomRight) {
      this.bottom = true;
      this.top = false;
    }
    if (_.left || _.topLeft || _.bottomLeft) {
      this.left = true;
      this.right = false;
    }
    if (_.right || _.topRight || _.bottomRight) {
      this.right = true;
      this.left = false;
    }
  }

  get str() {
    if (this.deg) {
      return `${this.deg}deg`;
    }

    let s = 'to';
    if (this.top) {
      s += ' top';
    } else if (this.bottom) {
      s += ' bottom';
    }
    if (this.left) {
      s += ' left';
    } else if (this.right) {
      s += ' right';
    }
    if (s === 'to') {
      s += 'bottom right';
    }
    return s;
  }
}
