import { createCanvas } from "canvas";
import fs from "fs";
import jsBarcode from "jsbarcode";
import { jsPDF } from "jspdf";
import path from "path";
import ptp from "pdf-to-printer";
import qr from "qrcode";
import uniqid from "uniqid";
import { LABEL } from "../constants";
import type {
  LabelConfig,
  LabelDownloadOptions,
  LabelFillOptions,
  LabelFillTextOptions,
  LabelPrintOptions,
  LabelSetDocFontOptions,
} from "../types";

const ROOT_DIR = path.resolve(__dirname, "../..");

export class LabelCreator {
  pdf: {
    readonly doc: jsPDF;
    ready: boolean;
  } = {
    doc: new jsPDF({
      format: [
        parseInt(process.env.LABEL_W || "152"),
        parseInt(process.env.LABEL_H || "53"),
      ],
      orientation: "landscape",
    }),
    ready: false,
  };

  constructor(private readonly config: LabelConfig) {
    this.setDocFont();
  }

  static async print(label: LabelConfig) {
    const l = new LabelCreator(label);

    const {
      copies,
      customerName,
      date,
      productCode,
      productName,
      productQuantity,
      productUnitAbbreviation,
      batchId,
      qrData,
    } = label;

    [...Array(copies)].forEach((_, i) => {
      l.fillText(customerName, 30, 10, { maxWidth: 70, maxLines: 1 });

      if (i !== copies - 1) {
        l.pdf.doc.addPage();
      }
    });

    const filePath = `.label-${batchId}-${uniqid()}.pdf`;

    l.pdf.doc.save(filePath);

    await ptp.print(filePath, {
      unix: ["-o landscape", "-o ColorModel=Gray"],
    });

    fs.unlinkSync(filePath);
  }

  async fillTest(options?: LabelFillOptions) {
    const {
      customerName,
      date,
      productCode,
      productName,
      productQuantity,
      productUnitAbbreviation,
      batchId,
      qrData,
    } = this.config;
    const { doc } = this.pdf;
    const copies = options?.copies || 1;

    const qr = await this.makeQrAsync(qrData);
    const barcode = await this.makeBarcodeAsync(productCode);

    [...Array(copies)].forEach((_, i) => {
      const bodyImgPath = path.resolve(ROOT_DIR, "assets/label-body.png");
      const bodyImgData = fs.readFileSync(bodyImgPath).toString("base64");
      doc.addImage(bodyImgData, "PNG", 4, 4, 148, 49);

      this.fillText(customerName, 49.5, 10.7, { maxWidth: 70, maxLines: 1 });
      this.fillText(date, 124.9, 10.7);
      this.fillText(`${productCode} — ${productName}`, 7.5, 24.4, {
        maxWidth: 100,
        maxLines: 2,
      });
      this.fillText(
        `${productQuantity} ${productUnitAbbreviation}`,
        113.35,
        24.4
      );
      this.fillText(batchId, 7.5, 42);

      this.addQr(qr);
      this.addBarcode(barcode);

      if (i !== copies - 1) {
        doc.addPage();
      }
    });

    this.pdf.ready = true;

    return this;
  }

  async downloadTest(filePath?: string, options?: LabelDownloadOptions) {
    if (!this.pdf.ready) {
      if (options && "forceFill" in options && options.forceFill) {
        await this.fillTest(options);
      } else {
        throw new Error("Fill PDF first.");
      }
    }
    this.pdf.doc.save(
      path.resolve(ROOT_DIR, filePath || `label-${this.config.batchId}.pdf`)
    );

    return this;
  }

  async printTest(options?: LabelPrintOptions) {
    const filePath = options?.downloadPath || `.${uniqid()}.pdf`;
    await this.downloadTest(filePath, options);
    await ptp.print(filePath, {
      unix: ["-o landscape", "-o ColorModel=Gray"],
    });
    fs.unlinkSync(path.resolve(ROOT_DIR, filePath));

    return this;
  }

  setDocFont(options?: LabelSetDocFontOptions) {
    const config: Required<LabelSetDocFontOptions> = {
      weight: options?.weight || "bold",
      size: options?.size || 10,
    };
    const { doc } = this.pdf;
    doc.setFont(
      "helvetica",
      config.weight === "regular" ? "normal" : config.weight
    );
    doc.setFontSize(config.size);
  }

  fillText(text: string, x: number, y: number, options?: LabelFillTextOptions) {
    const { doc } = this.pdf;
    text = text.trim().toUpperCase();
    if (options?.maxLines) {
      const words = text.split(" ");
      while (
        doc.getTextDimensions(words.join(" "), options).h >
        LABEL.LINE_HEIGHT * options.maxLines
      )
        words.pop();
      text = words.join(" ");
    }
    this.setDocFont(options);
    doc.text(text, x, y, { baseline: "top", ...options });
    this.setDocFont();
  }

  async makeQrAsync(data: string): Promise<string> {
    const qrCanvas = createCanvas(LABEL.QR_SIZE, LABEL.QR_SIZE);
    await qr.toCanvas(qrCanvas, data, {
      color: {
        light: "#0000", // Transparent background
      },
      width: LABEL.QR_SIZE,
      margin: 0,
    });
    return qrCanvas.toDataURL();
  }

  async makeBarcodeAsync(data: string): Promise<string> {
    const height = LABEL.QR_SIZE - 3;
    const barcodeCanvas = createCanvas(LABEL.BARCODE_WIDTH, height);
    jsBarcode(barcodeCanvas, data, {
      margin: 0,
      width: LABEL.BARCODE_WIDTH,
      height: height,
      background: "#0000", // Transparent
      displayValue: false,
    });
    return barcodeCanvas.toDataURL();
  }

  addQr(dataUrl: string) {
    const { doc } = this.pdf;
    doc.addImage(dataUrl, "PNG", 83.385, 37.884, 12.5, 12.5);
  }

  addBarcode(base64: string) {
    const { doc } = this.pdf;
    doc.addImage(base64, "PNG", 107.472, 37.884, 35, 9.5);
    this.fillText(this.config.productCode, 124.972, 47.827, {
      weight: "regular",
      size: 7,
      align: "center",
    });
  }
}

export const label = (config: LabelConfig) => new LabelCreator(config);

export default label;
