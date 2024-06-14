import React, { useState } from 'react';
import { MessagePayload } from '../shared/network-type';
import { isRequestPayload } from './lib/network/response';
import { InitialInfo } from '../shared/dto';
import { formatFontData } from '../shared/font';

function App() {
  const [text, setText] = useState("Hello World");
  
  window.onmessage = async (message: MessageEvent) => {
    let payload: MessagePayload = message.data.pluginMessage.pluginMessage;
    if (isRequestPayload(payload, 'requestInitialInfo')) {
      const initialInfo: InitialInfo = payload.data as InitialInfo;
      setText(formatFontData(initialInfo.selection.defaultFont));
      // Do Something Initial Process...
    }
  }

  return <h1>{text}</h1>;
}

export default App;
