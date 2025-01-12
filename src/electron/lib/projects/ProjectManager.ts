import { CoreProject } from "./CoreProject";
import logger from "../../utils/logger";
import { join } from "path";
import { app } from "electron";
import type { PathLike } from "fs";
import type { UUID } from "../../../shared/utils/UniqueEntity";
import type { MainWindow } from "../api/apis/WindowApi";
import { readFile } from "fs/promises";
import { z } from "zod";

export class ProjectManager {
  private _projects: { [id: string]: CoreProject };
  private _mainWindow: MainWindow;

  constructor(mainWindow: MainWindow) {
    this._mainWindow = mainWindow;
    this._projects = {};
  }

  /**
   *	Creates a new CoreProject with the given name and a starter layout.
   *
   *	@param name The name of the project.
   *
   *	@returns The newly created project.
   */
  public createProject(name = "Untitled"): CoreProject {
    const project = new CoreProject(name);
    this._projects[project.uuid] = project;
    this.onProjectCreated(project.uuid);
    return project;
  }

  /**
   * This function will load a project that is stored on a user's device.
   *
   * @param fileName Project name derived from file name
   * @param fileContent Project file content
   * @param path Path to project file
   * @returns UUID of new CoreProject
   */
  public loadProject(fileName: string, path: PathLike): UUID {
    const project = new CoreProject(fileName);
    project.location = path;
    this._projects[project.uuid] = project;
    this.onProjectCreated(project.uuid);
    return project.uuid;
  }

  public getProject(id: UUID): CoreProject | null {
    return this._projects[id];
  }

  public removeProject(uuid: UUID) {
    delete this._projects[uuid];
    this.onProjectRemoved(uuid);
  }

  public getOpenProjects() {
    return Object.values(this._projects);
  }

  public renameProject(uuid: UUID, name: string): boolean {
    if (this._projects.hasOwnProperty(uuid)) {
      return this._projects[uuid].rename(name);
    } else {
      return false;
    }
  }

  // public async getRecentProjectsList(): Promise<RecentProject[]> {
  //   try {
  //     const filePath = join(app.getPath("userData"), "recentProjects.json");
  //     const contents = await readFile(filePath, "utf8");
  //     return recentProjectsSchema.parse(JSON.parse(contents)).projects;
  //   } catch (err) {
  //     logger.error("Could not retrieve recent project list");
  //     return [];
  //   }
  // }

  public onProjectCreated(projectId: UUID) {
    const project = this._projects[projectId];
    if (!project) return;
    this._mainWindow.apis.projectClientApi.onProjectCreated(project.toSharedProject());
  }

  public onProjectChanged(projectId: UUID) {
    const project = this._projects[projectId];
    if (!project) return;
    this._mainWindow.apis.projectClientApi.onProjectChanged(project.toSharedProject());
  }

  public onProjectRemoved(projectId: UUID) {
    this._mainWindow.apis.projectClientApi.onProjectRemoved(projectId);
  }

  // validateProjectFile(data: any): boolean {
  //   // if(!data.id || !data.name || !data.layout) return false;
  //   return true;
  // }

  /**
   * Adds a graph to a project.
   *
   * @param projectId - The UUID of the project to add the graph to.
   * @param graphId - The UUID of the graph to add.
   */
  public addGraph(projectId: UUID, graphId: UUID): boolean {
    const project = this._projects[projectId];

    if (project) {
      project.addGraph(graphId);
      this.onProjectChanged(project.uuid);
      return true;
    }

    return false;
  }

  public removeGraph(graphId: UUID) {
    for (const project of Object.values(this._projects)) {
      if (project.removeGraph(graphId)) {
        this.onProjectChanged(project.uuid);
      }
    }
  }
}

const recentProjectsSchema = z.object({
  projects: z.array(
    z.object({
      name: z.string(),
      path: z.string(),
      date: z.string().datetime(),
    })
  ),
});

type RecentProject = z.infer<typeof recentProjectsSchema>["projects"][number];
