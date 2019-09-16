export class LinearDirection {
  top: boolean;
  bottom: boolean;
  left: boolean;
  right: boolean;
  deg: number;

  // tslint:disable-next-line:max-line-length
  constructor({top = null, bottom = null, right = null, left = null, topLeft = null, topRight = null, bottomLeft = null, bottomRight = null, deg = null}) {
    this.top = this.bottom = this.left = this.right = this.deg = null;

    if (deg) {
      this.deg = deg;
    }
    if (top || topLeft || topRight) {
      this.top = true;
      this.bottom = false;
    }
    if (bottom || bottomLeft || bottomRight) {
      this.bottom = true;
      this.top = false;
    }
    if (left || topLeft || bottomLeft) {
      this.left = true;
      this.right = false;
    }
    if (right || topRight || bottomRight) {
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
