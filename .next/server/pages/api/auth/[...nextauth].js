"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "pages/api/auth/[...nextauth]";
exports.ids = ["pages/api/auth/[...nextauth]"];
exports.modules = {

/***/ "(api-node)/./lib/prisma.ts":
/*!***********************!*\
  !*** ./lib/prisma.ts ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   prisma: () => (/* binding */ prisma)\n/* harmony export */ });\n/* harmony import */ var _prisma_client__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @prisma/client */ \"@prisma/client\");\n/* harmony import */ var _prisma_client__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_prisma_client__WEBPACK_IMPORTED_MODULE_0__);\n// lib/prisma.ts\n\nconst prisma = global.prisma || new _prisma_client__WEBPACK_IMPORTED_MODULE_0__.PrismaClient({\n    log: [\n        'query',\n        'error'\n    ]\n});\n// Reusa la instancia en desarrollo\nif (true) {\n    global.prisma = prisma;\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwaS1ub2RlKS8uL2xpYi9wcmlzbWEudHMiLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsZ0JBQWdCO0FBQzhCO0FBT3ZDLE1BQU1DLFNBQ1hDLE9BQU9ELE1BQU0sSUFDYixJQUFJRCx3REFBWUEsQ0FBQztJQUNmRyxLQUFLO1FBQUM7UUFBUztLQUFRO0FBQ3pCLEdBQUc7QUFFTCxtQ0FBbUM7QUFDbkMsSUFBSUMsSUFBc0MsRUFBRTtJQUMxQ0YsT0FBT0QsTUFBTSxHQUFHQTtBQUNsQiIsInNvdXJjZXMiOlsiQzpcXFVzZXJzXFxQUnVlYmFcXGludmVudGFyaW8tdW5waHVcXGxpYlxccHJpc21hLnRzIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIGxpYi9wcmlzbWEudHNcclxuaW1wb3J0IHsgUHJpc21hQ2xpZW50IH0gZnJvbSAnQHByaXNtYS9jbGllbnQnO1xyXG5cclxuZGVjbGFyZSBnbG9iYWwge1xyXG4gIC8vIHBhcmEgZXZpdGFyIG3Dumx0aXBsZXMgaW5zdGFuY2lhcyBlbiBkZXNhcnJvbGxvXHJcbiAgdmFyIHByaXNtYTogUHJpc21hQ2xpZW50IHwgdW5kZWZpbmVkO1xyXG59XHJcblxyXG5leHBvcnQgY29uc3QgcHJpc21hID1cclxuICBnbG9iYWwucHJpc21hIHx8XHJcbiAgbmV3IFByaXNtYUNsaWVudCh7XHJcbiAgICBsb2c6IFsncXVlcnknLCAnZXJyb3InXSwgLy8gb3BjaW9uYWw6IG11ZXN0cmEgbGFzIHF1ZXJpZXMgeSBlcnJvcmVzXHJcbiAgfSk7XHJcblxyXG4vLyBSZXVzYSBsYSBpbnN0YW5jaWEgZW4gZGVzYXJyb2xsb1xyXG5pZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09ICdkZXZlbG9wbWVudCcpIHtcclxuICBnbG9iYWwucHJpc21hID0gcHJpc21hO1xyXG59XHJcbiJdLCJuYW1lcyI6WyJQcmlzbWFDbGllbnQiLCJwcmlzbWEiLCJnbG9iYWwiLCJsb2ciLCJwcm9jZXNzIl0sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(api-node)/./lib/prisma.ts\n");

/***/ }),

