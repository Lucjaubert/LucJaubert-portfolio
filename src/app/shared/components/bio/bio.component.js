"use strict";
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BioComponent = void 0;
var core_1 = require("@angular/core");
var gsap_1 = require("gsap");
var common_1 = require("@angular/common");
var router_1 = require("@angular/router");
var BioComponent = function () {
    var _classDecorators = [(0, core_1.Component)({
            selector: 'app-bio',
            templateUrl: './bio.component.html',
            styleUrls: ['./bio.component.scss'],
            standalone: true,
            imports: [
                router_1.RouterOutlet,
                common_1.CommonModule
            ]
        })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var BioComponent = _classThis = /** @class */ (function () {
        function BioComponent_1(platformId) {
            this.platformId = platformId;
        }
        BioComponent_1.prototype.ngAfterViewInit = function () {
            if ((0, common_1.isPlatformBrowser)(this.platformId)) {
                this.initBioAnimations();
            }
        };
        BioComponent_1.prototype.initBioAnimations = function () {
            if ((0, common_1.isPlatformBrowser)(this.platformId)) {
                this.gsapContext = gsap_1.gsap.context(function () {
                    var paragraphs = document.querySelectorAll('.bio-content p');
                    paragraphs.forEach(function (paragraph) {
                        gsap_1.gsap.to(paragraph, {
                            opacity: 1,
                            y: 0,
                            duration: 1,
                            ease: "power4.out",
                            scrollTrigger: {
                                trigger: paragraph,
                                start: "80px 70%",
                                toggleActions: "play none none none",
                            },
                        });
                        gsap_1.gsap.to(paragraph, {
                            scale: 1.05,
                            duration: 1,
                            ease: "power4.out",
                            scrollTrigger: {
                                trigger: paragraph,
                                start: "center center",
                                toggleActions: "play none none none",
                            },
                        });
                    });
                });
            }
        };
        return BioComponent_1;
    }());
    __setFunctionName(_classThis, "BioComponent");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        BioComponent = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return BioComponent = _classThis;
}();
exports.BioComponent = BioComponent;