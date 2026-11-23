import { inject, provideAppInitializer } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import add from '@material-symbols/svg-400/outlined/add.svg';
import deleteIcon from '@material-symbols/svg-400/outlined/delete.svg';
import edit from '@material-symbols/svg-400/outlined/edit.svg';
import playlistAdd from '@material-symbols/svg-400/outlined/playlist_add.svg';
import restartAlt from '@material-symbols/svg-400/outlined/restart_alt.svg';

const icons = {
  add,
  delete: deleteIcon,
  edit,
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
