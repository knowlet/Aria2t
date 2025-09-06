(function () {
    'use strict';

    angular.module('ariaNg').factory('ariaNgNativeElectronService', ['$window', '$q', 'ariaNgLogService', 'ariaNgLocalizationService', function ($window, $q, ariaNgLogService, ariaNgLocalizationService) {
        var electron = angular.isFunction(window.nodeRequire) ? nodeRequire('electron') : {};
        var ipcRenderer = electron.ipcRenderer || {};
        var hasIpcSend = !!(ipcRenderer && ipcRenderer.send);
        var hasIpcSync = !!(ipcRenderer && ipcRenderer.sendSync);
        var hasIpcInvoke = !!(ipcRenderer && ipcRenderer.invoke);

        var onMainProcessEvent = function (channel, callback) {
            ipcRenderer.on && ipcRenderer.on(channel, callback);
        };

        var removeMainProcessEvent = function (channel, callback) {
            ipcRenderer.removeListener && ipcRenderer.removeListener(channel, callback);
        };

        var invokeMainProcessMethod = function (channel, ...args) {
            if (hasIpcSend) {
                ipcRenderer.send(channel, ...args);
            }
        };

        var invokeMainProcessMethodSync = function (channel, ...args) {
            if (!hasIpcSync) {
                return null;
            }

            return ipcRenderer.sendSync(channel, ...args);
        };

        var invokeMainProcessMethodAsync = function (channel, ...args) {
            if (!hasIpcInvoke) {
                return null;
            }

            return ipcRenderer.invoke(channel, ...args);
        };

        onMainProcessEvent('on-main-log-debug', function (event, msg, obj) {
            ariaNgLogService.debug(msg, obj);
        });

        onMainProcessEvent('on-main-log-info', function (event, msg, obj) {
            ariaNgLogService.info(msg, obj);
        });

        onMainProcessEvent('on-main-log-warn', function (event, msg, obj) {
            ariaNgLogService.warn(msg, obj);
        });

        onMainProcessEvent('on-main-log-error', function (event, msg, obj) {
            ariaNgLogService.error(msg, obj);
        });

        invokeMainProcessMethod('on-render-electron-service-inited');

        return {
            getRuntimeEnvironment: function () {
                var env = invokeMainProcessMethodSync('render-sync-get-runtime-environment');
                return env || 'tauri';
            },
            getVersion: function() {
                var v = invokeMainProcessMethodSync('render-sync-get-global-setting', 'version');
                if (v) { return v; }
                try {
                    if ($window.__TAURI__ && $window.__TAURI__.app && $window.__TAURI__.app.getVersion) {
                        // Tauri API is async; we cannot block synchronously here, so return a placeholder.
                        // Consumers only display this; fallback to static string.
                        return '0.1.0';
                    }
                } catch (e) {}
                return '0.1.0';
            },
            getAriaNgVersion: function() {
                var v = invokeMainProcessMethodSync('render-sync-get-global-setting', 'ariaNgVersion');
                return v || '1.3.11';
            },
            getBuildCommit: function () {
                var c = invokeMainProcessMethodSync('render-sync-get-global-setting', 'buildCommit');
                return c || '';
            },
            isDevMode: function () {
                var d = invokeMainProcessMethodSync('render-sync-get-global-setting', 'isDevMode');
                return !!d;
            },
            useCustomAppTitle: function () {
                var t = invokeMainProcessMethodSync('render-sync-get-global-setting', 'useCustomAppTitle');
                return !!t;
            },
            setNativeTheme: function (theme) {
                invokeMainProcessMethod('render-set-native-theme', theme);
            },
            updateTitleBarBackgroundColor: function () {
                var titleBar = angular.element('#window-title-bar');

                if (!titleBar || !titleBar[0]) {
                    return;
                }

                var computedStyle = $window.getComputedStyle(titleBar[0]);
                var backgroundColor = computedStyle.getPropertyValue('background-color');
                var symbolColor = computedStyle.getPropertyValue('color');
                invokeMainProcessMethod('render-set-titlebar-color', backgroundColor, symbolColor);
            },
            updateTitleBarBackgroundColorWithSweetAlertOverlay: function () {
                var titleBar = angular.element('#window-title-bar');

                if (!titleBar || !titleBar[0]) {
                    return;
                }

                var computedStyle = $window.getComputedStyle(titleBar[0]);
                var backgroundColor = computedStyle.getPropertyValue('background-color');
                var symbolColor = computedStyle.getPropertyValue('color');

                // This electron version not support transparent title bar, so we set hard code color
                var currentTheme = angular.element('body').hasClass('theme-dark') ? 'dark' : 'light';

                if (currentTheme === 'light') {
                    backgroundColor = 'rgb(148, 148, 148)';
                } else if (currentTheme === 'dark') {
                    backgroundColor = 'rgb(7, 7, 7)';
                }

                invokeMainProcessMethod('render-set-titlebar-color', backgroundColor, symbolColor);
            },
            updateTitleBarBackgroundColorWithModalOverlay: function () {
                var titleBar = angular.element('#window-title-bar');

                if (!titleBar || !titleBar[0]) {
                    return;
                }

                var computedStyle = $window.getComputedStyle(titleBar[0]);
                var backgroundColor = computedStyle.getPropertyValue('background-color');
                var symbolColor = computedStyle.getPropertyValue('color');

                // This electron version not support transparent title bar, so we set hard code color
                var currentTheme = angular.element('body').hasClass('theme-dark') ? 'dark' : 'light';

                if (currentTheme === 'light') {
                    backgroundColor = 'rgb(86, 86, 86)';
                } else if (currentTheme === 'dark') {
                    backgroundColor = 'rgb(6, 6, 6)';
                }

                invokeMainProcessMethod('render-set-titlebar-color', backgroundColor, symbolColor);
            },
            reload: function () {
                invokeMainProcessMethod('render-reload-native-window');
            },
            showTextboxContextMenu: function (context) {
                invokeMainProcessMethod('render-show-textbox-context-menu', context);
            },
            showSystemNotification: function (context) {
                invokeMainProcessMethod('render-show-system-notification', context);
            },
            setApplicationMenu: function () {
                invokeMainProcessMethod('render-update-app-menu-label', {
                    AboutAriaNgNative: ariaNgLocalizationService.getLocalizedText('menu.AboutAriaNgNative'),
                    Services: ariaNgLocalizationService.getLocalizedText('menu.Services'),
                    HideAriaNgNative: ariaNgLocalizationService.getLocalizedText('menu.HideAriaNgNative'),
                    HideOthers: ariaNgLocalizationService.getLocalizedText('menu.HideOthers'),
                    ShowAll: ariaNgLocalizationService.getLocalizedText('menu.ShowAll'),
                    QuitAriaNgNative: ariaNgLocalizationService.getLocalizedText('menu.QuitAriaNgNative'),
                    Edit: ariaNgLocalizationService.getLocalizedText('menu.Edit'),
                    Undo: ariaNgLocalizationService.getLocalizedText('menu.Undo'),
                    Redo: ariaNgLocalizationService.getLocalizedText('menu.Redo'),
                    Cut: ariaNgLocalizationService.getLocalizedText('menu.Cut'),
                    Copy: ariaNgLocalizationService.getLocalizedText('menu.Copy'),
                    Paste: ariaNgLocalizationService.getLocalizedText('menu.Paste'),
                    Delete: ariaNgLocalizationService.getLocalizedText('menu.Delete'),
                    SelectAll: ariaNgLocalizationService.getLocalizedText('menu.SelectAll'),
                    Window: ariaNgLocalizationService.getLocalizedText('menu.Window'),
                    Minimize: ariaNgLocalizationService.getLocalizedText('menu.Minimize'),
                    Zoom: ariaNgLocalizationService.getLocalizedText('menu.Zoom'),
                    BringAllToFront: ariaNgLocalizationService.getLocalizedText('menu.BringAllToFront')
                });
            },
            setTrayMenu: function () {
                invokeMainProcessMethod('render-update-tray-menu-label', {
                    ShowAriaNgNative: ariaNgLocalizationService.getLocalizedText('tray.ShowAriaNgNative'),
                    Exit: ariaNgLocalizationService.getLocalizedText('tray.Exit')
                });
            },
            setTrayToolTip: function (value) {
                invokeMainProcessMethod('render-update-tray-tip', value);
            },
            setMainWindowLanguage: function () {
                this.setApplicationMenu();
                this.setTrayMenu();
            },
            getNativeConfig: function () {
                var config = invokeMainProcessMethodSync('render-sync-get-native-config');
                var cfg = {};

                for (var key in config) {
                    if (!config.hasOwnProperty(key)) {
                        continue;
                    }

                    cfg[key] = angular.copy(config[key]);
                }

                return cfg;
            },
            setDefaultPosition: function (value) {
                invokeMainProcessMethod('render-set-native-config-default-position', value);
            },
            setMinimizedToTray: function (value) {
                invokeMainProcessMethod('render-set-native-config-minimized-to-tray', value);
            },
            setExecCommandOnStartup: function (value) {
                invokeMainProcessMethod('render-set-native-config-exec-command-on-startup', value);
            },
            setExecCommandArgumentsOnStartup: function (value) {
                invokeMainProcessMethod('render-set-native-config-exec-command-arguments-on-startup', value);
            },
            setExecDetachedCommandOnStartup: function (value) {
                invokeMainProcessMethod('render-set-native-config-exec-detached-command-on-startup', value);
            },
            getLastCheckUpdatesTimeAsync: function (callback) {
                return invokeMainProcessMethodAsync('render-get-native-config-last-check-updates-time')
                    .then(function onReceive(lastCheckUpdatesTime) {
                        if (callback) {
                            callback(lastCheckUpdatesTime);
                        }
                    });
            },
            setLastCheckUpdatesTime: function (value) {
                invokeMainProcessMethod('render-set-native-config-last-check-updates-time', value);
            },
            getStartupCommandOutputAsync: function () {
                return invokeMainProcessMethodAsync('render-get-startup-command-process-output');
            },
            requestHttp: function (requestContext) {
                var deferred = $q.defer();

                if (hasIpcInvoke) {
                    invokeMainProcessMethodAsync('render-request-http', requestContext)
                        .then(function onReceive(result) {
                            if (result && result.success) {
                                deferred.resolve(result.response);
                            } else {
                                deferred.reject(result && result.response ? result.response : {});
                            }
                        }).catch(function onError() {
                            deferred.reject({});
                        });

                    return deferred.promise;
                }

                try {
                    var controller = null;
                    var timeout = requestContext && requestContext.timeout;
                    var fetchOptions = {
                        method: requestContext && requestContext.method || 'GET',
                        headers: requestContext && requestContext.headers || {}
                    };
                    if (fetchOptions.method === 'POST' && requestContext && requestContext.data) {
                        fetchOptions.body = requestContext.data;
                    }
                    if (timeout && typeof AbortController !== 'undefined') {
                        controller = new AbortController();
                        fetchOptions.signal = controller.signal;
                        setTimeout(function () {
                            try { controller.abort(); } catch (e) {}
                        }, timeout);
                    }

                    $window.fetch(requestContext.url, fetchOptions).then(function (resp) {
                        return resp.text().then(function (text) {
                            var json = null;
                            try { json = text ? angular.fromJson(text) : null; } catch (e) { json = null; }
                            var responseObj = { data: json, status: resp.status };
                            if (resp.ok) {
                                deferred.resolve(responseObj);
                            } else {
                                deferred.reject(responseObj);
                            }
                        });
                    }).catch(function () {
                        deferred.reject({});
                    });
                } catch (ex) {
                    deferred.reject({});
                }

                return deferred.promise;
            },
            createWebSocketClient: function (rpcUrl, options) {
                if (hasIpcSend || hasIpcSync || hasIpcInvoke) {
                    var WebSocketClient = function (rpcUrl, options) {
                        var openCallback = null;
                        var closeCallback = null;
                        var messageCallback = null;

                        Object.defineProperty(WebSocketClient.prototype, 'readyState', {
                            get: function get() {
                                return invokeMainProcessMethodSync('render-get-websocket-readystate');
                            },
                            set: function set() {
                                throw new Error('The \"readyState\" property is readonly.');
                            }
                        });

                        this.send = function (request) {
                            invokeMainProcessMethod('render-send-websocket-message', {
                                url: rpcUrl,
                                data: request
                            });
                        };

                        this.reconnect = function () {
                            invokeMainProcessMethod('render-reconnect-websocket', rpcUrl, options);
                        };

                        this.onOpen = function (callback) {
                            openCallback = callback;
                        };

                        this.onClose = function (callback) {
                            closeCallback = callback;
                        };

                        this.onMessage = function (callback) {
                            messageCallback = callback;
                        };

                        onMainProcessEvent('on-main-websocket-open', function (event, e) {
                            if (e.url !== rpcUrl) {
                                ariaNgLogService.debug('[ariaNgNativeElectronService.websocket.onOpen] event dropped, because rpc url not equals, excepted url: ' + rpcUrl + ", actual url: " + e.url);
                                return;
                            }

                            if (angular.isFunction(openCallback)) {
                                openCallback(e);
                            }
                        });

                        onMainProcessEvent('on-main-websocket-close', function (event, e) {
                            if (e.url !== rpcUrl) {
                                ariaNgLogService.debug('[ariaNgNativeElectronService.websocket.onClose] event dropped, because rpc url not equals, excepted url: ' + rpcUrl + ", actual url: " + e.url);
                                return;
                            }

                            if (angular.isFunction(closeCallback)) {
                                closeCallback(e);
                            }
                        });

                        onMainProcessEvent('on-main-websocket-message', function (event, message) {
                            if (message.url !== rpcUrl) {
                                ariaNgLogService.debug('[ariaNgNativeElectronService.websocket.onMessage] event dropped, because rpc url not equals, excepted url: ' + rpcUrl + ", actual url: " + message.url, message.data);
                                return;
                            }

                            if (angular.isFunction(messageCallback)) {
                                messageCallback(message);
                            }
                        });

                        invokeMainProcessMethod('render-connect-websocket', rpcUrl, options);
                    };

                    return new WebSocketClient(rpcUrl, options);
                }

                var BrowserWebSocketClient = function (rpcUrl, options) {
                    var openCallback = null;
                    var closeCallback = null;
                    var messageCallback = null;
                    var ws = null;

                    var connect = function () {
                        try {
                            ws = new $window.WebSocket(rpcUrl);
                        } catch (e) {
                            ariaNgLogService.error('[ariaNgNativeElectronService] cannot create WebSocket', e);
                            return;
                        }

                        ws.onopen = function (e) {
                            if (angular.isFunction(openCallback)) {
                                openCallback({ url: rpcUrl, event: e });
                            }
                        };
                        ws.onclose = function (e) {
                            if (angular.isFunction(closeCallback)) {
                                closeCallback({ url: rpcUrl, event: e, autoReconnect: false });
                            }
                        };
                        ws.onmessage = function (e) {
                            if (angular.isFunction(messageCallback)) {
                                messageCallback({ url: rpcUrl, data: e.data });
                            }
                        };
                    };

                    Object.defineProperty(BrowserWebSocketClient.prototype, 'readyState', {
                        get: function get() {
                            return ws ? ws.readyState : 3; // CLOSED
                        },
                        set: function set() {
                            throw new Error('The \"readyState\" property is readonly.');
                        }
                    });

                    this.send = function (request) {
                        try {
                            if (ws && ws.readyState === 1) { // OPEN
                                ws.send(request);
                            }
                        } catch (e) {}
                    };

                    this.reconnect = function () {
                        try { if (ws) { ws.close(); } } catch (e) {}
                        connect();
                    };

                    this.onOpen = function (callback) { openCallback = callback; };
                    this.onClose = function (callback) { closeCallback = callback; };
                    this.onMessage = function (callback) { messageCallback = callback; };

                    connect();
                };

                return new BrowserWebSocketClient(rpcUrl, options);
            },
            openProjectLink: function () {
                if (hasIpcSend) {
                    invokeMainProcessMethod('render-open-external-url', 'https://github.com/mayswind/AriaNg-Native');
                } else {
                    try { $window.open('https://github.com/mayswind/AriaNg-Native', '_blank'); } catch (e) {}
                }
            },
            openProjectReleaseLink: function () {
                if (hasIpcSend) {
                    invokeMainProcessMethod('render-open-external-url', 'https://github.com/mayswind/AriaNg-Native/releases');
                } else {
                    try { $window.open('https://github.com/mayswind/AriaNg-Native/releases', '_blank'); } catch (e) {}
                }
            },
            readPackageFile: function (path) {
                var content = invokeMainProcessMethodSync('render-sync-get-package-file-content', path);
                if (content) { return content; }
                // In browser/Tauri without Electron, force async HTTP loader path
                throw new Error('readPackageFile not supported');
            },
            getLocalFSFileBufferAsync: function (fullpath, callback) {
                if (hasIpcInvoke) {
                    return invokeMainProcessMethodAsync('render-get-localfs-file-buffer', fullpath)
                        .then(function onReceive(buffer) {
                            if (callback) {
                                callback(buffer);
                            }
                        });
                }
                // Not supported without privileged backend; callback with null
                var deferred = $q.defer();
                $window.setTimeout(function () {
                    if (callback) { callback(null); }
                    deferred.resolve(null);
                }, 0);
                return deferred.promise;
            },
            getLocalFSExistsAsync: function (fullpath, callback) {
                if (hasIpcInvoke) {
                    return invokeMainProcessMethodAsync('render-get-localfs-exists', fullpath)
                        .then(function onReceive(exists) {
                            if (callback) {
                                callback(exists);
                            }
                        });
                }
                var deferred = $q.defer();
                $window.setTimeout(function () {
                    if (callback) { callback(false); }
                    deferred.resolve(false);
                }, 0);
                return deferred.promise;
            },
            openFileInDirectory: function (dir, filename) {
                invokeMainProcessMethod('render-open-local-directory', dir, filename);
            },
            showOpenFileDialogAsync: function (filters, callback) {
                if (hasIpcInvoke) {
                    return invokeMainProcessMethodAsync('render-show-open-file-dialog', filters)
                        .then(function onReceive(result) {
                            if (callback) {
                                callback({
                                    canceled: result.canceled,
                                    filePaths: result.filePaths
                                });
                            }
                        });
                }
                var deferred = $q.defer();
                $window.setTimeout(function () {
                    if (callback) { callback({ canceled: true, filePaths: [] }); }
                    deferred.resolve({ canceled: true, filePaths: [] });
                }, 0);
                return deferred.promise;
            },
            showDevTools: function () {
                invokeMainProcessMethod('render-show-dev-tools');
            },
            showSystemNotification: function (context) {
                if (hasIpcSend) {
                    invokeMainProcessMethod('render-show-system-notification', context);
                    return;
                }
                try {
                    if ("Notification" in $window) {
                        if ($window.Notification.permission === 'granted') {
                            new $window.Notification(context && context.title || 'Notification', { body: context && context.body });
                        } else if ($window.Notification.permission !== 'denied') {
                            $window.Notification.requestPermission().then(function (p) {
                                if (p === 'granted') {
                                    new $window.Notification(context && context.title || 'Notification', { body: context && context.body });
                                }
                            });
                        }
                    }
                } catch (e) {}
            },
            parseBittorrentInfo: function (data) {
                var info = angular.copy(invokeMainProcessMethodSync('render-sync-parse-bittorrent-info', data));

                if (info) {
                    info.type = 'bittorrent';
                    ariaNgLogService.debug('[ariaNgNativeElectronService.parseBittorrentInfo] bittorrent info', info);
                } else {
                    ariaNgLogService.debug('[ariaNgNativeElectronService.parseBittorrentInfo] cannot parse bittorrent info', info);
                }

                return info;
            },
            notifyMainProcessViewLoaded: function (locationPath) {
                invokeMainProcessMethod('on-render-view-content-loaded', locationPath);
            },
            notifyMainProcessorNewDropFile: function (message) {
                invokeMainProcessMethod('on-render-new-drop-file', message);
            },
            notifyMainProcessorNewDropText: function (message) {
                invokeMainProcessMethod('on-render-new-drop-text', message);
            },
            onMainProcessChangeDevMode: function (callback) {
                onMainProcessEvent('on-main-change-dev-mode', callback);
            },
            onMainProcessShowError: function (callback) {
                onMainProcessEvent('on-main-show-error', callback);
            },
            onMainProcessNavigateTo: function (callback) {
                onMainProcessEvent('on-main-navigate-to', callback);
            },
            onMainProcessNewTaskFromFile: function (callback) {
                onMainProcessEvent('on-main-new-task-from-file', callback);
            },
            onMainProcessNewTaskFromText: function (callback) {
                onMainProcessEvent('on-main-new-task-from-text', callback);
            },
            removeMainProcessNewTaskFromFileCallback: function (callback) {
                removeMainProcessEvent('on-main-new-task-from-file', callback);
            },
            removeMainProcessNewTaskFromTextCallback: function (callback) {
                removeMainProcessEvent('on-main-new-task-from-text',  callback);
            }
        };
    }]);
}());
