import {
  createListenerMiddleware,
  TypedStartListening,
  UnsubscribeListener,
} from "@reduxjs/toolkit";
import { Webapp } from "@xliic/common/webapp/config";
import { AppDispatch, RootState } from "./store";
import { saveConfig } from "../../features/config/slice";
import { startListeners } from "../webapp";

const listenerMiddleware = createListenerMiddleware();
type AppStartListening = TypedStartListening<RootState, AppDispatch>;
const startAppListening = listenerMiddleware.startListening as AppStartListening;

export function createListener(host: Webapp["host"]) {
  const listeners: Record<keyof Webapp["hostHandlers"], () => UnsubscribeListener> = {
    saveConfig: () =>
      startAppListening({
        actionCreator: saveConfig,
        effect: async (action, listenerApi) => {
          host.postMessage({
            command: "saveConfig",
            payload: action.payload,
          });
        },
      }),
  };

  startListeners(listeners);

  return listenerMiddleware;
}