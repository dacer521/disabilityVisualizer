async function getCamera(){

    let stream;
    try {
    stream = await navigator.mediaDevices.getUserMedia({ video: true });
    let video = document.getElementById("videoElement")
        video.style.display = "inline"
        video.srcObject = stream;
        video.play();
    }
    catch {
        console.log("why")
    }
    
    

};