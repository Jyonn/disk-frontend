import {HsbColor} from './hsb-color';
import {LinearDirection} from './linear-direction';

export class GradientColor {
  colors: Array<HsbColor>;
  direction: LinearDirection;

  constructor(colors: Array<HsbColor>, direction: LinearDirection) {
    this.colors = colors;
    this.direction = direction;
  }

  static lazy(hue) {
    return new GradientColor([HsbColor.light(hue), HsbColor.strong(hue)], new LinearDirection({bottomRight: true}));
  }

  get str() {
    return `linear-gradient(${this.direction.str}${this.colors.map(v => ', ' + v.str).join('')})`;
  }
}
