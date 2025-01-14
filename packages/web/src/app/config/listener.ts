import {
  createListenerMiddleware,
  TypedStartListening,
  UnsubscribeListener,
} from "@reduxjs/toolkit";
import { Webapp } from "@xliic/common/webapp/config";
import { AppDispatch, RootState } from "./store";
import { startListeners } from "../webapp";
import * as listener from "../../features/config/listener";

const listenerMiddleware = createListenerMiddleware();
type AppStartListening = TypedStartListening<RootState, AppDispatch>;
const startAppListening = listenerMiddleware.startListening as AppStartListening;

export function createListener(host: Webapp["host"]) {
  const listeners: Record<keyof Webapp["hostHandlers"], () => UnsubscribeListener> = {
    saveConfig: listener.onConfigChange(startAppListening, host),
    testOverlordConnection: listener.onTestOverlordConnection(startAppListening, host),
    testScandManagerConnection: listener.onTestScandManagerConnection(startAppListening, host),
    testPlatformConnection: listener.onTestPlatformConnection(startAppListening, host),
  };

  startListeners(listeners);

  return listenerMiddleware;
}
