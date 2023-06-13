import { writable } from "svelte/store";

function createCommandStore() {
  const { subscribe, set } = writable([]);

  // Called when the command registry changes
  // Automatically updates the value of the store
  function refreshStore(results: any) {
    // console.log(`Registry changed; Got:\n${results}`);
    // TODO: Properly set the new store values
    set([]);
  }

  function addCommands(cmds: any[]) {
    // TODO: Type the parameters & Implement
  }

  function runCommand(cmd: string) {
    return;
  }

  return {
    subscribe,
    addCommands,
    runCommand,
    refreshStore,
  };
}

export const commandStore = createCommandStore();
