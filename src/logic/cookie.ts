export default class {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public storage: any = null;
    constructor() {
        try {
            if (window == parent && ('localStorage' in window) && window.localStorage !== null) {
                this.storage = localStorage;
                this.storage.setItem('test', 0); // Safariのプライベートモードは、できないのにできるって言うからかまをかけてみる。
            }
        } catch (e) {
            this.storage = null;
        }
        if (this.storage === null) {
            // localStorageが使えない場合
            this.storage = {}; // ダミー
            this.storage.getItem = function () { return undefined; };
            this.storage.setItem = function () { return undefined; };

            if (navigator.cookieEnabled) {
                this.storage.hasItem = function (sKey: string) {
                    return (new RegExp('(?:^|;\\s*)' + escape(sKey).replace(/[-.+*]/g, '\\$&') + '\\s*\\=')).test(document.cookie);
                };
                this.storage.getItem = function (sKey: string) {
                    if (!sKey || !(new RegExp('(?:^|;\\s*)' + escape(sKey).replace(/[-.+*]/g, '\\$&') + '\\s*\\=')).test(document.cookie)) { return null; }
                    return unescape(document.cookie.replace(new RegExp('(?:^|.*;\\s*)' + escape(sKey).replace(/[-.+*]/g, '\\$&') + '\\s*\\=\\s*((?:[^;](?!;))*[^;]?).*'), '$1'));
                };
                this.storage.setItem = function (sKey: string, sValue: any) {
                    if (!sKey || /^(?:expires|max-age|path|domain|secure)$/i.test(sKey)) { return; }
                    document.cookie = escape(sKey) + '=' + escape(sValue);
                };
            }
        }
    }
}