/***/ "(api-node)/./node_modules/next/dist/build/webpack/loaders/next-route-loader/index.js?kind=PAGES_API&page=%2Fapi%2Fauth%2F%5B...nextauth%5D&preferredRegion=&absolutePagePath=.%2Fpages%5Capi%5Cauth%5C%5B...nextauth%5D.ts&middlewareConfigBase64=e30%3D!":
/*!******************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-route-loader/index.js?kind=PAGES_API&page=%2Fapi%2Fauth%2F%5B...nextauth%5D&preferredRegion=&absolutePagePath=.%2Fpages%5Capi%5Cauth%5C%5B...nextauth%5D.ts&middlewareConfigBase64=e30%3D! ***!
  \******************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   config: () => (/* binding */ config),\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__),\n/* harmony export */   routeModule: () => (/* binding */ routeModule)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_route_modules_pages_api_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/route-modules/pages-api/module.compiled */ \"(api-node)/./node_modules/next/dist/server/route-modules/pages-api/module.compiled.js\");\n/* harmony import */ var next_dist_server_route_modules_pages_api_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_route_modules_pages_api_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/route-kind */ \"(api-node)/./node_modules/next/dist/server/route-kind.js\");\n/* harmony import */ var next_dist_build_templates_helpers__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/build/templates/helpers */ \"(api-node)/./node_modules/next/dist/build/templates/helpers.js\");\n/* harmony import */ var _pages_api_auth_nextauth_ts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./pages\\api\\auth\\[...nextauth].ts */ \"(api-node)/./pages/api/auth/[...nextauth].ts\");\n\n\n\n// Import the userland code.\n\n// Re-export the handler (should be the default export).\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,next_dist_build_templates_helpers__WEBPACK_IMPORTED_MODULE_2__.hoist)(_pages_api_auth_nextauth_ts__WEBPACK_IMPORTED_MODULE_3__, 'default'));\n// Re-export config.\nconst config = (0,next_dist_build_templates_helpers__WEBPACK_IMPORTED_MODULE_2__.hoist)(_pages_api_auth_nextauth_ts__WEBPACK_IMPORTED_MODULE_3__, 'config');\n// Create and export the route module that will be consumed.\nconst routeModule = new next_dist_server_route_modules_pages_api_module_compiled__WEBPACK_IMPORTED_MODULE_0__.PagesAPIRouteModule({\n    definition: {\n        kind: next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.PAGES_API,\n        page: \"/api/auth/[...nextauth]\",\n        pathname: \"/api/auth/[...nextauth]\",\n        // The following aren't used in production.\n        bundlePath: '',\n        filename: ''\n    },\n    userland: _pages_api_auth_nextauth_ts__WEBPACK_IMPORTED_MODULE_3__\n});\n\n//# sourceMappingURL=pages-api.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwaS1ub2RlKS8uL25vZGVfbW9kdWxlcy9uZXh0L2Rpc3QvYnVpbGQvd2VicGFjay9sb2FkZXJzL25leHQtcm91dGUtbG9hZGVyL2luZGV4LmpzP2tpbmQ9UEFHRVNfQVBJJnBhZ2U9JTJGYXBpJTJGYXV0aCUyRiU1Qi4uLm5leHRhdXRoJTVEJnByZWZlcnJlZFJlZ2lvbj0mYWJzb2x1dGVQYWdlUGF0aD0uJTJGcGFnZXMlNUNhcGklNUNhdXRoJTVDJTVCLi4ubmV4dGF1dGglNUQudHMmbWlkZGxld2FyZUNvbmZpZ0Jhc2U2ND1lMzAlM0QhIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQStGO0FBQ3ZDO0FBQ0U7QUFDMUQ7QUFDaUU7QUFDakU7QUFDQSxpRUFBZSx3RUFBSyxDQUFDLHdEQUFRLFlBQVksRUFBQztBQUMxQztBQUNPLGVBQWUsd0VBQUssQ0FBQyx3REFBUTtBQUNwQztBQUNPLHdCQUF3Qix5R0FBbUI7QUFDbEQ7QUFDQSxjQUFjLGtFQUFTO0FBQ3ZCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsWUFBWTtBQUNaLENBQUM7O0FBRUQiLCJzb3VyY2VzIjpbIiJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBQYWdlc0FQSVJvdXRlTW9kdWxlIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvcm91dGUtbW9kdWxlcy9wYWdlcy1hcGkvbW9kdWxlLmNvbXBpbGVkXCI7XG5pbXBvcnQgeyBSb3V0ZUtpbmQgfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9yb3V0ZS1raW5kXCI7XG5pbXBvcnQgeyBob2lzdCB9IGZyb20gXCJuZXh0L2Rpc3QvYnVpbGQvdGVtcGxhdGVzL2hlbHBlcnNcIjtcbi8vIEltcG9ydCB0aGUgdXNlcmxhbmQgY29kZS5cbmltcG9ydCAqIGFzIHVzZXJsYW5kIGZyb20gXCIuL3BhZ2VzXFxcXGFwaVxcXFxhdXRoXFxcXFsuLi5uZXh0YXV0aF0udHNcIjtcbi8vIFJlLWV4cG9ydCB0aGUgaGFuZGxlciAoc2hvdWxkIGJlIHRoZSBkZWZhdWx0IGV4cG9ydCkuXG5leHBvcnQgZGVmYXVsdCBob2lzdCh1c2VybGFuZCwgJ2RlZmF1bHQnKTtcbi8vIFJlLWV4cG9ydCBjb25maWcuXG5leHBvcnQgY29uc3QgY29uZmlnID0gaG9pc3QodXNlcmxhbmQsICdjb25maWcnKTtcbi8vIENyZWF0ZSBhbmQgZXhwb3J0IHRoZSByb3V0ZSBtb2R1bGUgdGhhdCB3aWxsIGJlIGNvbnN1bWVkLlxuZXhwb3J0IGNvbnN0IHJvdXRlTW9kdWxlID0gbmV3IFBhZ2VzQVBJUm91dGVNb2R1bGUoe1xuICAgIGRlZmluaXRpb246IHtcbiAgICAgICAga2luZDogUm91dGVLaW5kLlBBR0VTX0FQSSxcbiAgICAgICAgcGFnZTogXCIvYXBpL2F1dGgvWy4uLm5leHRhdXRoXVwiLFxuICAgICAgICBwYXRobmFtZTogXCIvYXBpL2F1dGgvWy4uLm5leHRhdXRoXVwiLFxuICAgICAgICAvLyBUaGUgZm9sbG93aW5nIGFyZW4ndCB1c2VkIGluIHByb2R1Y3Rpb24uXG4gICAgICAgIGJ1bmRsZVBhdGg6ICcnLFxuICAgICAgICBmaWxlbmFtZTogJydcbiAgICB9LFxuICAgIHVzZXJsYW5kXG59KTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9cGFnZXMtYXBpLmpzLm1hcCJdLCJuYW1lcyI6W10sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(api-node)/./node_modules/next/dist/build/webpack/loaders/next-route-loader/index.js?kind=PAGES_API&page=%2Fapi%2Fauth%2F%5B...nextauth%5D&preferredRegion=&absolutePagePath=.%2Fpages%5Capi%5Cauth%5C%5B...nextauth%5D.ts&middlewareConfigBase64=e30%3D!\n");

