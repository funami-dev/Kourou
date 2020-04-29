# Todo

- Auf Angular 9 umstellen
  - https://update.angular.io/#6.1:9.0

```
npm WARN @angular/common@6.1.10 requires a peer of rxjs@^6.0.0 but none is installed. You must install peer dependencies yourself.
npm WARN @angular/core@6.1.10 requires a peer of rxjs@^6.0.0 but none is installed. You must install peer dependencies yourself.
npm WARN @angular/forms@6.1.10 requires a peer of rxjs@^6.0.0 but none is installed. You must install peer dependencies yourself.
npm WARN @angular/http@6.1.10 requires a peer of rxjs@^6.0.0 but none is installed. You must install peer dependencies yourself.
npm WARN @angular/router@6.1.10 requires a peer of rxjs@^6.0.0 but none is installed. You must install peer dependencies yourself.
npm WARN @ngrx/store@6.1.2 requires a peer of rxjs@^5.6.0-forward-compat.0 || ^6.0.0 but none is installed. You must install peer dependencies yourself.
npm WARN @ngxs/devtools-plugin@3.6.2 requires a peer of rxjs@>=6.5.4 but none is installed. You must install peer dependencies yourself.
npm WARN @ngxs/storage-plugin@3.6.2 requires a peer of rxjs@>=6.5.4 but none is installed. You must install peer dependencies yourself.
npm WARN @ngxs/store@3.6.2 requires a peer of rxjs@>=6.5.4 but none is installed. You must install peer dependencies yourself.
npm WARN ng-inline-svg@10.0.0 requires a peer of @angular/core@>=9.0.0 but none is installed. You must install peer dependencies yourself.
npm WARN ng-inline-svg@10.0.0 requires a peer of @angular/common@>=9.0.0 but none is installed. You must install peer dependencies yourself.
npm WARN ng-inline-svg@10.0.0 requires a peer of rxjs@^6.5.0 but none is installed. You must install peer dependencies yourself.
```

```
inline-svg.service.js:54 Uncaught TypeError: _angular_core__WEBPACK_IMPORTED_MODULE_0__.ɵɵdefineInjectable is not a function
    at inline-svg.service.js:54
    at Module../node_modules/ng-inline-svg/lib_esmodule/inline-svg.service.js (inline-svg.service.js:62)
    at __webpack_require__ (bootstrap:78)
    at Module../node_modules/ng-inline-svg/lib_esmodule/inline-svg.component.js (inline-svg.component.js:1)
    at __webpack_require__ (bootstrap:78)
    at Module../node_modules/ng-inline-svg/lib_esmodule/inline-svg.directive.js (inline-svg.directive.js:1)
    at __webpack_require__ (bootstrap:78)
    at Module../node_modules/ng-inline-svg/lib_esmodule/index.js (index.js:1)
    at __webpack_require__ (bootstrap:78)
    at Module../src/app/app.module.ts (app.component.ts:8)
```

```
    WARNING in ./node_modules/ng-inline-svg/lib_esmodule/svg-cache.service.js 97:38-59
"export 'ɵɵdefineInjectable' (imported as 'i0') was not found in '@angular/core'

WARNING in ./node_modules/ng-inline-svg/lib_esmodule/inline-svg.service.js 54:39-60
"export 'ɵɵdefineInjectable' (imported as 'i0') was not found in '@angular/core'

WARNING in ./node_modules/ng-inline-svg/lib_esmodule/svg-cache.service.js 97:135-146
"export 'ɵɵinject' (imported as 'i0') was not found in '@angular/core'

WARNING in ./node_modules/ng-inline-svg/lib_esmodule/svg-cache.service.js 97:169-180
"export 'ɵɵinject' (imported as 'i0') was not found in '@angular/core'

WARNING in ./node_modules/ng-inline-svg/lib_esmodule/svg-cache.service.js 97:206-217
"export 'ɵɵinject' (imported as 'i0') was not found in '@angular/core'

WARNING in ./node_modules/ng-inline-svg/lib_esmodule/svg-cache.service.js 97:242-253
"export 'ɵɵinject' (imported as 'i0') was not found in '@angular/core'

WARNING in ./node_modules/ng-inline-svg/lib_esmodule/svg-cache.service.js 97:271-282
"export 'ɵɵinject' (imported as 'i0') was not found in '@angular/core'

WARNING in ./node_modules/ng-inline-svg/lib_esmodule/inline-svg.service.js 54:138-149
"export 'ɵɵinject' (imported as 'i0') was not found in '@angular/core'

```
