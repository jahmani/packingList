import { ExtMap, Extended, TreeNode } from "../interfaces/data-models";

export function mapToTree(NodeSnapshotMap: ExtMap<Extended<TreeNode>>) {
  let rootNode: Extended<TreeNode>;

  /**/
  NodeSnapshotMap.forEach(nodeSnapshot => {
    nodeSnapshot.ext = nodeSnapshot.ext || {};
    delete nodeSnapshot.ext.$sons;
    nodeSnapshot.ext.$isExpanded = true;
  });

  NodeSnapshotMap.forEach(datum => {
    //  datum.ext = datum.ext || {$isExpanded:true} as ExtType
    if (!datum.data.parentId) {
      rootNode = datum;
      //  delete rootNode.ext.$sons
    } else {
      const parentNode: Extended<TreeNode> = NodeSnapshotMap.get(
        datum.data.parentId
      );
      datum.ext.$parent = parentNode;
      //  parentNode.ext = parentNode.ext || {$isExpanded:true} as ExtType
      if (!parentNode.ext.$sons) {
        parentNode.ext.$sons = [];
      }
      parentNode.ext.$sons.push(datum);
    }
  });
  console.log(rootNode);

  return rootNode; // { rootsArray: rootsArray, idToNodeMap:idToNodeMap };
}
/*
  export function ArrayToTree(_NodeSnapshotList:ExtendedData<TreeNode>[]) {
    var idToNodeMap = {};
    let rootNode : TreeNodeDataSnapshot
    let NodeSnapshotList = _NodeSnapshotList as TreeNodeDataSnapshot[]
    NodeSnapshotList.forEach(nodeSnapshot=>{
        idToNodeMap[nodeSnapshot.id] = nodeSnapshot
        delete nodeSnapshot.$sons
    })

    NodeSnapshotList.forEach((datum) => {
      if (typeof datum.data.parentId === "undefined") {
        rootNode = datum;
      }
        else
        {
        let parentNode = idToNodeMap[datum.data.parentId];
        datum.$parent = parentNode;
          if (!parentNode.$sons)
            parentNode.$sons = [];
          parentNode.$sons.push(datum);
        }
    })
    console.log(rootNode);

    return rootNode;// { rootsArray: rootsArray, idToNodeMap:idToNodeMap };

  }

  */
