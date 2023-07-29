import { CoreGraph, Node, Anchor, AnchorIO } from "./CoreGraph";
import logger from "./../../utils/logger";
import { type UUID } from "../../../shared/utils/UniqueEntity";
import { ToolboxRegistry } from "../registries/ToolboxRegistry";

/*
Assumptions:
  - The OutputNode array is already defined and populated. (when adding nodes)
  - Functions in nodes have two parameters: (input: T[], anchor: number) (anchor: which tells the user which anchor is being used sothat the correct value can be returned)
  - Every node returns an array of output values
*/

export class CoreGraphInterpreter {
  private toolboxRegistry: ToolboxRegistry;
  // private memo: { [key: string]: any };

  constructor(toolboxRegistry: ToolboxRegistry) {
    this.toolboxRegistry = toolboxRegistry;
    // this.memo = {};
  }

  public run(graph: CoreGraph, node: UUID) {
    // this.graph.getOutputNodes.forEach(async (uuid) => {
    //   try {
    //     await this.traverse(
    //       this.graph.getNodes[uuid],
    //       Object.entries(this.graph.getNodes[uuid].getAnchors)[0][1]
    //     ).catch((err) => {
    //       logger.error(err);
    //     });
    //   } catch (err) {
    //     logger.error(err);
    //   }
    // });
    try {
      this.traverse(
        graph,
        graph.getNodes[node],
        Object.entries(graph.getNodes[node].getAnchors)[0][1]
      ).catch((err) => {
        logger.error(err);
      });
    } catch (err) {
      logger.error(err);
    }
  }

  // public async traverse<T>(curr: Node, anchorIn: Anchor): Promise<T> {

  //   const getInputValue = async (anchor: string): Promise<T> => {
  //     // If input was given
  //     if (anchor in this.coreGraph.getEdgeDest) {
  //       const inputAnchor = this.coreGraph.getAnchors[this.coreGraph.getEdgeDest[anchor].getAnchorFrom];
  //       const inputNode = inputAnchor.parent;

  //       // Check if the input value is already memoized
  //       // console.log(this.memo, inputAnchor.uuid);
  //       if (this.memo[inputAnchor.uuid]) {
  //         console.log("Cache hit");
  //         return this.memo[inputAnchor.uuid];
  //       }

  //       // Traverse the input node and memoize the result
  //       const inputValue = await this.traverse(inputNode, inputAnchor);
  //       this.memo[inputAnchor.uuid] = inputValue;
  //       return inputValue as T;
  //     }

  //     // Return a resolved promise for inputs that are not connected
  //     return Promise.resolve(null) as Promise<T>;
  //   };

  //   // Get all input values
  //   const inputPromises: Promise<T>[] = [];
  //   for (const anchor in curr.getAnchors) {
  //     // Only check input anchors
  //     if (this.coreGraph.getAnchors[anchor].ioType !== AnchorIO.output) {
  //       inputPromises.push(getInputValue(anchor));
  //     }
  //   }

  //   // Resolve all input values (functions)
  //   const inputs: T[] = await Promise.all(inputPromises).catch((err) => {
  //     throw err;
  //   });

  //   // Check if the current node's output is already memoized
  //   if (this.memo[anchorIn.uuid]) {
  //     return this.memo[anchorIn.uuid];
  //   }

  //   // Resolve the current node's output and memoize the result
  //   const output: T = await Promise.resolve(
  //     this.toolboxRegistry.getNodeInstance(curr.getSignature).func({ input: inputs, from: anchorIn.anchorId })
  //   );

  //   this.memo[anchorIn.uuid] = output;

  //   return output;
  // }

  // USING PROMISES
  public async traverse<T>(graph: CoreGraph, curr: Node, anhcorIn: Anchor): Promise<T> {
    const inputPromises: Promise<T>[] = [];
    // Get all input values
    for (const anchor in curr.getAnchors) {
      // Only check input anchors
      if (graph.getAnchors[anchor].ioType !== AnchorIO.output) {
        // If input was given
        if (anchor in graph.getEdgeDest) {
          inputPromises.push(
            this.traverse(
              graph,
              graph.getAnchors[graph.getEdgeDest[anchor].getAnchorFrom].parent,
              graph.getAnchors[graph.getEdgeDest[anchor].getAnchorFrom]
            )
          );
        }
      }
    }

    // Resolve all input values (functions)
    const inputs: T[] = await Promise.all(inputPromises).catch((err) => {
      throw err;
    });
    // const output: T = await Promise.resolve(curr.execute(inputs, anhcorIn));
    const output: T = await Promise.resolve(
      this.toolboxRegistry
        .getNodeInstance(curr.getSignature)
        .func({ input: inputs, from: anhcorIn.anchorId })
    );

    return output;
  }
}
