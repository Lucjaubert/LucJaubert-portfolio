"use strict";
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
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
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudioWebComponent = void 0;
var core_1 = require("@angular/core");
var all_1 = require("gsap/all");
var common_1 = require("@angular/common");
var router_1 = require("@angular/router");
var slugify_pipe_1 = require("../../pipe/slugify.pipe");
var line_breaks_pipe_1 = require("../../pipe/line-breaks.pipe");
all_1.gsap.registerPlugin(all_1.CSSPlugin, all_1.ScrollTrigger);
var StudioWebComponent = function () {
    var _classDecorators = [(0, core_1.Component)({
            selector: 'app-studio-web',
            templateUrl: './studio-web.component.html',
            styleUrls: ['./studio-web.component.scss'],
            standalone: true,
            imports: [
                router_1.RouterOutlet,
                common_1.CommonModule,
                slugify_pipe_1.SlugifyPipe,
                line_breaks_pipe_1.LineBreaksPipe
            ]
        })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _studioSectionContainers_decorators;
    var _studioSectionContainers_initializers = [];
    var StudioWebComponent = _classThis = /** @class */ (function () {
        function StudioWebComponent_1(platformId, http, changeDetectorRef) {
            this.platformId = (__runInitializers(this, _instanceExtraInitializers), platformId);
            this.http = http;
            this.changeDetectorRef = changeDetectorRef;
            this.studioSectionContainers = __runInitializers(this, _studioSectionContainers_initializers, void 0);
            this.sections = [];
            this.currentSection = null;
            this.isHovered = false;
        }
        StudioWebComponent_1.prototype.ngOnInit = function () {
            if ((0, common_1.isPlatformBrowser)(this.platformId)) {
                this.loadStudioSections();
            }
        };
        StudioWebComponent_1.prototype.ngAfterViewInit = function () {
            var _this = this;
            if ((0, common_1.isPlatformBrowser)(this.platformId)) {
                setTimeout(function () {
                    _this.initStudioSectionAnimations();
                });
            }
        };
        StudioWebComponent_1.prototype.ngOnDestroy = function () {
            if (this.gsapContext) {
                this.gsapContext.revert();
            }
        };
        StudioWebComponent_1.prototype.getSectionClass = function (index) {
            switch (index) {
                case 0:
                    return 'design-section d-flex col-md-12 py-md-7';
                case 1:
                    return 'development-section d-flex col-md-12 py-md-7';
                case 2:
                    return 'marketing-section d-flex col-md-12 py-md-7';
                case 3:
                    return 'process-section d-flex col-md-12 py-md-7';
                default:
                    return 'default-section-class';
            }
        };
        StudioWebComponent_1.prototype.loadStudioSections = function () {
            var _this = this;
            this.http.get('assets/data/studio-web.json').subscribe(function (data) {
                _this.sections = data;
                _this.changeDetectorRef.detectChanges();
                _this.initStudioSectionAnimations();
            });
        };
        StudioWebComponent_1.prototype.initStudioSectionAnimations = function () {
            var _this = this;
            if ((0, common_1.isPlatformBrowser)(this.platformId)) {
                this.gsapContext = all_1.gsap.context(function () {
                    _this.studioSectionContainers.forEach(function (section, index) {
                        var sectionElement = section.nativeElement;
                        var title = sectionElement.querySelector('h3.text-slide');
                        var mission = sectionElement.querySelector('.mission-slide');
                        var horizontalLine = sectionElement.querySelector('.horizontal-line');
                        var verticalLine = sectionElement.querySelector('.vertical-line');
                        var detailsText = sectionElement.querySelector('.stacks-slide');
                        all_1.ScrollTrigger.create({
                            trigger: sectionElement,
                            start: "top top",
                            end: "bottom top",
                            pin: true,
                            pinSpacing: true,
                            scrub: false,
                        });
                        var tl = all_1.gsap.timeline({
                            scrollTrigger: {
                                trigger: sectionElement,
                                start: "top top",
                                end: "bottom top",
                                scrub: false,
                            }
                        });
                        if (title) {
                            tl.fromTo(title, {
                                opacity: 0,
                                y: 50,
                            }, {
                                opacity: 1,
                                y: 0,
                                duration: 1,
                                ease: "power4.out",
                            });
                        }
                        if (horizontalLine) {
                            tl.fromTo(horizontalLine, {
                                width: '0%',
                            }, {
                                width: '100%',
                                duration: 1,
                                ease: 'none'
                            }, "-=0.5");
                        }
                        if (mission) {
                            tl.fromTo(mission, {
                                opacity: 0,
                                y: 50,
                            }, {
                                opacity: 1,
                                y: 0,
                                duration: 1,
                                ease: "power4.out"
                            }, "-=0.5");
                        }
                        if (verticalLine) {
                            tl.fromTo(verticalLine, {
                                height: '0%',
                            }, {
                                height: '100%',
                                duration: 1,
                                ease: 'none'
                            }, "-=0.5");
                        }
                        if (detailsText) {
                            tl.from(detailsText, {
                                opacity: 0,
                                x: 100,
                                duration: 1,
                                ease: "power4.out"
                            }, "-=0.5");
                        }
                    });
                });
            }
        };
        return StudioWebComponent_1;
    }());
    __setFunctionName(_classThis, "StudioWebComponent");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _studioSectionContainers_decorators = [(0, core_1.ViewChildren)('studioSectionContainer')];
        __esDecorate(null, null, _studioSectionContainers_decorators, { kind: "field", name: "studioSectionContainers", static: false, private: false, access: { has: function (obj) { return "studioSectionContainers" in obj; }, get: function (obj) { return obj.studioSectionContainers; }, set: function (obj, value) { obj.studioSectionContainers = value; } }, metadata: _metadata }, _studioSectionContainers_initializers, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        StudioWebComponent = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return StudioWebComponent = _classThis;
}();
exports.StudioWebComponent = StudioWebComponent;
