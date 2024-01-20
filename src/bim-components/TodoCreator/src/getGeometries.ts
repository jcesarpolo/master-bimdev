import { BufferGeometry, BufferAttribute, Mesh, Box3 } from 'three';

// Function to get geometries by expressIds and compute their bounding box
async function getGeometriesAndBoundingBox(expressIds, modelID, viewer) {
    const customID = 'temp-gltf-subset';
    const meshes: Mesh[] = [];

    for (const id of expressIds) {
        // Create a subset for each expressId
        const subset = viewer.IFC.loader.ifcManager.createSubset({
            ids: [id],
            modelID,
            removePrevious: true,
            customID
        });

        // Check if subset exists
        if (subset) {
            const geometry = subset.geometry;
            const material = subset.material;

            // Create a mesh and add it to the meshes array
            const mesh = new Mesh(geometry, material);
            meshes.push(mesh);
        }
    }

    // Remove the temporary subset
    viewer.IFC.loader.ifcManager.removeSubset(modelID, undefined, customID);

    // Calculate and return the bounding box
    return calculateBoundingBox(meshes);
}

// Function to calculate the bounding box from an array of meshes
function calculateBoundingBox(meshes) {
    const boundingBox = new Box3();

    // Calculate the combined bounding box
    meshes.forEach(mesh => {
        mesh.geometry.computeBoundingBox();
        boundingBox.union(mesh.geometry.boundingBox);
    });

    return boundingBox;
}
