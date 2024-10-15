async function getCamera(){

    let stream;
    try {
    stream = await navigator.mediaDevices.getUserMedia({ video: true });
    let video = document.getElementById("videoElement")
        video.style.display = "inline"
        // video.style.position = "absolute"
        // video.style.width = "30vw";
        // video.style.height = "auto";
        video.srcObject = stream;
        video.play();
    }
    catch {
        console.log("why")
    }
    
};

async function removeCamera() {
    let video = document.getElementById("videoElement");
    let canvas = document.getElementById("webglCanvas");
    video.srcObject.getTracks().forEach(track => track.stop());  // Stop the video stream
    video.style.display = "none";
    canvas.style.display = "none";
}

