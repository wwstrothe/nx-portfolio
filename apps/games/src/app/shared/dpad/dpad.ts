import { Component, output } from '@angular/core';

type DpadDirection = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

@Component({
  selector: 'games-dpad',
  template: `
    <div class="dpad">
      <button
        class="dpad__btn dpad__up"
        aria-label="Up"
        (click)="press('UP')"
        (touchstart)="onTouch($event, 'UP')">▲</button>
      <button
        class="dpad__btn dpad__left"
        aria-label="Left"
        (click)="press('LEFT')"
        (touchstart)="onTouch($event, 'LEFT')">◀</button>
      <div class="dpad__center"></div>
      <button
        class="dpad__btn dpad__right"
        aria-label="Right"
        (click)="press('RIGHT')"
        (touchstart)="onTouch($event, 'RIGHT')">▶</button>
      <button
        class="dpad__btn dpad__down"
        aria-label="Down"
        (click)="press('DOWN')"
        (touchstart)="onTouch($event, 'DOWN')">▼</button>
    </div>
  `,
  styleUrl: './dpad.scss',
})
export class DpadComponent {
  readonly dirPress = output<DpadDirection>();

  protected press(dir: DpadDirection): void {
    this.dirPress.emit(dir);
  }

  protected onTouch(event: TouchEvent, dir: DpadDirection): void {
    event.preventDefault(); // prevent subsequent click + page scroll
    this.dirPress.emit(dir);
  }
}
