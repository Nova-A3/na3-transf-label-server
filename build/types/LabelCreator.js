"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isLabelConfig = void 0;
function isLabelConfig(config) {
    return (typeof config === "object" &&
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
        config.hasOwnProperty("copies"));
}
exports.isLabelConfig = isLabelConfig;
