function flattenShapesInFrames() {
  const selection = figma.currentPage.selection;

  if (selection.length === 0) {
    figma.notify("Please select at least one frame or group.");
    figma.closePlugin();
    return;
  }

  for (const node of selection) {
    if (node.type === "FRAME" || node.type === "GROUP") {
      // Find all shapes that can be flattened (vector-like nodes)
      const shapes = node.findAll(
        (n) =>
          n.type === "VECTOR" ||
          n.type === "BOOLEAN_OPERATION" ||
          n.type === "RECTANGLE" ||
          n.type === "ELLIPSE" ||
          n.type === "LINE" ||
          n.type === "POLYGON" ||
          n.type === "STAR"
      );

      if (shapes.length > 0) {
        // Convert shapes to vectors where needed
        const converted = shapes.map((shape) => {
          // Only convert if the node has a flatten method
          return typeof shape.flatten === "function" ? shape.flatten() : shape;
        });

        // Flatten all converted shapes into a single layer
        const flattened = figma.flatten(converted);

        // Rename the resulting layer
        flattened.name = "Vector";
      } else {
        figma.notify(`No vector-like shapes in "${node.name}".`, {
          timeout: 2000,
        });
      }
    } else {
      figma.notify(`Skipping "${node.name}" – select frames or groups only.`, {
        timeout: 2000,
      });
    }
  }

  figma.notify("Shapes flattened in each selected frame.");
  figma.closePlugin();
}

flattenShapesInFrames();
