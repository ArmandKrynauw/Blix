import type { Registry, RegistryInstance } from "../Registry";

interface Command {
  signature: string;
  displayName: string;
  description: string;
  icon: string;
}

export class CommandRegistry implements Registry {
  private registry: { [key: string]: CommandInstance } = {};

  addInstance(instance: CommandInstance): void {
    this.registry[instance.signature] = instance;
  }

  getRegistry(): { [key: string]: CommandInstance } {
    return this.registry;
  }

  getCommandNames(): string[] {
    return Object.keys(this.registry);
  }

  getCommands(): Command[] {
    const commands: Command[] = [];
    for (const command in this.registry) {
      if (!this.registry.hasOwnProperty(command)) continue;

      const commandInstance: CommandInstance = this.registry[command];
      const commandObject = {
        signature: commandInstance.signature,
        displayName: commandInstance.displayName,
        description: commandInstance.description,
        icon: commandInstance.icon,
      };
      commands.push(commandObject);
    }
    return commands;
  }

  runCommand(command: string) {
    this.registry[command].run();
  }
}

export class CommandInstance implements RegistryInstance {
  constructor(
    private readonly _plugin: string,
    private readonly _name: string,
    private readonly _displayName: string,
    private readonly _description: string,
    private readonly _icon: string,
    private readonly _command: any
  ) {}

  get id(): string {
    return this.id;
  }

  get signature(): string {
    // TODO create unique
    return this._plugin + "." + this._name;
  }

  get name(): string {
    return this._name;
  }

  get run(): any {
    return this._command;
  }

  get displayName(): string {
    return this._displayName;
  }

  get description(): string {
    return this._description;
  }

  get icon(): string {
    return this._icon;
  }
}