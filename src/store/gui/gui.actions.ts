import type { LaunchSiteId } from '../../game/launch-sites/launch-site.model';

export class SetCurrentLocation {
  static readonly type = '[GUI] Select base';

  constructor(public readonly id: LaunchSiteId | null) {}
}
