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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
exports.__esModule = true;
var client_s3_1 = require("@aws-sdk/client-s3");
var s3Client = new client_s3_1.S3Client({
    region: 'us-east-1'
});
var BUCKETS_TO_LEAVE = [
    'amplify-amplifytodo-dev-120152-deployment',
    'aws-codestar-us-east-1-632270695338',
    'aws-codestar-us-east-1-632270695338-codestar-test-app',
    'tkhatch-photobackup',
    'trh-sharedfilesbackup',
];
var deleteBucket = function (bucket) { return __awaiter(void 0, void 0, void 0, function () {
    var listResults, deleteMarkers, versions, objectsToDelete, deleteParams, deleteResults;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0: return [4 /*yield*/, s3Client.send(new client_s3_1.ListObjectVersionsCommand({
                    Bucket: bucket
                }))];
            case 1:
                listResults = _c.sent();
                if (!(((_a = listResults.DeleteMarkers) === null || _a === void 0 ? void 0 : _a.length) || ((_b = listResults.Versions) === null || _b === void 0 ? void 0 : _b.length))) return [3 /*break*/, 4];
                deleteMarkers = listResults.DeleteMarkers || [];
                versions = listResults.Versions || [];
                objectsToDelete = __spreadArray(__spreadArray([], deleteMarkers, true), versions, true);
                deleteParams = {
                    Bucket: bucket,
                    Delete: { Objects: objectsToDelete }
                };
                return [4 /*yield*/, s3Client.send(new client_s3_1.DeleteObjectsCommand(deleteParams))];
            case 2:
                deleteResults = _c.sent();
                console.log(deleteResults);
                return [4 /*yield*/, s3Client.send(new client_s3_1.DeleteBucketCommand({
                        Bucket: bucket
                    }))];
            case 3:
                _c.sent();
                _c.label = 4;
            case 4: return [2 /*return*/];
        }
    });
}); };
var run = function () { return __awaiter(void 0, void 0, void 0, function () {
    var results, buckets, _i, buckets_1, bucket;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, s3Client.send(new client_s3_1.ListBucketsCommand({}))];
            case 1:
                results = _b.sent();
                if (!((_a = results.Buckets) === null || _a === void 0 ? void 0 : _a.length)) return [3 /*break*/, 5];
                buckets = results.Buckets.filter(function (bucket) { return !BUCKETS_TO_LEAVE.includes(bucket.Name || ''); });
                _i = 0, buckets_1 = buckets;
                _b.label = 2;
            case 2:
                if (!(_i < buckets_1.length)) return [3 /*break*/, 5];
                bucket = buckets_1[_i];
                if (!bucket.Name) return [3 /*break*/, 4];
                return [4 /*yield*/, deleteBucket(bucket.Name)];
            case 3:
                _b.sent();
                _b.label = 4;
            case 4:
                _i++;
                return [3 /*break*/, 2];
            case 5: return [2 /*return*/];
        }
    });
}); };
run();
