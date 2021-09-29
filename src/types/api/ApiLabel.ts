type ApiLabelId = "transf";

export type ApiLabel<Id extends ApiLabelId = ApiLabelId> = {
  transf: {
    transfId?: string;
    customerName: string;
    date: string;
    productCode: string;
    productName: string;
    productQuantity: string | number;
    productUnitAbbreviation: string;
    productUnitName: string;
    batchId: string;
    qrData: string;
    barcodeData: string;
  };
}[Id];

export type ApiLabelPrintResponse =
  | { failed: false; status: "success" }
  | { failed: true; status: "fail" };
