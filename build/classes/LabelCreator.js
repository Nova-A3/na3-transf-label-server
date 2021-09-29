"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.label = exports.LabelCreator = void 0;
var fs_1 = __importDefault(require("fs"));
var jsbarcode_1 = __importDefault(require("jsbarcode"));
var jspdf_1 = require("jspdf");
// @ts-ignore
var ncc_1 = __importDefault(require("ncc"));
var path_1 = __importDefault(require("path"));
var pdf_to_printer_1 = __importDefault(require("pdf-to-printer"));
var qrcode_1 = __importDefault(require("qrcode"));
var uniqid_1 = __importDefault(require("uniqid"));
var constants_1 = require("../constants");
var ROOT_DIR = path_1.default.resolve(__dirname, "../..");
var LabelCreator = /** @class */ (function () {
    function LabelCreator(config) {
        this.config = config;
        this.pdf = {
            doc: new jspdf_1.jsPDF({
                format: [
                    parseInt(process.env.LABEL_W || "152"),
                    parseInt(process.env.LABEL_H || "53"),
                ],
                orientation: "landscape",
            }),
            ready: false,
        };
        this.setDocFont();
    }
    LabelCreator.print = function (label) {
        return __awaiter(this, void 0, void 0, function () {
            var l, copies, customerName, date, productCode, productName, productQuantity, productUnitAbbreviation, batchId, qrData, filePath;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        l = new LabelCreator(label);
                        copies = label.copies, customerName = label.customerName, date = label.date, productCode = label.productCode, productName = label.productName, productQuantity = label.productQuantity, productUnitAbbreviation = label.productUnitAbbreviation, batchId = label.batchId, qrData = label.qrData;
                        __spreadArray([], Array(copies), true).forEach(function (_, i) {
                            l.fillText(customerName, 30, 10, { maxWidth: 70, maxLines: 1 });
                            if (i !== copies - 1) {
                                l.pdf.doc.addPage();
                            }
                        });
                        filePath = ".label-" + batchId + "-" + (0, uniqid_1.default)() + ".pdf";
                        l.pdf.doc.save(filePath);
                        return [4 /*yield*/, pdf_to_printer_1.default.print(filePath, {
                                unix: ["-o landscape", "-o ColorModel=Gray"],
                            })];
                    case 1:
                        _a.sent();
                        fs_1.default.unlinkSync(filePath);
                        return [2 /*return*/];
                }
            });
        });
    };
    LabelCreator.prototype.fillTest = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, customerName, date, productCode, productName, productQuantity, productUnitAbbreviation, batchId, qrData, doc, copies, qr, barcode;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this.config, customerName = _a.customerName, date = _a.date, productCode = _a.productCode, productName = _a.productName, productQuantity = _a.productQuantity, productUnitAbbreviation = _a.productUnitAbbreviation, batchId = _a.batchId, qrData = _a.qrData;
                        doc = this.pdf.doc;
                        copies = (options === null || options === void 0 ? void 0 : options.copies) || 1;
                        return [4 /*yield*/, this.makeQrAsync(qrData)];
                    case 1:
                        qr = _b.sent();
                        return [4 /*yield*/, this.makeBarcodeAsync(productCode)];
                    case 2:
                        barcode = _b.sent();
                        __spreadArray([], Array(copies), true).forEach(function (_, i) {
                            var bodyImgPath = path_1.default.resolve(ROOT_DIR, "assets/label-body.png");
                            var bodyImgData = fs_1.default.readFileSync(bodyImgPath).toString("base64");
                            doc.addImage(bodyImgData, "PNG", 4, 4, 148, 49);
                            _this.fillText(customerName, 49.5, 10.7, { maxWidth: 70, maxLines: 1 });
                            _this.fillText(date, 124.9, 10.7);
                            _this.fillText(productCode + " \u2014 " + productName, 7.5, 24.4, {
                                maxWidth: 100,
                                maxLines: 2,
                            });
                            _this.fillText(productQuantity + " " + productUnitAbbreviation, 113.35, 24.4);
                            _this.fillText(batchId, 7.5, 42);
                            _this.addQr(qr);
                            _this.addBarcode(barcode);
                            if (i !== copies - 1) {
                                doc.addPage();
                            }
                        });
                        this.pdf.ready = true;
                        return [2 /*return*/, this];
                }
            });
        });
    };
    LabelCreator.prototype.downloadTest = function (filePath, options) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!this.pdf.ready) return [3 /*break*/, 3];
                        if (!(options && "forceFill" in options && options.forceFill)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.fillTest(options)];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2: throw new Error("Fill PDF first.");
                    case 3:
                        this.pdf.doc.save(path_1.default.resolve(ROOT_DIR, filePath || "label-" + this.config.batchId + ".pdf"));
                        return [2 /*return*/, this];
                }
            });
        });
    };
    LabelCreator.prototype.printTest = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            var filePath;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        filePath = (options === null || options === void 0 ? void 0 : options.downloadPath) || "." + (0, uniqid_1.default)() + ".pdf";
                        return [4 /*yield*/, this.downloadTest(filePath, options)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, pdf_to_printer_1.default.print(filePath, {
                                unix: ["-o landscape", "-o ColorModel=Gray"],
                            })];
                    case 2:
                        _a.sent();
                        fs_1.default.unlinkSync(path_1.default.resolve(ROOT_DIR, filePath));
                        return [2 /*return*/, this];
                }
            });
        });
    };
    LabelCreator.prototype.setDocFont = function (options) {
        var config = {
            weight: (options === null || options === void 0 ? void 0 : options.weight) || "bold",
            size: (options === null || options === void 0 ? void 0 : options.size) || 10,
        };
        var doc = this.pdf.doc;
        doc.setFont("helvetica", config.weight === "regular" ? "normal" : config.weight);
        doc.setFontSize(config.size);
    };
    LabelCreator.prototype.fillText = function (text, x, y, options) {
        var doc = this.pdf.doc;
        text = text.trim().toUpperCase();
        if (options === null || options === void 0 ? void 0 : options.maxLines) {
            var words = text.split(" ");
            while (doc.getTextDimensions(words.join(" "), options).h >
                constants_1.LABEL.LINE_HEIGHT * options.maxLines)
                words.pop();
            text = words.join(" ");
        }
        this.setDocFont(options);
        doc.text(text, x, y, __assign({ baseline: "top" }, options));
        this.setDocFont();
    };
    LabelCreator.prototype.makeQrAsync = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var qrCanvas;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        qrCanvas = (0, ncc_1.default)();
                        qrCanvas.width = qrCanvas.height = constants_1.LABEL.QR_SIZE;
                        return [4 /*yield*/, qrcode_1.default.toCanvas(qrCanvas, data, {
                                color: {
                                    light: "#0000", // Transparent background
                                },
                                width: constants_1.LABEL.QR_SIZE,
                                margin: 0,
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, qrCanvas.toDataURL()];
                }
            });
        });
    };
    LabelCreator.prototype.makeBarcodeAsync = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var height, barcodeCanvas;
            return __generator(this, function (_a) {
                height = constants_1.LABEL.QR_SIZE - 3;
                barcodeCanvas = (0, ncc_1.default)();
                barcodeCanvas.width = constants_1.LABEL.BARCODE_WIDTH;
                barcodeCanvas.height = height;
                (0, jsbarcode_1.default)(barcodeCanvas, data, {
                    margin: 0,
                    width: constants_1.LABEL.BARCODE_WIDTH,
                    height: height,
                    background: "#0000",
                    displayValue: false,
                });
                return [2 /*return*/, barcodeCanvas.toDataURL()];
            });
        });
    };
    LabelCreator.prototype.addQr = function (dataUrl) {
        var doc = this.pdf.doc;
        doc.addImage(dataUrl, "PNG", 83.385, 37.884, 12.5, 12.5);
    };
    LabelCreator.prototype.addBarcode = function (base64) {
        var doc = this.pdf.doc;
        doc.addImage(base64, "PNG", 107.472, 37.884, 35, 9.5);
        this.fillText(this.config.productCode, 124.972, 47.827, {
            weight: "regular",
            size: 7,
            align: "center",
        });
    };
    return LabelCreator;
}());
exports.LabelCreator = LabelCreator;
var label = function (config) { return new LabelCreator(config); };
exports.label = label;
exports.default = exports.label;
