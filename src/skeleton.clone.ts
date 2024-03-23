/*


https://github.com/mrdoob/three.js/blob/master/examples/jsm/utils/SkeletonUtils.js

I get clone function of this file ^
I have translate the javascript function to typescript function.
This function is used to clone every child of an FBX 3d object.


 */


import { Object3D, SkinnedMesh, Bone, Skeleton } from 'three';

export default function clone(source: Object3D): Object3D {
    const sourceLookup = new Map<Object3D, Object3D>();
    const cloneLookup = new Map<Object3D, Object3D>();

    const clone = source.clone();

    parallelTraverse(source, clone, function(sourceNode, clonedNode) {
        sourceLookup.set(clonedNode, sourceNode);
        cloneLookup.set(sourceNode, clonedNode);
    });

    clone.traverse(function(node) {
        if (!(node instanceof SkinnedMesh)) return;

        const clonedMesh = node as SkinnedMesh;
        const sourceMesh = sourceLookup.get(node) as SkinnedMesh;
        const sourceBones = sourceMesh.skeleton.bones;

        clonedMesh.skeleton = sourceMesh.skeleton.clone();
        clonedMesh.bindMatrix.copy(sourceMesh.bindMatrix);

        clonedMesh.skeleton.bones = sourceBones.map(function(bone) {
            return cloneLookup.get(bone) as Bone;
        });

        clonedMesh.bind(clonedMesh.skeleton, clonedMesh.bindMatrix);
    });

    return clone;
}

function parallelTraverse(a: Object3D, b: Object3D, callback: (a: Object3D, b: Object3D) => void): void {
    callback(a, b);

    for (let i = 0; i < a.children.length; i++) {
        parallelTraverse(a.children[i], b.children[i], callback);
    }
}
