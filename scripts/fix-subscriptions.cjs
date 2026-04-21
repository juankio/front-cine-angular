const fs = require('fs');
const glob = require('glob');
const path = require('path');

const tsFilesGlob = 'src/**/*.ts';

// Find all TypeScript files
const files = glob.sync(tsFilesGlob);

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');

  // Check if it has a .subscribe and is a Component (to avoid services if we only want components)
  if (content.includes('.subscribe(') && content.includes('@angular/core') && content.includes('@Component')) {
    
    let originalContent = content;

    if (!content.includes('takeUntilDestroyed')) {
      content = `import { takeUntilDestroyed } from '@angular/core/rxjs-interop';\n` + content;
    }

    if (!content.includes('DestroyRef')) {
      content = content.replace(/import\s+{([^}]*)}\s+from\s+['"]@angular\/core['"];/, (match, group1) => {
        if (!group1.includes('DestroyRef')) {
          return `import { ${group1}, DestroyRef } from '@angular/core';`;
        }
        return match;
      });
      if (!content.includes('DestroyRef')) {
          content = `import { DestroyRef } from '@angular/core';\n` + content;
      }
    }

    if (!/\binject\b/.test(content)) {
         content = content.replace(/import\s+{([^}]*)}\s+from\s+['"]@angular\/core['"];/, (match, group1) => {
           return `import { ${group1}, inject } from '@angular/core';`;
         });
    }

    const classRegex = /export\s+class\s+[a-zA-Z0-9_]+(?:\s+implements\s+[a-zA-Z0-9_,\s]+)?\s*\{/;
    const classMatch = content.match(classRegex);

    if (classMatch) {
      const classStart = classMatch.index + classMatch[0].length;
      const part1 = content.slice(0, classStart);
      const part2 = content.slice(classStart);

      if (!content.includes('destroyRef = inject(DestroyRef)')) {
        content = part1 + `\n  private destroyRef = inject(DestroyRef);` + part2;
      }
    }

    // Replace `.subscribe(` with `.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(`
    // BUT only if it is not already followed by pipe or something (basic check)
    // Actually, sometimes they might already have a .pipe(...).subscribe(
    // If they already have .pipe(..., we should inject takeUntilDestroyed there?
    // Let's do a simple regex for now:
    // If we find `.pipe(`, we could replace `.subscribe(` with `.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(` ... wait, that makes `.pipe(...).pipe(takeUntilDestroyed...).subscribe(` which is VALID!
    // Yes, multiple `.pipe()` calls are perfectly valid RxJS syntax, though `.pipe(..., takeUntilDestroyed)` is better.
    // So `.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(` is always valid!
    
    content = content.replace(/\.subscribe\(/g, '.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(');

    if (originalContent !== content) {
        fs.writeFileSync(file, content, 'utf8');
        console.log(`Updated ${file}`);
    }
  }
}
