import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode.react';

const QRCodeComponent = ({ serverUrl }) => {
  const [qrValue, setQrValue] = useState('');

  useEffect(() => {
    if (serverUrl) {
      setQrValue(serverUrl);
      console.log("qr code rendering");
      console.log(serverUrl);
    }
  }, [serverUrl]);

  return (
    <div>
      {qrValue && <QRCode value={qrValue} size={128} />}
    </div>
  );
};

export default QRCodeComponent;
