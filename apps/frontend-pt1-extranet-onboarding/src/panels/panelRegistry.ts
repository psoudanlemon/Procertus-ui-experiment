import type { ComponentType } from "react";

import {
  REQUEST_DETAIL_PANEL_TYPE,
  RequestDetailPanel,
} from "./request_detail_panel";
import {
  PROFILE_CHANGE_DETAIL_PANEL_TYPE,
  ProfileChangeDetailPanel,
} from "./profile_change_detail_panel";
import { ConversationDetailPanel } from "./conversation_detail_panel";
import { CONVERSATION_DETAIL_PANEL_TYPE } from "./conversation-panel-config";

export const panelRegistry = {
  [REQUEST_DETAIL_PANEL_TYPE]: RequestDetailPanel,
  [PROFILE_CHANGE_DETAIL_PANEL_TYPE]: ProfileChangeDetailPanel,
  [CONVERSATION_DETAIL_PANEL_TYPE]: ConversationDetailPanel,
} satisfies Record<string, ComponentType<any>>;

export type AppPanelRegistry = typeof panelRegistry;
