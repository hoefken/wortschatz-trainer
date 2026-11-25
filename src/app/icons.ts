import { inject, provideAppInitializer } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import add from '@material-symbols/svg-400/outlined/add.svg';
import arrowForward from '@material-symbols/svg-400/outlined/arrow_forward.svg';
import cancel from '@material-symbols/svg-400/outlined/cancel-fill.svg';
import check from '@material-symbols/svg-400/outlined/check.svg';
import checkCircle from '@material-symbols/svg-400/outlined/check_circle-fill.svg';
import close from '@material-symbols/svg-400/outlined/close.svg';
import deleteIcon from '@material-symbols/svg-400/outlined/delete.svg';
import edit from '@material-symbols/svg-400/outlined/edit.svg';
import lock from '@material-symbols/svg-400/outlined/lock.svg';
import playlistAdd from '@material-symbols/svg-400/outlined/playlist_add.svg';
import restartAlt from '@material-symbols/svg-400/outlined/restart_alt.svg';

const icons = {
  add,
  arrow_forward: arrowForward,
  cancel,
  check,
  check_circle: checkCircle,
  close,
  delete: deleteIcon,
  edit,
  lock,
  playlist_add: playlistAdd,
  restart_alt: restartAlt,
};

export function provideIcons() {
  return provideAppInitializer(() => {
    const registry = inject(MatIconRegistry);
    const sanitizer = inject(DomSanitizer);
    for (const [name, svg] of Object.entries(icons)) {
      // Bundled at build time from a pinned package, never user input.
      registry.addSvgIconLiteral(name, sanitizer.bypassSecurityTrustHtml(svg));
    }
  });
}
