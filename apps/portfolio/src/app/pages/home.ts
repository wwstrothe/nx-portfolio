import { Component } from '@angular/core';

@Component({
  selector: 'portfolio-home',
  imports: [],
  template: ` <h1>{{ title }}</h1> `,
})
export default class Home {
  title = 'William Strothe Portfolio';
}
