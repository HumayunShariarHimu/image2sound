document.getElementById('generateSound').addEventListener('click', function () {
  const imageInput = document.getElementById('imageInput');
  const message = document.getElementById('message');

  if (imageInput.files && imageInput.files[0]) {
    const file = imageInput.files[0];
    const reader = new FileReader();
    
    reader.onload = function (e) {
      const img = new Image();
      img.src = e.target.result;

      img.onload = function () {
        // Get image dimensions
        const width = img.width;
        const height = img.height;

        // Create canvas to extract pixel data
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // Get pixel data
        const imageData = ctx.getImageData(0, 0, width, height);
        const pixels = imageData.data;

        // Generate sound from pixels
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioCtx.createOscillator();
        oscillator.type = 'sine';  // Use sine wave for smooth sound
        oscillator.connect(audioCtx.destination);

        let time = audioCtx.currentTime;
        let duration = 0.05; // duration of each tone in seconds
        for (let i = 0; i < pixels.length; i += 4) {
          const r = pixels[i];
          const g = pixels[i + 1];
          const b = pixels[i + 2];

          // Convert RGB to frequency (simplified)
          const freqR = 100 + r * 0.5;  // Red affects frequency
          const freqG = 200 + g * 0.5;  // Green affects frequency
          const freqB = 300 + b * 0.5;  // Blue affects frequency

          // Create sound for each pixel's RGB combination
          oscillator.frequency.setValueAtTime(freqR, time);
          oscillator.start(time);
          time += duration;

          oscillator.frequency.setValueAtTime(freqG, time);
          oscillator.start(time);
          time += duration;

          oscillator.frequency.setValueAtTime(freqB, time);
          oscillator.start(time);
          time += duration;
        }

        // Stop sound after all pixels processed
        oscillator.stop(time);
        message.textContent = "Sound generated from image!";
      };
    };

    reader.readAsDataURL(file);
  } else {
    message.textContent = "Please select an image!";
  }
});