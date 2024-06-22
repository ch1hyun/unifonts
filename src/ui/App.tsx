import React, { createContext, useState } from 'react';
import { ExceptionTypes, MessagePayload, RequestTypes } from '../shared/network-type';
import { InitialInfo } from '../shared/dto';
import Unifont from './component/Unifont';
import { requestToPlugin } from './lib/network/request';

export const InitContext = createContext(null);

function App() {
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

  function close() {
    requestToPlugin({
      type: RequestTypes.CLOSE,
      data: null
    });
  }

  return (
    <>
    <InitContext.Provider value={{init, close}}>
      <Unifont/>
    </InitContext.Provider>
    </>
  );
}

export default App;
