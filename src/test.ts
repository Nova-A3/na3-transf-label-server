// import ptp from "pdf-to-printer";

// (async () => {
//   const printers = await ptp.getPrinters();
//   const defaultPrinter = await ptp.getDefaultPrinter();
//   console.log(printers, defaultPrinter);
//   await ptp.print("label-test.pdf");
// })();

import { label } from "./classes";

(async () => {
  const l = label({
    customerName: "Dart do Brasil Ind. e Comércio LTDA.",
    date: "02/09/2021",
    productCode: "S-0043227",
    productName:
      "Produto com um nome muito, muito grande mesmo, capaz de ocupar até quatro linhas",
    productQuantity: 6000,
    productUnitAbbreviation: "SACOS",
    productUnitName: "SACOS",
    batchId: "KA02-154-21219C",
    qrData: "test",
    barcodeData: "test",
    copies: 10,
  });
})();
