import {
  afterNextRender,
  afterRender,
  Component,
  ElementRef,
  HostListener,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { PointGameComponent } from './point-game/point-game.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [PointGameComponent],
  template: `
    <h1>afterRender and afterNextRender</h1>
    <p>
      Use your arrow keys to move the dot. It's position is updated using
      signals and the DOM is updated on <code>afterRender</code>
    </p>

    <p>
      There's another dot that you try to catch, when the coordinates of this
      and you dot matches, then a new random position is generated
    </p>

    <app-point-game />
  `,
  styles: [],
})
export class AppComponent {}
