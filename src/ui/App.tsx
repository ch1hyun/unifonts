import React, { createContext, useState } from 'react';
import { ExceptionTypes, MessagePayload, RequestTypes } from '../shared/network-type';
import { ConvertInfo, InitialInfo } from '../shared/dto';
import Unifont from './component/Unifont';
import { requestToPlugin } from './lib/network/request';

var logger = function()
{
    var oldConsoleLog = null;
    var pub = {
      enableLogger: function enableLogger() {
        if(oldConsoleLog == null) {
          return;
        }
        window['console']['log'] = oldConsoleLog;
      },
      disableLogger: function disableLogger() {
        oldConsoleLog = console.log;
        window['console']['log'] = function() {};
      }
    };

    return pub;
}();

export const InitContext = createContext(null);

function App() {
  // Start App
  console.log("==================== Unifonts Started ====================");
  console.log("================== Disable Console Logs ==================");
  logger.disableLogger();

  const [init, setInit] = useState<InitialInfo>(null);
  
  window.onmessage = async (event: MessageEvent) => {
    const pluginMessage: MessagePayload = event.data.pluginMessage;
    const { type, data } = pluginMessage;

    switch (type) {
      // Requests
      case RequestTypes.INIT:
        setInit(data as InitialInfo);
        break;
      
      // Exceptions
      case ExceptionTypes.NO_SELECTION:
        alert("Must select at least one");
        requestToPlugin({
          type: RequestTypes.CLOSE,
          data: null
        });
        break;
    }
  }

  function enableConsole() {
    // Error Detected
    logger.enableLogger();
    console.log("=================== Enable Console Logs ==================");
    console.log("===================== Unifonts Ended =====================");
  }

  function close() {
    enableConsole();
    requestToPlugin({
      type: RequestTypes.CLOSE,
      data: null
    });
  }

  function process(convertInfo: ConvertInfo) {
    enableConsole();
    requestToPlugin({
      type: RequestTypes.PROCESS,
      data: convertInfo
    });
  }

  return (
    <>
    <InitContext.Provider value={{init, close, process}}>
      <Unifont/>
    </InitContext.Provider>
    </>
  );
}

export default App;