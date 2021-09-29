import { ApiLabel } from "./api/ApiLabel";

export type LabelConfig = ApiLabel<"transf"> & { copies: number };

export type LabelFillOptions = {
  copies?: number;
};

export type LabelDownloadOptions =
  | {}
  | { forceFill: true; copies?: number }
  | { forceFill: false };

export type LabelPrintOptions = { downloadPath?: string } & (
  | { forceFill: true; copies?: number }
  | { forceFill: false }
);

export type LabelSetDocFontOptions = {
  weight?: "regular" | "bold";
  size?: number;
};

export type LabelFillTextOptions = {
  align?: "left" | "center";
  maxWidth?: number;
  maxLines?: number;
} & LabelSetDocFontOptions;

export function isLabelConfig(
  config: unknown
): config is LabelConfig & { [key: string]: any } {
  return (
    typeof config === "object" &&
    config !== null &&
    config.hasOwnProperty("customerName") &&
    config.hasOwnProperty("date") &&
    config.hasOwnProperty("productCode") &&
    config.hasOwnProperty("productName") &&
    config.hasOwnProperty("productQuantity") &&
    config.hasOwnProperty("productUnitAbbreviation") &&
    config.hasOwnProperty("batchId") &&
    config.hasOwnProperty("qrData") &&
    config.hasOwnProperty("barcodeData") &&
    config.hasOwnProperty("copies")
  );
}
