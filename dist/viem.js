"use strict";
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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
Object.defineProperty(exports, "__esModule", { value: true });
html >
    lang;
"en" >
    charset;
"UTF-8" >
    name;
"viewport";
content = "width=device-width, initial-scale=1.0" >
    Sepolia;
Gas;
Tracker < /title>
    < /head>
    < body >
    Gas;
Spent;
by;
Address;
on;
Sepolia < /h2>
    < p > Tracking;
transactions;
from: /p>
    < p > Sender;
/b> 0x396F2A890F790470c984249D4302df089440C9A7</p >
    Receiver;
/b> 0x248894108C9e5c64B195f0482aFf4415021B002E</p >
    onclick;
"calculateGas()" > Calculate;
Gas;
Spent < /button>
    < p;
id = "result" > /p>
    < script;
type = "module" >
;
var viem_1 = require("https://esm.sh/viem");
var chains_1 = require("https://esm.sh/viem/chains");
var client = (0, viem_1.createPublicClient)({
    chain: chains_1.sepolia,
    transport: (0, viem_1.http)("https://ethereum-sepolia-rpc.publicnode.com"), // Free public RPC
});
var sender = "0x396F2A890F790470c984249D4302df089440C9A7".toLowerCase();
var receiver = "0x248894108C9e5c64B195f0482aFf4415021B002E".toLowerCase();
function calculateGas() {
    return __awaiter(this, void 0, void 0, function () {
        var latestBlock, logs, totalGasSpent, count, _i, logs_1, log, receipt, gasUsed, gasPrice, error_1;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    document.getElementById("result").textContent = "Fetching transactions...";
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 8, , 9]);
                    return [4 /*yield*/, client.getBlockNumber()];
                case 2:
                    latestBlock = _b.sent();
                    return [4 /*yield*/, client.getLogs({
                            address: sender,
                            fromBlock: latestBlock - BigInt(5000),
                            toBlock: "latest"
                        })];
                case 3:
                    logs = _b.sent();
                    totalGasSpent = BigInt(0);
                    count = 0;
                    _i = 0, logs_1 = logs;
                    _b.label = 4;
                case 4:
                    if (!(_i < logs_1.length)) return [3 /*break*/, 7];
                    log = logs_1[_i];
                    return [4 /*yield*/, client.getTransactionReceipt({ hash: log.transactionHash })];
                case 5:
                    receipt = _b.sent();
                    if (receipt && receipt.from.toLowerCase() === sender && ((_a = receipt.to) === null || _a === void 0 ? void 0 : _a.toLowerCase()) === receiver) {
                        gasUsed = BigInt(receipt.gasUsed);
                        gasPrice = BigInt(receipt.effectiveGasPrice || receipt.gasPrice);
                        totalGasSpent += gasUsed * gasPrice;
                        count++;
                    }
                    _b.label = 6;
                case 6:
                    _i++;
                    return [3 /*break*/, 4];
                case 7:
                    document.getElementById("result").textContent =
                        "Total Gas Spent: ".concat((0, viem_1.formatEther)(totalGasSpent), " ETH (in ").concat(count, " transactions)");
                    return [3 /*break*/, 9];
                case 8:
                    error_1 = _b.sent();
                    console.error(error_1);
                    document.getElementById("result").textContent = "Error fetching data!";
                    return [3 /*break*/, 9];
                case 9: return [2 /*return*/];
            }
        });
    });
}
window.calculateGas = calculateGas;
/script>
    < /body>
    < /html>;
