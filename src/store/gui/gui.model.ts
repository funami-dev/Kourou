import type { LaunchSiteId } from '../../game/launch-sites/launch-site.model';

export interface GuiStateModel {
  /** The launch site the player runs, or `null` while the player is still choosing one on the world map. */
  currentLocation: LaunchSiteId | null;
}
