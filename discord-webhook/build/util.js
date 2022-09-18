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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.networks = exports.NETWORK_COLOR = exports.wait = exports.websubRequest = exports.createSignature = exports.chunk = void 0;
var crypto_1 = __importDefault(require("crypto"));
var cross_fetch_1 = __importDefault(require("cross-fetch"));
function chunk(array, size) {
    if (!array.length) {
        return [];
    }
    var result = [];
    var currentIndex = 0;
    while (currentIndex < array.length) {
        result.push(array.slice(currentIndex, currentIndex + size));
        currentIndex += size;
    }
    return result;
}
exports.chunk = chunk;
function createSignature(_a) {
    var secret = _a.secret, content = _a.content, algorithm = _a.algorithm;
    var signature = crypto_1["default"]
        .createHmac(algorithm, secret)
        .update(content)
        .digest('hex');
    return signature;
}
exports.createSignature = createSignature;
function websubRequest(_a) {
    var hubEndpoint = _a.hubEndpoint, callbackEndpoint = _a.callbackEndpoint, mode = _a.mode, _b = _a.leaseSeconds, leaseSeconds = _b === void 0 ? 86000 : _b, secret = _a.secret;
    return __awaiter(this, void 0, void 0, function () {
        var formData, result, text;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    formData = new URLSearchParams();
                    formData.set('hub.topic', hubEndpoint);
                    formData.set('hub.callback', callbackEndpoint);
                    formData.set('hub.mode', mode);
                    formData.set('hub.lease_seconds', leaseSeconds.toString(10));
                    if (secret) {
                        formData.set('hub.secret', secret);
                    }
                    return [4 /*yield*/, (0, cross_fetch_1["default"])(hubEndpoint, {
                            method: 'POST',
                            body: formData,
                            headers: {
                                'Content-Type': 'application/x-www-form-urlencoded'
                            }
                        })];
                case 1:
                    result = _c.sent();
                    if (!result.ok) {
                        throw new Error("failed to subscribe: ".concat(result.statusText));
                    }
                    return [4 /*yield*/, result.text()];
                case 2:
                    text = _c.sent();
                    return [2 /*return*/, text];
            }
        });
    });
}
exports.websubRequest = websubRequest;
var wait = function (ms) {
    return new Promise(function (resolve) { return setTimeout(resolve, ms); });
};
exports.wait = wait;
exports.NETWORK_COLOR = {
    '1': '#3c3c3d',
    '10': '#ff001b',
    '100': '#39a7a1',
    '137': '#8146d9',
    '56': '#f8ba33'
};
exports.networks = {
    '1': {
        id: 1,
        name: 'Ethereum',
        explorer: {
            name: 'Etherscan',
            urls: {
                address: function (address) { return "https://etherscan.io/address/".concat(address); }
            }
        }
    },
    '10': {
        id: 10,
        name: 'Optimism',
        explorer: {
            name: 'Etherscan',
            urls: {
                address: function (address) {
                    return "https://optimistic.etherscan.io/address/".concat(address);
                }
            }
        }
    },
    '100': {
        id: 100,
        name: 'xDai',
        explorer: {
            name: 'Blockscout',
            urls: {
                address: function (address) {
                    return "https://blockscout.com/poa/xdai/address/".concat(address, "/transactions");
                }
            }
        }
    },
    '56': {
        id: 56,
        name: 'Binance Smart Chain',
        explorer: {
            name: 'BscScan',
            urls: {
                address: function (address) { return "https://bscscan.com/address/".concat(address); }
            }
        }
    },
    '137': {
        id: 137,
        name: 'Polygon',
        explorer: {
            name: 'Polygonscan',
            urls: {
                address: function (address) { return "https://polygonscan.com/address/".concat(address); }
            }
        }
    },
    '4': {
        id: 4,
        name: 'Rinkeby',
        explorer: {
            name: 'Etherscan',
            urls: {
                address: function (address) { return "https://rinkeby.etherscan.io/address/".concat(address); }
            }
        }
    },
    '5': {
        id: 5,
        name: 'Goerli (Testnet)',
        explorer: {
            name: 'Goerli (Testnet)',
            urls: {
                address: function (address) { return "https://goerli.etherscan.io/address/".concat(address); }
            }
        }
    },
    '80001': {
        id: 80001,
        name: 'Mumbai (Polygon)',
        explorer: {
            name: 'PolygonScan (Mumbai)',
            urls: {
                address: function (address) {
                    return "https://mumbai.polygonscan.com/address/".concat(address);
                }
            }
        }
    },
    '42220': {
        id: 42220,
        name: 'Celo',
        explorer: {
            name: 'Celoscan',
            urls: {
                address: function (address) { return "https://celoscan.io/address/".concat(address); }
            }
        }
    }
};
