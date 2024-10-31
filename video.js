
async function getCamera(){
    canvas = document.getElementById("webglCanvas")
    let stream;

    stream = await navigator.mediaDevices.getUserMedia({ video: true });
    let video = document.getElementById("videoElement")
        video.style.display = "inline";
        canvas.style.display = "block";
        video.srcObject = stream;
        video.play();
    
    
};

async function removeCamera() {
    let video = document.getElementById("videoElement");
    let canvas = document.getElementById("webglCanvas");
    video.srcObject.getTracks().forEach(track => track.stop());  // Stop the video stream
    video.style.display = "none";
    canvas.style.display = "none";
}

