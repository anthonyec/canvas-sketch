const canvasSketch = require('canvas-sketch');
const { lerp } = require('canvas-sketch-util/math');

const settings = {
  duration: 10,
  dimensions: [ 3840, 2160 ],
  scaleToView: true,
  playbackRate: 'throttle',
  animate: true,
  fps: 60
};

// Start the sketch
canvasSketch(({ update }) => {
  return ({ context, frame, width, height, playhead }) => {
    // This pauses the animation. Comment this out to have the animation play.
    playhead = 1.73;

    context.clearRect(0, 0, width, height);
    context.fillStyle = '#174EB4';
    // context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);

    const gridSize = 13;
    const padding = width * 0.79;
    const tileSize = (width - padding * 2) / gridSize;

    for (let x = -4; x < 18; x++) {
      for (let y = 0; y < gridSize; y++) {
        // get a 0..1 UV coordinate
        const u = gridSize <= 1 ? 0.5 : x / (gridSize - 1);
        const v = gridSize <= 1 ? 0.5 : y / (gridSize - 1);

        // scale to dimensions with a border padding
        const tx = lerp(padding, width - padding, u);
        const ty = lerp(padding, height - padding, v);

        // here we get a 't' value between 0..1 that
        // shifts subtly across the UV coordinates
        const offset = u * 0.5 + v * 0.5;
        const t = (playhead + offset) % 1;

        // now we get a value that varies from 0..1 and back
        let mod = Math.sin(t * Math.PI);

        // we make it 'ease' a bit more dramatically with exponential
        mod = Math.pow(mod, 3);

        // now choose a length, thickness and initial rotation
        const length = tileSize * 0.65;
        const thickness = tileSize * 0.1;
        const initialRotation = Math.PI / 2;

        // And rotate each line a bit by our modifier
        const rotation = initialRotation + mod * Math.PI;

        // Now render...
        draw(context, tx, ty, length, thickness, rotation);
      }
    }
  };

  function draw (context, x, y, length, thickness, rotation) {
    context.save();
    context.fillStyle = '#FFB9CA';
    // context.fillStyle = 'white';

    // Rotate in place
    context.translate(x, y);
    context.rotate(rotation);
    context.translate(-x, -y);

    // Draw the line
    context.fillRect(x - length / 2, y - thickness / 2, length, thickness);
    context.restore();
  }
}, settings);
