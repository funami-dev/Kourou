import { animate, animateChild, group, query, style, transition, trigger } from "@angular/animations";

export const slideInAnimation =
	trigger('routeAnimations', [
		transition('* => GoodNight', [
			//style({ opacity: 0 }),
			query(':enter, :leave', [
				style({ opacity: 0 })
			]),
			query(':enter', [
				animate('2300ms ease', style({ opacity: 1 }))
			]),
			//query(':leave', animateChild()),
			//group([
			//	query(':leave', [
			//		animate('2300ms ease-out', style({ opacity: 1 }))
			//	]),
			//	query(':enter', [
			//		animate('2300ms ease-out', style({ opacity: 0 }))
			//	])
			//]),
			//query(':enter', animateChild()),
		])
	]);