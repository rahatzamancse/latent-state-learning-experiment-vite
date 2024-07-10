/**
 * Creates an image in a canvas with the connector image in the center and the feature images around it in a circular shape.
 * @param connectorPath The path to the image that will be placed in the center of the canvas towards each features. Relative to the root of the project.
 * @param featurePaths The paths to the images that will be placed around the connector image. Relative to the root of the project.
 * @param radius Radius of the circle where the features will be placed.
 * @param canvasWidth Width of the canvas.
 * @param canvasHeight Height of the canvas.
 * @returns Data URL of the generated image.
 */

export function generateCircularStimuli(featurePaths: string[], radius = 200, canvasSize = 500, featureSize = 100) {
    const container = document.createElement('div');
    container.style.position = 'relative';
    container.style.width = `${canvasSize}px`;
    container.style.height = `${canvasSize}px`;

    featurePaths.forEach((path, i) => {
        const angle = (i / featurePaths.length) * Math.PI * 2;
        const x = canvasSize / 2 + radius * Math.cos(angle) - featureSize / 2;
        const y = canvasSize / 2 + radius * Math.sin(angle) - featureSize / 2;

        const featureDiv = document.createElement('div');
        featureDiv.style.position = 'absolute';
        featureDiv.style.width = `${featureSize}px`;
        featureDiv.style.height = `${featureSize}px`;
        featureDiv.style.backgroundImage = `url(${path})`;
        featureDiv.style.backgroundSize = 'cover';
        featureDiv.style.left = `${x}px`;
        featureDiv.style.top = `${y}px`;

        container.appendChild(featureDiv);
    });
    

    return container.outerHTML;
}