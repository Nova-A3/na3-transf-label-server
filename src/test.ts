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
    client: "Dart do Brasil Ind. e Comércio LTDA.",
    date: "02/09/2021",
    productId: "S-0043227",
    productCode: "5001190010",
    productName:
      "Produto com um nome muito, muito grande mesmo, capaz de ocupar até quatro linhas",
    productQuantity: 6000,
    productUnit: "sacos",
    batchId: "KA02-154-21219C",
    qrData: "test",
    barcodeData: "test",
  });
  await l.fill({ copies: 10 });
  l.download();
})();
