import { trigger, state, style, animate, transition } from '@angular/animations';

export let rotateTo = trigger('rotateTo', [
  //   state('void', style({ opacity: 0 })),
  transition('* => *', [
    style({
      transform: 'rotate(0deg)',
      backgroundColor: 'red'
    }),
    animate(
      1800,
      style({
        transform: 'rotate(90deg)',
        backgroundColor: 'yellow'
      })
    )
  ])
]);

export let liftOff = trigger('liftOff', [
  //   state('void', style({ opacity: 0 })),
  transition('* => *', [
    style({ opacity: 0 }),
    animate(
      1800,
      style({
        transform: 'translate(0,-200px)'
      })
    )
  ])
]);
