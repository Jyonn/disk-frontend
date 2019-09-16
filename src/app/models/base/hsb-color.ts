export class HsbColor {
  alpha: number;
  rgb: Array<number>;

  constructor(hue: number, saturation: number, brightness: number, alpha: number = 1) {
    this.alpha = alpha;
    if (brightness === 0) {
      this.rgb = [0, 0, 0, Math.round(alpha * 255)];
      return;
    }

    saturation /= 100;
    brightness /= 100;
    if (hue > 359) {
      hue = 0;
    }
    // tslint:disable-next-line:no-bitwise
    const hueTemp = ~~(hue / 60);
    hue /= 60;
    const fTemp = hue - hueTemp;
    const pTemp = brightness * (1 - saturation);
    const qTemp = brightness * (1 - saturation * fTemp);
    const tTemp = brightness * (1 - saturation * (1 - fTemp));
    switch (hueTemp) {
      case 0:
        this.rgb = [brightness, tTemp, pTemp];
        break;
      case 1:
        this.rgb = [qTemp, brightness, pTemp];
        break;
      case 2:
        this.rgb = [pTemp, brightness, tTemp];
        break;
      case 3:
        this.rgb = [pTemp, qTemp, brightness];
        break;
      case 4:
        this.rgb = [tTemp, pTemp, brightness];
        break;
      case 5:
        this.rgb = [brightness, pTemp, qTemp];
        break;
    }
    this.rgb[3] = alpha;
    this.rgb = this.rgb.map(v => Math.round(255 * v));
  }

  get str() {
    return `#${this.rgb.map(HsbColor.componentToHex).join('')}`;
  }

  static light(hue: number) {
    return new HsbColor(hue, 44, 97);
  }

  static strong(hue: number) {
    return new HsbColor(hue, 67, 66);
  }


  static componentToHex(c: number) {
    c = Math.round(c);
    const hex = c.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }
}
