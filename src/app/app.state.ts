import { State } from '@ngxs/store';

@State<string[]>({
  name: 'crew',
  defaults: ['Alex']
})
export class CrewState {}
