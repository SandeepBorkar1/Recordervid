const videoPlayer = document.getElementById('videoPlayer');
const startRecordButton = document.getElementById('startRecord');
const stopRecordButton = document.getElementById('stopRecord');
const playVideoButton = document.getElementById('playVideo');

let mediaRecorder;
let recordedChunks = [];

// Access the user's webcam
navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
        videoPlayer.srcObject = stream;

        // Initialize MediaRecorder
        mediaRecorder = new MediaRecorder(stream);
        
        mediaRecorder.ondataavailable = event => {
            if (event.data.size > 0) {
                recordedChunks.push(event.data);
            }
        };

        mediaRecorder.onstop = () => {
            const blob = new Blob(recordedChunks, { type: 'video/webm' });
            const url = URL.createObjectURL(blob);
            videoPlayer.srcObject = null; // Stop showing live feed
            videoPlayer.src = url; // Set the recorded video source
            playVideoButton.disabled = false; // Enable play button
            recordedChunks = []; // Clear the chunks for next recording
        };
    })
    .catch(error => console.error('Error accessing media devices.', error));

// Start recording
startRecordButton.addEventListener('click', () => {
    mediaRecorder.start();
    startRecordButton.disabled = true; // Disable start button during recording
    stopRecordButton.disabled = false; // Enable stop button
});

// Stop recording
stopRecordButton.addEventListener('click', () => {
    mediaRecorder.stop();
    startRecordButton.disabled = false; // Enable start button again
    stopRecordButton.disabled = true; // Disable stop button
});

// Play recorded video
playVideoButton.addEventListener('click', () => {
    videoPlayer.play();
});
