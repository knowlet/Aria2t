// Use CommonJS by renaming file to .cjs in package.json script; but since type:module is set,
// explicitly use dynamic import of fs-extra and require via createRequire for path
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
const require = createRequire(import.meta.url);
const fs = require('fs-extra');
const path = require('path');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = __dirname + '/..';
const appDir = path.join(root, 'app');
const vendorDir = path.join(appDir, 'vendor');

function ensureDir(p) {
  if (!fs.existsSync(p)) {
    fs.mkdirpSync(p);
  }
}

function copy(src, dest) {
  ensureDir(path.dirname(dest));
  fs.copyFileSync(src, dest);
}

function main() {
  const nm = path.join(root, 'node_modules');
  if (!fs.existsSync(nm)) {
    console.error('node_modules not found. Run `npm install` first.');
    process.exit(1);
  }

  ensureDir(vendorDir);

  const files = [
    ['bootstrap/dist/css/bootstrap.min.css', 'bootstrap/css/bootstrap.min.css'],
    ['bootstrap/dist/js/bootstrap.min.js', 'bootstrap/js/bootstrap.min.js'],
    ['font-awesome/css/font-awesome.min.css', 'font-awesome/css/font-awesome.min.css'],
    // copy font files used by font-awesome icons
    ['font-awesome/fonts/fontawesome-webfont.eot', 'font-awesome/fonts/fontawesome-webfont.eot'],
    ['font-awesome/fonts/fontawesome-webfont.svg', 'font-awesome/fonts/fontawesome-webfont.svg'],
    ['font-awesome/fonts/fontawesome-webfont.ttf', 'font-awesome/fonts/fontawesome-webfont.ttf'],
    ['font-awesome/fonts/fontawesome-webfont.woff', 'font-awesome/fonts/fontawesome-webfont.woff'],
    ['font-awesome/fonts/fontawesome-webfont.woff2', 'font-awesome/fonts/fontawesome-webfont.woff2'],
    ['font-awesome/fonts/FontAwesome.otf', 'font-awesome/fonts/FontAwesome.otf'],
    ['admin-lte/dist/css/AdminLTE.min.css', 'admin-lte/css/AdminLTE.min.css'],
    ['sweetalert/dist/sweetalert.css', 'sweetalert/sweetalert.css'],
    ['awesome-bootstrap-checkbox/awesome-bootstrap-checkbox.css', 'awesome-bootstrap-checkbox/awesome-bootstrap-checkbox.css'],
    ['angular/angular-csp.css', 'angular/angular-csp.css'],
    ['angular-ui-notification/dist/angular-ui-notification.min.css', 'angular-ui-notification/angular-ui-notification.min.css'],
    ['angular-busy/dist/angular-busy.min.css', 'angular-busy/angular-busy.min.css'],
    ['angular-input-dropdown/inputDropdownStyles.css', 'angular-input-dropdown/inputDropdownStyles.css'],
    ['angularjs-dragula/dist/dragula.min.css', 'dragula/dragula.min.css'],
    ['jquery/dist/jquery.min.js', 'jquery/jquery.min.js'],
    ['angular/angular.min.js', 'angular/angular.min.js'],
    ['angular-route/angular-route.min.js', 'angular/angular-route.min.js'],
    ['angular-sanitize/angular-sanitize.min.js', 'angular/angular-sanitize.min.js'],
    ['angular-touch/angular-touch.min.js', 'angular/angular-touch.min.js'],
    ['angular-messages/angular-messages.min.js', 'angular/angular-messages.min.js'],
    ['angular-cookies/angular-cookies.min.js', 'angular/angular-cookies.min.js'],
    ['angular-animate/angular-animate.min.js', 'angular/angular-animate.min.js'],
    ['moment/min/moment.min.js', 'moment/moment.min.js'],
    ['moment/locale/zh-cn.js', 'moment/locale/zh-cn.js'],
    ['moment/locale/zh-tw.js', 'moment/locale/zh-tw.js'],
    ['echarts/dist/echarts.common.min.js', 'echarts/echarts.common.min.js'],
    ['admin-lte/dist/js/adminlte.js', 'admin-lte/adminlte.js'],
    ['jquery-slimscroll/jquery.slimscroll.min.js', 'jquery-slimscroll/jquery.slimscroll.min.js'],
    ['sweetalert/dist/sweetalert.min.js', 'sweetalert/sweetalert.min.js'],
    ['bootstrap-contextmenu/bootstrap-contextmenu.js', 'bootstrap-contextmenu/bootstrap-contextmenu.js'],
    ['natural-compare/index.js', 'natural-compare/index.js'],
    ['angular-translate/dist/angular-translate.min.js', 'angular-translate/angular-translate.min.js'],
    ['angular-moment/angular-moment.min.js', 'angular-moment/angular-moment.min.js'],
    ['angular-websocket/dist/angular-websocket.min.js', 'angular-websocket/angular-websocket.min.js'],
    ['angular-utf8-base64/angular-utf8-base64.js', 'angular-utf8-base64/angular-utf8-base64.js'],
    ['angular-local-storage/dist/angular-local-storage.min.js', 'angular-local-storage/angular-local-storage.min.js'],
    ['angular-ui-notification/dist/angular-ui-notification.min.js', 'angular-ui-notification/angular-ui-notification.min.js'],
    ['angular-bittorrent-peerid/angular-bittorrent-peerid.min.js', 'angular-bittorrent-peerid/angular-bittorrent-peerid.min.js'],
    ['angular-busy/dist/angular-busy.min.js', 'angular-busy/angular-busy.min.js'],
    ['angular-promise-buttons/dist/angular-promise-buttons.min.js', 'angular-promise-buttons/angular-promise-buttons.min.js'],
    ['angular-clipboard/angular-clipboard.js', 'angular-clipboard/angular-clipboard.js'],
    ['angular-input-dropdown/inputDropdown.js', 'angular-input-dropdown/inputDropdown.js'],
    ['angularjs-dragula/dist/angularjs-dragula.min.js', 'dragula/angularjs-dragula.min.js'],
    ['angular-sweetalert/SweetAlert.js', 'angular-sweetalert/SweetAlert.js']
  ];

  files.forEach(([srcRel, destRel]) => {
    const src = path.join(root, 'node_modules', srcRel);
    const dest = path.join(vendorDir, destRel);
    if (!fs.existsSync(src)) {
      console.warn('missing dependency file:', srcRel);
      return;
    }
    copy(src, dest);
  });
}

main();


