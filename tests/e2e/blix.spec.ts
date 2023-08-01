import { _electron as electron } from "playwright";
import { test, expect } from "@playwright/test";
import { join } from "path";
import { waitForDebugger } from "inspector";
import exp from "constants";

test('E2E testing blix', async () => {

  const electronApp = await electron.launch({ args: ['.']})
  const isPackaged = await electronApp.evaluate(async ({ app }) => {
    // This runs in Electron's main process, parameter here is always
    // the result of the require('electron') in the main app script.
    return app.isPackaged
  })
  electronApp.on('window', async (page) => {
    const filename = page.url()?.split('/').pop()
    console.log(`Window opened: ${filename}`)

    // capture errors
    page.on('pageerror', (error) => {
      console.error(error)
    })
    // capture console messages
    page.on('console', (msg) => {
      console.log(msg.text())
    })
  })

  // expect(isPackaged).toBe(false);

  // Wait for the first BrowserWindow to open
  // and return its Page object
  const window = await electronApp.firstWindow();

  window.on('load', async () => {
    await window.keyboard.press('Escape');
  });

  await window.locator('svg').first().focus();

  //expect((await window.getByTitle('Untitled').allInnerTexts())).toBe("Untitled");

  //await window.locator('span').nth(1).click();
  //await window.getByRole('listitem').getByText('Graph').click();

  const graph = await window.locator('section');
  await graph.first().click({button: 'right'});

  function delay(ms: number) {
      return new Promise( resolve => setTimeout(resolve, ms) );
  }

  // Check plugin menu
  const plugin = window.getByText('blix');
  expect((await plugin.allInnerTexts()).at(0)).toBe("blix");
  expect((await window.getByText('hello-plugin').allInnerTexts()).at(0)).toBe("hello-plugin");
  expect((await window.getByText('math-plugin').allInnerTexts()).at(0)).toBe("math-plugin");
  expect((await window.getByText('input-plugin').allInnerTexts()).at(0)).toBe("input-plugin");
  expect((await window.getByText('sharp-plugin').allInnerTexts()).at(0)).toBe("sharp-plugin");

  // Check add node to graph
  await plugin.click();
  await window.getByTitle('Output').click();
  await window.getByText('Output').first().click({button: 'right'});

  expect((await window.locator('Output').allInnerTexts()).at(0)).toBe(undefined);

  // Connect edges
  await graph.first().click({button: 'right'});
  await plugin.click();
  await window.getByText('Output').click();

  await delay(1000);
  await graph.first().click({button: 'right'});
  await window.getByText('input-plugin').first().click();
  await window.getByText('Input number').click();

  await window.locator('css=div.svelvet-anchor').nth(1).dragTo(window.locator('css=div.svelvet-anchor').first());

  expect((await window.locator('css=div.output.normal').allInnerTexts()).at(0)).toBe("0");

  // Check add graph
  await window.getByText('Graph').click();
  expect((await window.getByText('Graph', { exact: true }).allInnerTexts()).length).toBe(2);
  await window.getByTitle('Add Graph').getByRole('img').click();
  expect((await window.getByText('Graph', { exact: true }).allInnerTexts()).length).toBe(2);


  // close app
  await electronApp.close()
})