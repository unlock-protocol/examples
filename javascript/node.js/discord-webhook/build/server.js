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
var discord_js_1 = require("discord.js");
var express_1 = __importDefault(require("express"));
var config_1 = require("./config");
var util_1 = require("./util");
var middleware_1 = require("./middleware");
var port = process.env.PORT || 4000;
var keysCallbackEndpoint = new URL('/callback/keys', config_1.config.baseURL).toString();
var locksCallbackEndpoint = new URL('/callback/locks', config_1.config.baseURL).toString();
var webhookClient = new discord_js_1.WebhookClient({
    id: config_1.config.id,
    token: config_1.config.token
});
var websubMiddleware = (0, middleware_1.createWebsubMiddleware)({
    secret: config_1.config.websubSecret
});
var intentHandler = (0, middleware_1.createIntentHandler)({
    secret: config_1.config.websubSecret
});
var app = (0, express_1["default"])();
app.use(express_1["default"].json());
app.get('/callback/locks', intentHandler);
app.get('/callback/keys', intentHandler);
app.post('/callback/locks', websubMiddleware, function (req) { return __awaiter(void 0, void 0, void 0, function () {
    var embeds, locks, network, lockIds, _i, locks_1, lock, embed, explorerURL, networkColor, embedChunks, _a, embedChunks_1, embedChunk;
    var _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                embeds = [];
                locks = (_b = req.body) === null || _b === void 0 ? void 0 : _b.data;
                network = util_1.networks[(_c = req.body) === null || _c === void 0 ? void 0 : _c.network];
                lockIds = locks.map(function (lock) { return lock.id; });
                console.info("New Locks: ".concat(lockIds.join(', ')));
                if (!locks.length) {
                    return [2 /*return*/];
                }
                for (_i = 0, locks_1 = locks; _i < locks_1.length; _i++) {
                    lock = locks_1[_i];
                    embed = new discord_js_1.MessageEmbed();
                    if (network) {
                        embed.addField('network', network.name);
                        explorerURL = network.explorer.urls.address(lock.address);
                        if (explorerURL) {
                            embed.setURL(explorerURL);
                        }
                        networkColor = util_1.NETWORK_COLOR[network.id];
                        if (networkColor) {
                            embed.setColor(networkColor);
                        }
                    }
                    embed.setTitle("New Lock (".concat(lock.id, ")"));
                    embeds.push(embed);
                }
                embedChunks = (0, util_1.chunk)(embeds, 3);
                _a = 0, embedChunks_1 = embedChunks;
                _d.label = 1;
            case 1:
                if (!(_a < embedChunks_1.length)) return [3 /*break*/, 4];
                embedChunk = embedChunks_1[_a];
                return [4 /*yield*/, webhookClient.send({
                        embeds: embedChunk
                    })];
            case 2:
                _d.sent();
                _d.label = 3;
            case 3:
                _a++;
                return [3 /*break*/, 1];
            case 4: return [2 /*return*/];
        }
    });
}); });
app.post('/callback/keys', websubMiddleware, function (req) { return __awaiter(void 0, void 0, void 0, function () {
    var embeds, keys, network, keyIds, _i, keys_1, key, embed, explorerURL, networkColor, embedChunks, _a, embedChunks_2, embedChunk;
    var _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                embeds = [];
                keys = (_b = req.body) === null || _b === void 0 ? void 0 : _b.data;
                network = util_1.networks[(_c = req.body) === null || _c === void 0 ? void 0 : _c.network];
                keyIds = keys.map(function (key) { return key.id; });
                console.info("New Keys: ".concat(keyIds.join(', ')));
                if (!keys.length) {
                    return [2 /*return*/];
                }
                for (_i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
                    key = keys_1[_i];
                    embed = new discord_js_1.MessageEmbed();
                    if (network) {
                        embed.addField('network', network.name);
                        explorerURL = network.explorer.urls.address(key.lock.address);
                        if (explorerURL) {
                            embed.setURL(explorerURL);
                        }
                        networkColor = util_1.NETWORK_COLOR[network.id];
                        if (networkColor) {
                            embed.setColor(networkColor);
                        }
                    }
                    embed.setTitle("New key (".concat(key.id, ")"));
                    embed.addField('lock', key.lock.address);
                    embeds.push(embed);
                }
                embedChunks = (0, util_1.chunk)(embeds, 3);
                _a = 0, embedChunks_2 = embedChunks;
                _d.label = 1;
            case 1:
                if (!(_a < embedChunks_2.length)) return [3 /*break*/, 4];
                embedChunk = embedChunks_2[_a];
                return [4 /*yield*/, webhookClient.send({
                        embeds: embedChunk
                    })];
            case 2:
                _d.sent();
                _d.label = 3;
            case 3:
                _a++;
                return [3 /*break*/, 1];
            case 4: return [2 /*return*/];
        }
    });
}); });
function subscribeHooks() {
    return __awaiter(this, void 0, void 0, function () {
        var subscribe;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    subscribe = Object.values(util_1.networks).map(function (network) { return __awaiter(_this, void 0, void 0, function () {
                        var locksEndpoint, keysEndpoint, error_1;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 3, , 4]);
                                    locksEndpoint = new URL("/api/hooks/".concat(network.id, "/locks"), config_1.config.locksmithURL).toString();
                                    keysEndpoint = new URL("/api/hooks/".concat(network.id, "/keys"), config_1.config.locksmithURL).toString();
                                    return [4 /*yield*/, (0, util_1.websubRequest)({
                                            hubEndpoint: locksEndpoint,
                                            callbackEndpoint: locksCallbackEndpoint,
                                            leaseSeconds: config_1.config.leaseSeconds,
                                            topic: locksEndpoint,
                                            mode: 'subscribe',
                                            secret: config_1.config.websubSecret
                                        })];
                                case 1:
                                    _a.sent();
                                    return [4 /*yield*/, (0, util_1.websubRequest)({
                                            hubEndpoint: keysEndpoint,
                                            callbackEndpoint: keysCallbackEndpoint,
                                            leaseSeconds: config_1.config.leaseSeconds,
                                            topic: keysEndpoint,
                                            mode: 'subscribe',
                                            secret: config_1.config.websubSecret
                                        })];
                                case 2:
                                    _a.sent();
                                    return [3 /*break*/, 4];
                                case 3:
                                    error_1 = _a.sent();
                                    console.error(error_1.message);
                                    return [3 /*break*/, 4];
                                case 4: return [2 /*return*/];
                            }
                        });
                    }); });
                    return [4 /*yield*/, Promise.all(subscribe)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function unsubscribeHooks() {
    return __awaiter(this, void 0, void 0, function () {
        var unsubscribe;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    unsubscribe = Object.values(util_1.networks).map(function (network) { return __awaiter(_this, void 0, void 0, function () {
                        var locksEndpoint, keysEndpoint, error_2;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 3, , 4]);
                                    locksEndpoint = new URL("/api/hooks/".concat(network.id, "/locks"), config_1.config.locksmithURL).toString();
                                    keysEndpoint = new URL("/api/hooks/".concat(network.id, "/keys"), config_1.config.locksmithURL).toString();
                                    return [4 /*yield*/, (0, util_1.websubRequest)({
                                            hubEndpoint: locksEndpoint,
                                            callbackEndpoint: locksCallbackEndpoint,
                                            topic: locksEndpoint,
                                            mode: 'unsubscribe',
                                            secret: config_1.config.websubSecret
                                        })];
                                case 1:
                                    _a.sent();
                                    return [4 /*yield*/, (0, util_1.websubRequest)({
                                            hubEndpoint: keysEndpoint,
                                            callbackEndpoint: keysCallbackEndpoint,
                                            topic: keysEndpoint,
                                            mode: 'unsubscribe',
                                            secret: config_1.config.websubSecret
                                        })];
                                case 2:
                                    _a.sent();
                                    return [3 /*break*/, 4];
                                case 3:
                                    error_2 = _a.sent();
                                    console.error(error_2.message);
                                    return [3 /*break*/, 4];
                                case 4: return [2 /*return*/];
                            }
                        });
                    }); });
                    return [4 /*yield*/, Promise.all(unsubscribe)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function shutdown() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.info("Shutting down the websub-discord bot");
                    return [4 /*yield*/, unsubscribeHooks()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, (0, util_1.wait)(10000)]; // wait for 10 seconds to receive intent confirmation
                case 2:
                    _a.sent(); // wait for 10 seconds to receive intent confirmation
                    console.info('Unsubscribed to specified hooks');
                    process.exit(0);
                    return [2 /*return*/];
            }
        });
    });
}
function start() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("Listening for websub requests on port: ".concat(port));
                    // Renew subscription
                    setInterval(function () { return subscribeHooks(); }, config_1.config.leaseSeconds);
                    return [4 /*yield*/, subscribeHooks()];
                case 1:
                    _a.sent();
                    console.info("Subscribed to specified hooks");
                    return [2 /*return*/];
            }
        });
    });
}
var server = app.listen(port);
server.on('listening', start);
server.on('close', shutdown);
process.on('SIGINT', shutdown);
