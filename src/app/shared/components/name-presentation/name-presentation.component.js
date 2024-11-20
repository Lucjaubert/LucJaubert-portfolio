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
exports.NamePresentationComponent = void 0;
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var gsap_1 = require("gsap");
var ScrollTrigger_1 = require("gsap/ScrollTrigger");
var anime_es_js_1 = require("animejs/lib/anime.es.js");
gsap_1.gsap.registerPlugin(ScrollTrigger_1.ScrollTrigger);
var NamePresentationComponent = function () {
    var _classDecorators = [(0, core_1.Component)({
            selector: 'app-name-presentation',
            templateUrl: './name-presentation.component.html',
            styleUrls: ['./name-presentation.component.scss'],
        })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var NamePresentationComponent = _classThis = /** @class */ (function () {
        function NamePresentationComponent_1(platformId) {
            this.platformId = platformId;
            this.colors = [
                { name: 'blue', hex: '#515DE2', image: 'letter-L-blue.png' },
                { name: 'yellow', hex: '#ffdc7a', image: 'letter-L-yellow.png' },
                { name: 'orange', hex: '#ffa93a', image: 'letter-L-orange.png' },
                { name: 'light-green', hex: '#92FFE4', image: 'letter-L-light-green.png' },
            ];
            this.currentColor = this.colors[0];
        }
        NamePresentationComponent_1.prototype.ngOnInit = function () {
            if ((0, common_1.isPlatformBrowser)(this.platformId)) {
                this.startColorChange();
            }
        };
        NamePresentationComponent_1.prototype.ngAfterViewInit = function () {
            if ((0, common_1.isPlatformBrowser)(this.platformId)) {
                this.initAnimeJS();
                this.initDotReturn();
                this.setDotPositionOnLoad();
            }
        };
        NamePresentationComponent_1.prototype.ngOnDestroy = function () {
            if (this.colorChangeInterval) {
                clearInterval(this.colorChangeInterval);
            }
        };
        NamePresentationComponent_1.prototype.startColorChange = function () {
            var _this = this;
            this.colorChangeInterval = setInterval(function () {
                _this.changeColor();
            }, 7000);
        };
        NamePresentationComponent_1.prototype.changeColor = function () {
            var currentIndex = this.colors.indexOf(this.currentColor);
            var nextIndex = (currentIndex + 1) % this.colors.length;
            this.currentColor = this.colors[nextIndex];
        };
        NamePresentationComponent_1.prototype.setDotPositionOnLoad = function () {
            var _a, _b;
            var dotElement = document.querySelector('.dot');
            var letters2Width = ((_a = document.querySelector('.ml11 .letters-2')) === null || _a === void 0 ? void 0 : _a.getBoundingClientRect().width) || 0;
            var jElementWidth = ((_b = document.querySelector('.ml11 .last-name span')) === null || _b === void 0 ? void 0 : _b.getBoundingClientRect().width) || 0;
            var totalWidth = letters2Width + jElementWidth;
            if (dotElement) {
                if (window.matchMedia("(min-width: 769px)").matches) {
                    gsap_1.gsap.set(dotElement, {
                        left: '-35.7rem',
                    });
                }
                else {
                    gsap_1.gsap.set(dotElement, {
                        x: totalWidth,
                        left: '-16.2rem',
                    });
                }
            }
        };
        NamePresentationComponent_1.prototype.initAnimeJS = function () {
            var _this = this;
            var textWrappers1 = document.querySelectorAll('.ml11 .letters-1');
            textWrappers1.forEach(function (textWrapper) {
                if (textWrapper && textWrapper.textContent) {
                    textWrapper.innerHTML = textWrapper.textContent.replace(/([^\x00-\x80]|\w)/g, "<span class='letter'>$&</span>");
                }
            });
            var textWrappers2 = document.querySelectorAll('.ml11 .letters-2');
            textWrappers2.forEach(function (textWrapper) {
                if (textWrapper && textWrapper.textContent) {
                    textWrapper.innerHTML = textWrapper.textContent.replace(/([^\x00-\x80]|\w)/g, "<span class='letter'>$&</span>");
                }
            });
            var timeline = anime_es_js_1.default.timeline({ loop: false });
            timeline
                .add({
                targets: '.ml11 .first-line',
                translateX: [
                    0,
                    (function () {
                        var letters1 = document.querySelector('.ml11 .letters-1');
                        return letters1 ? letters1.getBoundingClientRect().width + 5 : 0;
                    })(),
                ],
                easing: 'easeOutExpo',
                duration: 400,
            })
                .add({
                targets: '.ml11 .letters-1 .letter',
                opacity: [0, 1],
                easing: 'easeOutExpo',
                duration: 800,
                delay: function (el, i) { return 90 * (i + 1); },
            })
                .add({
                targets: '.ml11 .first-line',
                opacity: 0,
                duration: 400,
                easing: 'easeOutExpo',
                complete: function () {
                    _this.triggerSecondLine();
                },
            });
        };
        NamePresentationComponent_1.prototype.triggerSecondLine = function () {
            var _this = this;
            var dotElement = document.querySelector('.dot');
            if (dotElement) {
                dotElement.style.left = '0';
            }
            var lineElement = document.querySelector('.ml11 .second-line');
            if (lineElement) {
                lineElement.style.transform = 'translateX(0px)';
            }
            anime_es_js_1.default.timeline({ loop: false })
                .add({
                targets: '.ml11 .letters-2',
                opacity: 1,
                duration: 400,
            })
                .add({
                targets: '.ml11 .letters-2 .letter',
                opacity: [0, 1],
                easing: 'easeOutExpo',
                duration: 400,
                delay: function (el, i) { return 180 * (i + 1); },
            })
                .add({
                targets: '.ml11 .second-line',
                opacity: 0,
                duration: 400,
                easing: 'easeOutExpo',
                complete: function () {
                    _this.animateDeveloperTitle();
                },
            });
        };
        NamePresentationComponent_1.prototype.animateDeveloperTitle = function () {
            gsap_1.gsap.to('.ml13 .letters-3', {
                opacity: 1,
                duration: 0.3,
                stagger: 0.03,
                ease: "power1.out",
            });
        };
        NamePresentationComponent_1.prototype.initDotReturn = function () {
            if ((0, common_1.isPlatformBrowser)(this.platformId)) {
                var scrollDirection_1 = 'down';
                var lastScroll_1 = 0;
                window.addEventListener('scroll', function () {
                    var scrollPosition = window.scrollY;
                    scrollDirection_1 = scrollPosition > lastScroll_1 ? 'down' : 'up';
                    lastScroll_1 = scrollPosition;
                    if (scrollDirection_1 === 'down' && scrollPosition > 100) {
                        gsap_1.gsap.to('.ml11 .letters-1 .letter', {
                            y: function (i) { return -20 * Math.sin(i * 0.5); },
                            duration: 0.6,
                            stagger: 0.05,
                            ease: "power1.inOut",
                            opacity: 0,
                        });
                        gsap_1.gsap.to('.ml11 .letters-2 .letter', {
                            y: function (i) { return -20 * Math.sin(i * 0.7); },
                            duration: 0.6,
                            stagger: 0.1,
                            ease: "power1.inOut",
                            opacity: 0,
                            onComplete: function () {
                                gsap_1.gsap.to('.ml11 .logo-letter, .ml11 .letters-1', {
                                    opacity: 1,
                                    duration: 0.5,
                                });
                                var dotElement = document.querySelector('.dot');
                                if (dotElement) {
                                    if (window.matchMedia("(min-width: 769px)").matches) {
                                        gsap_1.gsap.to(dotElement, {
                                            duration: 0.5,
                                            left: '-35.7rem',
                                        });
                                    }
                                    else {
                                        gsap_1.gsap.to(dotElement, {
                                            duration: 0.5,
                                            left: '-16.2rem',
                                        });
                                    }
                                }
                            }
                        });
                    }
                    else if (scrollDirection_1 === 'up' && scrollPosition < 100) {
                        gsap_1.gsap.to('.ml11 .letters-2 .letter', {
                            y: 0,
                            opacity: 1,
                            duration: 0.4,
                            stagger: 0.2,
                            ease: "power1.inOut",
                            onUpdate: function () {
                                var _a, _b;
                                var letters2Width = ((_a = document.querySelector('.ml11 .letters-2')) === null || _a === void 0 ? void 0 : _a.getBoundingClientRect().width) || 0;
                                var jElementWidth = ((_b = document.querySelector('.ml11 .last-name span')) === null || _b === void 0 ? void 0 : _b.getBoundingClientRect().width) || 0;
                                var totalWidth = letters2Width + jElementWidth;
                                var dotElement = document.querySelector('.dot');
                                if (dotElement) {
                                    gsap_1.gsap.to(dotElement, {
                                        x: totalWidth,
                                        left: '0',
                                        duration: 0.1,
                                        stagger: 0.3,
                                        ease: "power1.inOut",
                                    });
                                }
                            }
                        });
                        gsap_1.gsap.to('.ml11 .letters-1 .letter', {
                            y: 0,
                            opacity: 1,
                            duration: 0.9,
                            stagger: 0.05,
                            ease: "power1.inOut",
                        });
                    }
                });
            }
        };
        return NamePresentationComponent_1;
    }());
    __setFunctionName(_classThis, "NamePresentationComponent");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        NamePresentationComponent = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return NamePresentationComponent = _classThis;
}();
exports.NamePresentationComponent = NamePresentationComponent;
