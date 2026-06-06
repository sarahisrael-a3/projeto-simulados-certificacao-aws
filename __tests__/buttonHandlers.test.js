import { readFileSync } from 'node:fs';

const indexHtml = readFileSync(
  new URL('../public/index.html', import.meta.url),
  'utf8',
);
const appSource = readFileSync(
  new URL('../src/frontend/js/app.js', import.meta.url),
  'utf8',
);

describe('primary button handlers', () => {
  test.each([
    ['btn-start-journey', 'startJornada'],
    ['btn-start-diagnostic', 'startDiagnostic'],
    ['sprint-start-btn', 'startMicroSprint'],
  ])('%s uses one module listener without legacy onclick', (id, handler) => {
    const buttonPattern = new RegExp(
      `<button[^>]*id="${id}"[^>]*>`,
      's',
    );
    const button = indexHtml.match(buttonPattern)?.[0];
    const binding = `bindClick("${id}", ${handler});`;

    expect(button).toBeDefined();
    expect(button).not.toContain('onclick=');
    expect(appSource.split(binding)).toHaveLength(2);
  });
});