/***/ }),

/***/ "(api-node)/./pages/api/auth/[...nextauth].ts":
/*!*****************************************!*\
  !*** ./pages/api/auth/[...nextauth].ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var next_auth__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next-auth */ \"next-auth\");\n/* harmony import */ var next_auth__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_auth__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_auth_providers_credentials__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next-auth/providers/credentials */ \"next-auth/providers/credentials\");\n/* harmony import */ var next_auth_providers_credentials__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(next_auth_providers_credentials__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _next_auth_prisma_adapter__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @next-auth/prisma-adapter */ \"@next-auth/prisma-adapter\");\n/* harmony import */ var _next_auth_prisma_adapter__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_next_auth_prisma_adapter__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var bcrypt__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! bcrypt */ \"bcrypt\");\n/* harmony import */ var bcrypt__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(bcrypt__WEBPACK_IMPORTED_MODULE_3__);\n/* harmony import */ var _lib_prisma__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../lib/prisma */ \"(api-node)/./lib/prisma.ts\");\n// pages/api/auth/[...nextauth].ts\n\n\n\n\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (next_auth__WEBPACK_IMPORTED_MODULE_0___default()({\n    adapter: (0,_next_auth_prisma_adapter__WEBPACK_IMPORTED_MODULE_2__.PrismaAdapter)(_lib_prisma__WEBPACK_IMPORTED_MODULE_4__.prisma),\n    pages: {\n        signIn: '/auth/signin'\n    },\n    session: {\n        strategy: 'jwt'\n    },\n    providers: [\n        next_auth_providers_credentials__WEBPACK_IMPORTED_MODULE_1___default()({\n            name: 'Credenciales',\n            credentials: {\n                matricula: {\n                    label: 'Matrícula o Email',\n                    type: 'text'\n                },\n                password: {\n                    label: 'Contraseña',\n                    type: 'password'\n                }\n            },\n            async authorize (creds) {\n                if (!creds?.matricula || !creds.password) return null;\n                const user = await _lib_prisma__WEBPACK_IMPORTED_MODULE_4__.prisma.usuario.findFirst({\n                    where: {\n                        OR: [\n                            {\n                                matricula: creds.matricula\n                            },\n                            {\n                                email: creds.matricula\n                            }\n                        ]\n                    }\n                });\n                if (!user || !user.confirmed) return null;\n                const isValid = await bcrypt__WEBPACK_IMPORTED_MODULE_3___default().compare(creds.password, user.password);\n                if (!isValid) return null;\n                // 👉 Devuelve el campo \"rol\" (no \"role\")\n                return {\n                    id: user.id.toString(),\n                    name: `${user.nombre} ${user.apellido}`,\n                    email: user.email,\n                    rol: user.rol\n                };\n            }\n        })\n    ],\n    callbacks: {\n        // Guardamos el rol en el token\n        async jwt ({ token, user }) {\n            if (user) {\n                token.rol = user.rol;\n            }\n            return token;\n        },\n        // Lo exponemos en session.user.rol\n        async session ({ session, token }) {\n            ;\n            session.user.rol = token.rol;\n            return session;\n        }\n    },\n    // Asegúrate de tener esto en tu .env.local:\n    // NEXTAUTH_URL=http://localhost:3000\n    // NEXTAUTH_SECRET=<una cadena larga de tu elección>\n    secret: process.env.NEXTAUTH_SECRET\n}));\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwaS1ub2RlKS8uL3BhZ2VzL2FwaS9hdXRoL1suLi5uZXh0YXV0aF0udHMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUFBLGtDQUFrQztBQUNGO0FBQ2lDO0FBQ1I7QUFDOUI7QUFDaUI7QUFFNUMsaUVBQWVBLGdEQUFRQSxDQUFDO0lBQ3RCSyxTQUFTSCx3RUFBYUEsQ0FBQ0UsK0NBQU1BO0lBQzdCRSxPQUFPO1FBQUVDLFFBQVE7SUFBZTtJQUNoQ0MsU0FBUztRQUFFQyxVQUFVO0lBQU07SUFDM0JDLFdBQVc7UUFDVFQsc0VBQW1CQSxDQUFDO1lBQ2xCVSxNQUFNO1lBQ05DLGFBQWE7Z0JBQ1hDLFdBQVc7b0JBQUVDLE9BQU87b0JBQXFCQyxNQUFNO2dCQUFPO2dCQUN0REMsVUFBVTtvQkFBRUYsT0FBTztvQkFBY0MsTUFBTTtnQkFBVztZQUNwRDtZQUNBLE1BQU1FLFdBQVVDLEtBQUs7Z0JBQ25CLElBQUksQ0FBQ0EsT0FBT0wsYUFBYSxDQUFDSyxNQUFNRixRQUFRLEVBQUUsT0FBTztnQkFFakQsTUFBTUcsT0FBTyxNQUFNZiwrQ0FBTUEsQ0FBQ2dCLE9BQU8sQ0FBQ0MsU0FBUyxDQUFDO29CQUMxQ0MsT0FBTzt3QkFDTEMsSUFBSTs0QkFDRjtnQ0FBRVYsV0FBV0ssTUFBTUwsU0FBUzs0QkFBQzs0QkFDN0I7Z0NBQUVXLE9BQU9OLE1BQU1MLFNBQVM7NEJBQUM7eUJBQzFCO29CQUNIO2dCQUNGO2dCQUNBLElBQUksQ0FBQ00sUUFBUSxDQUFDQSxLQUFLTSxTQUFTLEVBQUUsT0FBTztnQkFFckMsTUFBTUMsVUFBVSxNQUFNdkIscURBQWMsQ0FBQ2UsTUFBTUYsUUFBUSxFQUFFRyxLQUFLSCxRQUFRO2dCQUNsRSxJQUFJLENBQUNVLFNBQVMsT0FBTztnQkFFckIseUNBQXlDO2dCQUN6QyxPQUFPO29CQUNMRSxJQUFJVCxLQUFLUyxFQUFFLENBQUNDLFFBQVE7b0JBQ3BCbEIsTUFBTSxHQUFHUSxLQUFLVyxNQUFNLENBQUMsQ0FBQyxFQUFFWCxLQUFLWSxRQUFRLEVBQUU7b0JBQ3ZDUCxPQUFPTCxLQUFLSyxLQUFLO29CQUNqQlEsS0FBS2IsS0FBS2EsR0FBRztnQkFDZjtZQUNGO1FBQ0Y7S0FDRDtJQUNEQyxXQUFXO1FBQ1QsK0JBQStCO1FBQy9CLE1BQU1DLEtBQUksRUFBRUMsS0FBSyxFQUFFaEIsSUFBSSxFQUFFO1lBQ3ZCLElBQUlBLE1BQU07Z0JBQ1JnQixNQUFNSCxHQUFHLEdBQUcsS0FBY0EsR0FBRztZQUMvQjtZQUNBLE9BQU9HO1FBQ1Q7UUFDQSxtQ0FBbUM7UUFDbkMsTUFBTTNCLFNBQVEsRUFBRUEsT0FBTyxFQUFFMkIsS0FBSyxFQUFFOztZQUM1QjNCLFFBQVFXLElBQUksQ0FBU2EsR0FBRyxHQUFHRyxNQUFNSCxHQUFHO1lBQ3RDLE9BQU94QjtRQUNUO0lBQ0Y7SUFDQSw0Q0FBNEM7SUFDNUMscUNBQXFDO0lBQ3JDLG9EQUFvRDtJQUNwRDRCLFFBQVFDLFFBQVFDLEdBQUcsQ0FBQ0MsZUFBZTtBQUNyQyxFQUFFIiwic291cmNlcyI6WyJDOlxcVXNlcnNcXFBSdWViYVxcaW52ZW50YXJpby11bnBodVxccGFnZXNcXGFwaVxcYXV0aFxcWy4uLm5leHRhdXRoXS50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBwYWdlcy9hcGkvYXV0aC9bLi4ubmV4dGF1dGhdLnRzXHJcbmltcG9ydCBOZXh0QXV0aCBmcm9tICduZXh0LWF1dGgnXHJcbmltcG9ydCBDcmVkZW50aWFsc1Byb3ZpZGVyIGZyb20gJ25leHQtYXV0aC9wcm92aWRlcnMvY3JlZGVudGlhbHMnXHJcbmltcG9ydCB7IFByaXNtYUFkYXB0ZXIgfSBmcm9tICdAbmV4dC1hdXRoL3ByaXNtYS1hZGFwdGVyJ1xyXG5pbXBvcnQgYmNyeXB0IGZyb20gJ2JjcnlwdCdcclxuaW1wb3J0IHsgcHJpc21hIH0gZnJvbSAnLi4vLi4vLi4vbGliL3ByaXNtYSdcclxuXHJcbmV4cG9ydCBkZWZhdWx0IE5leHRBdXRoKHtcclxuICBhZGFwdGVyOiBQcmlzbWFBZGFwdGVyKHByaXNtYSksXHJcbiAgcGFnZXM6IHsgc2lnbkluOiAnL2F1dGgvc2lnbmluJyB9LFxyXG4gIHNlc3Npb246IHsgc3RyYXRlZ3k6ICdqd3QnIH0sXHJcbiAgcHJvdmlkZXJzOiBbXHJcbiAgICBDcmVkZW50aWFsc1Byb3ZpZGVyKHtcclxuICAgICAgbmFtZTogJ0NyZWRlbmNpYWxlcycsXHJcbiAgICAgIGNyZWRlbnRpYWxzOiB7XHJcbiAgICAgICAgbWF0cmljdWxhOiB7IGxhYmVsOiAnTWF0csOtY3VsYSBvIEVtYWlsJywgdHlwZTogJ3RleHQnIH0sXHJcbiAgICAgICAgcGFzc3dvcmQ6IHsgbGFiZWw6ICdDb250cmFzZcOxYScsIHR5cGU6ICdwYXNzd29yZCcgfSxcclxuICAgICAgfSxcclxuICAgICAgYXN5bmMgYXV0aG9yaXplKGNyZWRzKSB7XHJcbiAgICAgICAgaWYgKCFjcmVkcz8ubWF0cmljdWxhIHx8ICFjcmVkcy5wYXNzd29yZCkgcmV0dXJuIG51bGxcclxuXHJcbiAgICAgICAgY29uc3QgdXNlciA9IGF3YWl0IHByaXNtYS51c3VhcmlvLmZpbmRGaXJzdCh7XHJcbiAgICAgICAgICB3aGVyZToge1xyXG4gICAgICAgICAgICBPUjogW1xyXG4gICAgICAgICAgICAgIHsgbWF0cmljdWxhOiBjcmVkcy5tYXRyaWN1bGEgfSxcclxuICAgICAgICAgICAgICB7IGVtYWlsOiBjcmVkcy5tYXRyaWN1bGEgfSxcclxuICAgICAgICAgICAgXSxcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgfSlcclxuICAgICAgICBpZiAoIXVzZXIgfHwgIXVzZXIuY29uZmlybWVkKSByZXR1cm4gbnVsbFxyXG5cclxuICAgICAgICBjb25zdCBpc1ZhbGlkID0gYXdhaXQgYmNyeXB0LmNvbXBhcmUoY3JlZHMucGFzc3dvcmQsIHVzZXIucGFzc3dvcmQpXHJcbiAgICAgICAgaWYgKCFpc1ZhbGlkKSByZXR1cm4gbnVsbFxyXG5cclxuICAgICAgICAvLyDwn5GJIERldnVlbHZlIGVsIGNhbXBvIFwicm9sXCIgKG5vIFwicm9sZVwiKVxyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICBpZDogdXNlci5pZC50b1N0cmluZygpLFxyXG4gICAgICAgICAgbmFtZTogYCR7dXNlci5ub21icmV9ICR7dXNlci5hcGVsbGlkb31gLFxyXG4gICAgICAgICAgZW1haWw6IHVzZXIuZW1haWwsXHJcbiAgICAgICAgICByb2w6IHVzZXIucm9sLFxyXG4gICAgICAgIH1cclxuICAgICAgfSxcclxuICAgIH0pLFxyXG4gIF0sXHJcbiAgY2FsbGJhY2tzOiB7XHJcbiAgICAvLyBHdWFyZGFtb3MgZWwgcm9sIGVuIGVsIHRva2VuXHJcbiAgICBhc3luYyBqd3QoeyB0b2tlbiwgdXNlciB9KSB7XHJcbiAgICAgIGlmICh1c2VyKSB7XHJcbiAgICAgICAgdG9rZW4ucm9sID0gKHVzZXIgYXMgYW55KS5yb2xcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gdG9rZW5cclxuICAgIH0sXHJcbiAgICAvLyBMbyBleHBvbmVtb3MgZW4gc2Vzc2lvbi51c2VyLnJvbFxyXG4gICAgYXN5bmMgc2Vzc2lvbih7IHNlc3Npb24sIHRva2VuIH0pIHtcclxuICAgICAgOyhzZXNzaW9uLnVzZXIgYXMgYW55KS5yb2wgPSB0b2tlbi5yb2xcclxuICAgICAgcmV0dXJuIHNlc3Npb25cclxuICAgIH0sXHJcbiAgfSxcclxuICAvLyBBc2Vnw7pyYXRlIGRlIHRlbmVyIGVzdG8gZW4gdHUgLmVudi5sb2NhbDpcclxuICAvLyBORVhUQVVUSF9VUkw9aHR0cDovL2xvY2FsaG9zdDozMDAwXHJcbiAgLy8gTkVYVEFVVEhfU0VDUkVUPTx1bmEgY2FkZW5hIGxhcmdhIGRlIHR1IGVsZWNjacOzbj5cclxuICBzZWNyZXQ6IHByb2Nlc3MuZW52Lk5FWFRBVVRIX1NFQ1JFVCxcclxufSlcclxuIl0sIm5hbWVzIjpbIk5leHRBdXRoIiwiQ3JlZGVudGlhbHNQcm92aWRlciIsIlByaXNtYUFkYXB0ZXIiLCJiY3J5cHQiLCJwcmlzbWEiLCJhZGFwdGVyIiwicGFnZXMiLCJzaWduSW4iLCJzZXNzaW9uIiwic3RyYXRlZ3kiLCJwcm92aWRlcnMiLCJuYW1lIiwiY3JlZGVudGlhbHMiLCJtYXRyaWN1bGEiLCJsYWJlbCIsInR5cGUiLCJwYXNzd29yZCIsImF1dGhvcml6ZSIsImNyZWRzIiwidXNlciIsInVzdWFyaW8iLCJmaW5kRmlyc3QiLCJ3aGVyZSIsIk9SIiwiZW1haWwiLCJjb25maXJtZWQiLCJpc1ZhbGlkIiwiY29tcGFyZSIsImlkIiwidG9TdHJpbmciLCJub21icmUiLCJhcGVsbGlkbyIsInJvbCIsImNhbGxiYWNrcyIsImp3dCIsInRva2VuIiwic2VjcmV0IiwicHJvY2VzcyIsImVudiIsIk5FWFRBVVRIX1NFQ1JFVCJdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(api-node)/./pages/api/auth/[...nextauth].ts\n");

