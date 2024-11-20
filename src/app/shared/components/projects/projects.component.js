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
exports.ProjectsComponent = void 0;
var core_1 = require("@angular/core");
var all_1 = require("gsap/all");
var common_1 = require("@angular/common");
var router_1 = require("@angular/router");
all_1.gsap.registerPlugin(all_1.CSSPlugin, all_1.ScrollTrigger);
var ProjectsComponent = function () {
    var _classDecorators = [(0, core_1.Component)({
            selector: 'app-projects',
            templateUrl: './projects.component.html',
            styleUrls: ['./projects.component.scss'],
            standalone: true,
            imports: [router_1.RouterOutlet, common_1.CommonModule],
            changeDetection: core_1.ChangeDetectionStrategy.OnPush,
        })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _mediaElements_decorators;
    var _mediaElements_initializers = [];
    var ProjectsComponent = _classThis = /** @class */ (function () {
        function ProjectsComponent_1(platformId, http, changeDetectorRef, breakpointObserver, ngZone) {
            this.platformId = (__runInitializers(this, _instanceExtraInitializers), platformId);
            this.http = http;
            this.changeDetectorRef = changeDetectorRef;
            this.breakpointObserver = breakpointObserver;
            this.ngZone = ngZone;
            this.mediaElements = __runInitializers(this, _mediaElements_initializers, void 0);
            this.projects = [];
            this.currentProject = null;
            this.isHovered = false;
            this.activeMediaIndex = null;
            this.mediaSequence = [];
            this.laiterieTimeline = null;
            this.anglaisTimeline = null;
            this.limagoTimeline = null;
            this.maisonTimeline = null;
            this.animations = {};
            this.animationInitialized = false;
            this.isDesktop = false;
        }
        ProjectsComponent_1.prototype.ngOnInit = function () {
            var _this = this;
            if ((0, common_1.isPlatformBrowser)(this.platformId)) {
                this.loadProjects();
                this.animations = {
                    laiterieAnimation: {
                        in: function () { return _this.initProjectAnimation('laiterie'); },
                        out: function () { },
                    },
                    anglaisAnimation: {
                        in: function () { return _this.initProjectAnimation('anglais'); },
                        out: function () { },
                    },
                    limagoAnimation: {
                        in: function () { return _this.initProjectAnimation('limago'); },
                        out: function () { },
                    },
                    maisonAnimation: {
                        in: function () { return _this.initProjectAnimation('maison'); },
                        out: function () { },
                    },
                };
                this.breakpointObserver.observe(['(min-width: 768px)']).subscribe(function (state) {
                    _this.isDesktop = state.matches;
                    _this.changeDetectorRef.markForCheck();
                });
            }
        };
        ProjectsComponent_1.prototype.ngAfterViewInit = function () {
            var _this = this;
            this.mediaElements.changes.subscribe(function () {
                if (_this.mediaElements.length > 0 && _this.currentProject) {
                    _this.initAnimationForCurrentProject();
                }
            });
            if ((0, common_1.isPlatformBrowser)(this.platformId)) {
                this.initProjectAnimations();
            }
        };
        ProjectsComponent_1.prototype.ngOnDestroy = function () {
            if (this.gsapContext) {
                this.gsapContext.revert();
            }
            this.killTimelines();
            if (this.mobileSlideshowInterval) {
                clearInterval(this.mobileSlideshowInterval);
            }
        };
        ProjectsComponent_1.prototype.toggleMediaPreview = function (index) {
            var _this = this;
            if (this.activeMediaIndex === index) {
                this.activeMediaIndex = null;
                this.currentProject = null;
                this.mediaSequence = [];
                this.animationInitialized = false;
                this.changeDetectorRef.detectChanges();
                if (this.mobileSlideshowInterval) {
                    clearInterval(this.mobileSlideshowInterval);
                    this.mobileSlideshowInterval = null;
                }
            }
            else {
                this.activeMediaIndex = index;
                this.currentProject = this.projects[index];
                this.mediaSequence = this.currentProject.mediaSequence || [];
                this.animationInitialized = false;
                this.changeDetectorRef.detectChanges();
                setTimeout(function () {
                    _this.changeDetectorRef.detectChanges();
                    _this.mediaElements.changes.subscribe(function () {
                        if (_this.mediaElements.length > 0 && _this.currentProject) {
                            _this.initAnimationForCurrentProject();
                        }
                    });
                    if (_this.mediaElements.length > 0 && _this.currentProject) {
                        _this.initAnimationForCurrentProject();
                    }
                }, 0);
            }
        };
        ProjectsComponent_1.prototype.isMediaPreviewVisible = function (index) {
            return this.activeMediaIndex === index;
        };
        ProjectsComponent_1.prototype.getMediaSequence = function (project) {
            var mediaSequence = [];
            var maxLength = Math.max(project.images.length, project.videos.length);
            for (var i = 0; i < maxLength; i++) {
                if (project.images[i]) {
                    mediaSequence.push({ type: 'image', src: project.images[i] });
                }
                if (project.videos[i]) {
                    mediaSequence.push({ type: 'video', src: project.videos[i] });
                }
            }
            return mediaSequence.sort(function () { return Math.random() - 0.5; });
        };
        ProjectsComponent_1.prototype.onProjectContainerClick = function (index) {
            if (!this.isDesktop) {
                this.toggleMediaPreview(index);
            }
            else {
                this.openProjectLink(this.projects[index]);
            }
        };
        ProjectsComponent_1.prototype.openProjectLink = function (project) {
            if (!project)
                return;
            var url;
            switch (project.name) {
                case 'LAITERIE BURDIGALA .':
                    url = 'www.laiterieburdigala.fr';
                    break;
                case 'ANGLAIS DU VIN .':
                    url = 'www.kathrynwaltonward.com';
                    break;
                case 'LIMAGO REFLEXO .':
                    url = 'www.limago-reflexo.fr';
                    break;
                case 'MAISON AH-RONG .':
                    url = 'www.maisonahrong.com';
                    break;
                default:
                    url = '#';
            }
            if (!/^https?:\/\//i.test(url)) {
                url = 'https://' + url;
            }
            window.open(url, '_blank');
        };
        ProjectsComponent_1.prototype.initProjectAnimations = function () {
            var _this = this;
            if ((0, common_1.isPlatformBrowser)(this.platformId)) {
                this.ngZone.runOutsideAngular(function () {
                    _this.gsapContext = all_1.gsap.context(function () {
                        all_1.gsap.to('.background-sides', {
                            height: '100%',
                            duration: 1.3,
                            ease: 'expoScale',
                            scrollTrigger: {
                                trigger: '#projects',
                            },
                            onComplete: function () {
                                _this.animateTextSlides();
                            },
                        });
                    });
                });
            }
        };
        ProjectsComponent_1.prototype.animateTextSlides = function () {
            var _this = this;
            this.ngZone.runOutsideAngular(function () {
                all_1.gsap.to('.text-slide', {
                    opacity: 1,
                    y: 0,
                    delay: 0.1,
                    duration: 0.8,
                    ease: 'power4.out',
                    stagger: 0.2,
                    onComplete: function () {
                        _this.enableInteractions();
                    },
                });
            });
        };
        ProjectsComponent_1.prototype.enableInteractions = function () {
            var projectPresentation = document.querySelector('.project-presentation');
            if (projectPresentation) {
                projectPresentation.style.pointerEvents = 'auto';
            }
        };
        ProjectsComponent_1.prototype.loadProjects = function () {
            var _this = this;
            this.http.get('assets/data/projects.json').subscribe(function (data) {
                _this.projects = data.map(function (project) {
                    var mediaSequence = _this.getAllMedia(project);
                    var shuffledMediaSequence = mediaSequence.sort(function () { return Math.random() - 0.5; });
                    return __assign(__assign({}, project), { mediaSequence: shuffledMediaSequence });
                });
                _this.changeDetectorRef.detectChanges();
            });
        };
        ProjectsComponent_1.prototype.onProjectHover = function (project, event) {
            var _this = this;
            if (!this.isDesktop)
                return;
            if (this.currentProject && this.currentProject !== project) {
                var previousAnimation = this.animations[this.currentProject.animationType || ''];
                if (previousAnimation && previousAnimation.out) {
                    previousAnimation.out();
                }
            }
            this.currentProject = project;
            this.isHovered = true;
            this.animationInitialized = false;
            this.mediaSequence = this.getAllMedia(project);
            this.mediaSequence = this.mediaSequence.sort(function () { return Math.random() - 0.5; });
            this.changeDetectorRef.detectChanges();
            setTimeout(function () {
                if (_this.mediaElements.length > 0) {
                    _this.initAnimationForCurrentProject();
                }
            }, 0);
        };
        ProjectsComponent_1.prototype.onProjectOut = function (event) {
            var _a;
            if (!this.isDesktop)
                return;
            var relatedTarget = event.relatedTarget;
            if (relatedTarget &&
                (relatedTarget.closest('.project-container') || relatedTarget.closest('.media-preview'))) {
                return;
            }
            this.isHovered = false;
            this.animationInitialized = false;
            var animation = this.animations[((_a = this.currentProject) === null || _a === void 0 ? void 0 : _a.animationType) || ''];
            if (animation && animation.out) {
                animation.out();
            }
            this.currentProject = null;
            this.mediaSequence = [];
            this.changeDetectorRef.detectChanges();
            if (this.mobileSlideshowInterval) {
                clearInterval(this.mobileSlideshowInterval);
                this.mobileSlideshowInterval = null;
            }
        };
        ProjectsComponent_1.prototype.initAnimationForCurrentProject = function () {
            if (this.animationInitialized || this.mediaElements.length === 0 || !this.currentProject) {
                return;
            }
            this.animationInitialized = true;
            if (this.isDesktop) {
                var animation_1 = this.animations[this.currentProject.animationType || ''];
                if (animation_1 && animation_1.in) {
                    this.ngZone.runOutsideAngular(function () {
                        animation_1.in();
                    });
                }
                else {
                    console.warn('No animation found for:', this.currentProject.animationType);
                }
            }
            else {
                this.initMobileSlideshow();
            }
        };
        ProjectsComponent_1.prototype.initMobileSlideshow = function () {
            var _this = this;
            if (this.mobileSlideshowInterval) {
                clearInterval(this.mobileSlideshowInterval);
            }
            var elements = this.mediaElements.toArray();
            var currentIndex = 0;
            elements.forEach(function (elementRef, index) {
                var element = elementRef.nativeElement;
                element.style.display = index === 0 ? 'block' : 'none';
                if (element.tagName.toLowerCase() === 'video') {
                    element.pause();
                    element.currentTime = 0;
                }
            });
            var firstElement = elements[0].nativeElement;
            if (firstElement.tagName.toLowerCase() === 'video') {
                firstElement.play();
            }
            this.mobileSlideshowInterval = setInterval(function () {
                var previousElement = elements[currentIndex].nativeElement;
                previousElement.style.display = 'none';
                if (previousElement.tagName.toLowerCase() === 'video') {
                    previousElement.pause();
                    previousElement.currentTime = 0;
                }
                currentIndex = (currentIndex + 1) % elements.length;
                var currentElement = elements[currentIndex].nativeElement;
                currentElement.style.display = 'block';
                if (currentElement.tagName.toLowerCase() === 'video') {
                    currentElement.play();
                }
                _this.changeDetectorRef.detectChanges();
            }, 1500);
        };
        ProjectsComponent_1.prototype.getAllMedia = function (project) {
            if (!project) {
                return [];
            }
            var mediaSequence = [];
            var maxLength = Math.max(project.images.length, project.videos.length);
            for (var i = 0; i < maxLength; i++) {
                if (project.images[i]) {
                    mediaSequence.push({ type: 'image', src: project.images[i] });
                }
                if (project.videos[i]) {
                    mediaSequence.push({ type: 'video', src: project.videos[i] });
                }
            }
            return mediaSequence;
        };
        ProjectsComponent_1.prototype.killTimelines = function () {
            [this.laiterieTimeline, this.anglaisTimeline, this.limagoTimeline, this.maisonTimeline].forEach(function (timeline) {
                if (timeline) {
                    timeline.kill();
                }
            });
            this.animationInitialized = false;
        };
        ProjectsComponent_1.prototype.initProjectAnimation = function (timelineName) {
            if (this.mediaElements && this.mediaElements.length > 0) {
                var timeline_1 = null;
                switch (timelineName) {
                    case 'laiterie':
                        if (this.laiterieTimeline) {
                            this.laiterieTimeline.kill();
                            this.laiterieTimeline = null;
                        }
                        break;
                    case 'anglais':
                        if (this.anglaisTimeline) {
                            this.anglaisTimeline.kill();
                            this.anglaisTimeline = null;
                        }
                        break;
                    case 'limago':
                        if (this.limagoTimeline) {
                            this.limagoTimeline.kill();
                            this.limagoTimeline = null;
                        }
                        break;
                    case 'maison':
                        if (this.maisonTimeline) {
                            this.maisonTimeline.kill();
                            this.maisonTimeline = null;
                        }
                        break;
                }
                var shuffledMediaElements = this.mediaElements.toArray();
                var repeatValue = -1;
                timeline_1 = all_1.gsap.timeline({ repeat: repeatValue, defaults: { ease: 'power1.inOut' } });
                var transitionDuration_1 = 0.4;
                var displayDuration_1 = 1.5;
                var timeBetweenElements_1 = displayDuration_1;
                var directionOptionsX_1 = ['-100%', '0%', '100%'];
                var directionOptionsY_1 = ['-100%', '0%', '100%'];
                shuffledMediaElements.forEach(function (elementRef) {
                    var element = elementRef.nativeElement;
                    var xStart = directionOptionsX_1[Math.floor(Math.random() * directionOptionsX_1.length)];
                    var yStart = directionOptionsY_1[Math.floor(Math.random() * directionOptionsY_1.length)];
                    all_1.gsap.set(element, {
                        opacity: 0,
                        display: 'none',
                        x: xStart,
                        y: yStart,
                    });
                    if (element.tagName.toLowerCase() === 'video') {
                        element.muted = true;
                        element.playsInline = true;
                        element.autoplay = true;
                        element.preload = 'auto';
                        element.load();
                    }
                });
                shuffledMediaElements.forEach(function (elementRef, index) {
                    var element = elementRef.nativeElement;
                    var xStart = directionOptionsX_1[Math.floor(Math.random() * directionOptionsX_1.length)];
                    var yStart = directionOptionsY_1[Math.floor(Math.random() * directionOptionsY_1.length)];
                    var showStartTime = index * timeBetweenElements_1;
                    var hideStartTime = showStartTime + displayDuration_1;
                    timeline_1.to(element, {
                        display: 'block',
                        opacity: 1,
                        x: '0%',
                        y: '0%',
                        duration: transitionDuration_1,
                        onStart: function () {
                            if (element.tagName.toLowerCase() === 'video') {
                                var playPromise = element.play();
                                if (playPromise !== undefined) {
                                    playPromise.catch(function (error) {
                                        console.error('Erreur lors de la lecture de la vidéo :', error);
                                    });
                                }
                            }
                        },
                    }, showStartTime);
                    timeline_1.to(element, {
                        opacity: 0,
                        x: xStart,
                        y: yStart,
                        duration: transitionDuration_1,
                        onComplete: function () {
                            element.style.display = 'none';
                            if (element.tagName.toLowerCase() === 'video') {
                                element.pause();
                                element.currentTime = 0;
                            }
                        },
                    }, hideStartTime);
                });
                switch (timelineName) {
                    case 'laiterie':
                        this.laiterieTimeline = timeline_1;
                        break;
                    case 'anglais':
                        this.anglaisTimeline = timeline_1;
                        break;
                    case 'limago':
                        this.limagoTimeline = timeline_1;
                        break;
                    case 'maison':
                        this.maisonTimeline = timeline_1;
                        break;
                }
            }
        };
        return ProjectsComponent_1;
    }());
    __setFunctionName(_classThis, "ProjectsComponent");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _mediaElements_decorators = [(0, core_1.ViewChildren)('mediaElement')];
        __esDecorate(null, null, _mediaElements_decorators, { kind: "field", name: "mediaElements", static: false, private: false, access: { has: function (obj) { return "mediaElements" in obj; }, get: function (obj) { return obj.mediaElements; }, set: function (obj, value) { obj.mediaElements = value; } }, metadata: _metadata }, _mediaElements_initializers, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ProjectsComponent = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ProjectsComponent = _classThis;
}();
exports.ProjectsComponent = ProjectsComponent;
