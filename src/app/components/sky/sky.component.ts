import { Component, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { timer } from 'rxjs';

type Daytime = 'day' | 'night';

const DAYTIMES: readonly Daytime[] = ['night', 'day'];

@Component({
  selector: 'app-sky',
  templateUrl: './sky.component.html',
  styleUrl: './sky.component.scss'
})
export class SkyComponent {
  readonly daytime = signal<Daytime>('night');

  constructor() {
    timer(1000, 10000)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.daytime.set(DAYTIMES[Math.floor(Math.random() * DAYTIMES.length)]!));
  }
}
