import { Component, OnInit } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { timer } from 'rxjs';

@Component({
  selector: 'app-sky',
  templateUrl: './sky.component.html',
  styleUrls: ['./sky.component.scss'],
  animations: [
    trigger('daytime', [
      state(
        'day',
        style({
          opacity: 0
        })
      ),
      state(
        'noon',
        style({
          opacity: 0.5
        })
      ),
      state(
        'night',
        style({
          opacity: 1
        })
      ),
      transition('* => *', [animate('5s')])
    ])
  ]
})
export class SkyComponent implements OnInit {
  daytimes = ['night', 'day'];
  daytime = 'night';
  constructor() {}
  source = timer(1000, 10000);

  ngOnInit() {
    const subscribe = this.source.subscribe(
      (val) => (this.daytime = this.daytimes[Math.floor(Math.random() * (this.daytimes.length - 0 + 1) + 0)])
    );
  }
}
