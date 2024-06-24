// components/Barcode.js
import React from 'react';
import Barcode from 'react-barcode';

const MyBarcode = ({ value }) => {
  return <Barcode value={value} format='CODE39'/>;
};

export default MyBarcode;