/***/ }),

/***/ "@next-auth/prisma-adapter":
/*!********************************************!*\
  !*** external "@next-auth/prisma-adapter" ***!
  \********************************************/
/***/ ((module) => {

module.exports = require("@next-auth/prisma-adapter");

/***/ }),

/***/ "@prisma/client":
/*!*********************************!*\
  !*** external "@prisma/client" ***!
  \*********************************/
/***/ ((module) => {

module.exports = require("@prisma/client");

/***/ }),

/***/ "bcrypt":
/*!*************************!*\
  !*** external "bcrypt" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("bcrypt");

/***/ }),

/***/ "next-auth":
/*!****************************!*\
  !*** external "next-auth" ***!
  \****************************/
/***/ ((module) => {

module.exports = require("next-auth");

/***/ }),

/***/ "next-auth/providers/credentials":
/*!**************************************************!*\
  !*** external "next-auth/providers/credentials" ***!
  \**************************************************/
/***/ ((module) => {

module.exports = require("next-auth/providers/credentials");

/***/ }),

/***/ "next/dist/compiled/next-server/pages-api.runtime.dev.js":
/*!**************************************************************************!*\
  !*** external "next/dist/compiled/next-server/pages-api.runtime.dev.js" ***!
  \**************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/compiled/next-server/pages-api.runtime.dev.js");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../webpack-api-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next"], () => (__webpack_exec__("(api-node)/./node_modules/next/dist/build/webpack/loaders/next-route-loader/index.js?kind=PAGES_API&page=%2Fapi%2Fauth%2F%5B...nextauth%5D&preferredRegion=&absolutePagePath=.%2Fpages%5Capi%5Cauth%5C%5B...nextauth%5D.ts&middlewareConfigBase64=e30%3D!")));
module.exports = __webpack_exports__;

})();