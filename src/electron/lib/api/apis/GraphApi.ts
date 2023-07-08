import type { ElectronMainApi } from "electron-affinity/main";
import type { Blix } from "../../Blix";
import { type UUID } from "../../../../shared/utils/UniqueEntity";
import { IPCGraphSubscriber } from "../../core-graph/CoreGraphInteractors";
import { UIGraph } from "@shared/ui/UIGraph";

// Graphs across projects are stored homogeneously and referenced by UUID
export class GraphApi implements ElectronMainApi<GraphApi> {
  private readonly _blix: Blix;

  constructor(blix: Blix) {
    this._blix = blix;
  }

  async addNode(graphUUID: UUID) {
    // TODO: This will have to be done through a graph subscriber eventually,
    //       but for now we'll just modify the graph state directly with the setters.
    // this._blix.graphManager.getGraph(graphUUID).addNode();
    return;
  }

  async addEdge(graphUUID: UUID) {
    // this._blix.graphManager.getGraph(graphUUID).addEdge();
    return;
  }

  async removeNode(graphUUID: UUID) {
    return;
  }

  async removeEdge(graphUUID: UUID) {
    return;
  }

  async setNodePos(uuid: UUID) {
    return this._blix.graphManager.getGraph(uuid);
  }

  async getGraph(uuid: UUID) {
    return this._blix.graphManager.getGraph(uuid);
  }

  async getAllGraphUUIDs() {
    return this._blix.graphManager.getAllGraphUUIDs();
  }
}
