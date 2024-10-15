var curText = "";
var curAnim = "";
var newChapter = false;

let audioContext;
let microphoneStream;
let pannerNode;
let sourceNode;
let gainNode; // To control the volume (mute/unmute)


window.onload = function() {

    async function startMicrophone() {
        try {
          // Create audio context
          audioContext = new (window.AudioContext || window.webkitAudioContext)();
      
          // Get audio input from the microphone
          microphoneStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
          // Create a source node from the microphone stream
          sourceNode = audioContext.createMediaStreamSource(microphoneStream);
      
          // Create a panner node to control left/right channel
          pannerNode = audioContext.createStereoPanner();
      
          // Create a gain node to control mute/unmute
          gainNode = audioContext.createGain();
      
          // Set the initial gain to 1 (full volume)
          gainNode.gain.value = 1;
      
          // Connect the source node to the panner node
          sourceNode.connect(pannerNode);
      
          // Connect the panner node to the gain node
          pannerNode.connect(gainNode);
      
          // Connect the gain node to the audio context's destination (your speakers)
          gainNode.connect(audioContext.destination);
      
          // Set initial pan value to left channel
          pannerNode.pan.value = -1;
      
          console.log("Microphone input started, sound is in left channel");
        } catch (err) {
          console.error("Error accessing microphone:", err);
        }
      }
      

    let canvas = document.getElementById("webglCanvas")
    function resizeCanvasToVideo(videoElement, canvas) {
        canvas.width = videoElement.videoWidth;
        canvas.height = videoElement.videoHeight;
        canvas.style.width = videoElement.style.width;
        canvas.style.height = videoElement.style.height;
    }
    
    
    // $(".start").css("transition-duration", "1s");
    // $(".start").click(function() {
    //     $("body > *:not(.start)").css("filter", "blur(0rem)");
    //     bounceHide(".start");
    // });

    function bounceHide(element) {
        $(element).animate({ bottom: "-150vh" }, "swing");
    }

    function bounceShow(element) {
        $(element).animate({ bottom: "0%" });
    }

    // WebGL shader code for astigmatism effect
    const vertexShaderSource = `
        attribute vec2 a_position;
        attribute vec2 a_texCoord;
        varying vec2 v_texCoord;
        void main() {
            gl_Position = vec4(a_position, 0.0, 1.0);
            v_texCoord = a_texCoord;
        }
    `;

    const fragmentShaderSourceAstigmatism = `
    precision mediump float;
    varying vec2 v_texCoord;
    uniform sampler2D u_image;
    uniform vec2 u_resolution;
    uniform float u_distortionAmount;

    void main() {
        // Flip the texture vertically
        vec2 flippedTexCoord = vec2(v_texCoord.x, 1.0 - v_texCoord.y);

        // Scale the distortion based on the canvas size
        vec2 offset = vec2(u_distortionAmount / u_resolution.x, u_distortionAmount / u_resolution.y);

        // Apply the astigmatism effect
        vec4 color = texture2D(u_image, flippedTexCoord) * 0.5;
        color += texture2D(u_image, flippedTexCoord + vec2(offset.x, 0.0)) * 0.25;
        color += texture2D(u_image, flippedTexCoord + vec2(0.0, offset.y)) * 0.25;

        gl_FragColor = color;
    }
`;
async function createDyslexiaEffect(txtContent, txtElement) {
    let stream;
    // try {


    canvas.style.display = "hidden"

    canvas.style.transform = "translateY(-1000%)"

    setTimeout(1000);

    let video = document.getElementById("videoElement")

    video.style.display = "hidden"

    

    txtContent.srcObject = stream;

    video.pause();



    dyslexia();

    // }
    // catch {
    //     console.log("why")
    // }

}
function createAstigmatismEffect(videoElement, videoElementJquery) {
    canvas.style.transform = "translateY(0%)";
    const jCanvas = $('#webglCanvas');
    const gl = canvas.getContext('webgl');  // Use the existing canvas reference

    // Set canvas size to match the video element
    jCanvas.width(videoElementJquery.width());
    // Set canvas size to match the video element
    // canvas.width = videoElement.videoWidth;
    // canvas.height = videoElement.videoHeight;
    // canvas.style.width = `${videoElement.style.width}`;
    // hAteIncarnate = videoElement.style['aspect-ratio'];
    // canvas.style.height = `${videoElement.clientHeight / hAteIncarnate}`;
    jCanvas.height(videoElementJquery.height());

    // Initialize shaders and WebGL program
    function createShader(gl, type, source) {
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        return shader;
    }

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSourceAstigmatism);

    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    gl.useProgram(program);

    // Set up the rectangle covering the entire canvas
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        -1, -1, 1, -1, -1, 1,
        -1, 1, 1, -1, 1, 1,
    ]), gl.STATIC_DRAW);

    const positionLocation = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    // Set up texture coordinates
    const texCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        0, 0, 1, 0, 0, 1,
        0, 1, 1, 0, 1, 1,
    ]), gl.STATIC_DRAW);

    const texCoordLocation = gl.getAttribLocation(program, 'a_texCoord');
    gl.enableVertexAttribArray(texCoordLocation);
    gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 0, 0);

    // Set up the texture for the video
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    // Set uniform locations
    const resolutionLocation = gl.getUniformLocation(program, 'u_resolution');
    const distortionAmountLocation = gl.getUniformLocation(program, 'u_distortionAmount');
    gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
    gl.uniform1f(distortionAmountLocation, 3.0); // Adjust this value for distortion intensity (20 for standard or something)

    // Render loop
    function render() {
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, videoElement);

        gl.drawArrays(gl.TRIANGLES, 0, 6);
        requestAnimationFrame(render);
    }

    render();
}


const fragmentShaderSourceBlindness = `
precision mediump float;
varying vec2 v_texCoord;
uniform sampler2D u_texture;
uniform float u_blurAmount;

void main() {
    // Flip the texture vertically
    vec2 flippedTexCoord = vec2(v_texCoord.x, 1.0 - v_texCoord.y);

    vec4 color = vec4(0.0);
    float total = 0.0;

    // Sample neighboring pixels to create a blur effect
    for (float x = -4.0; x <= 4.0; x++) {
        for (float y = -4.0; y <= 4.0; y++) {
            float weight = exp(-(x * x + y * y) / (2.0 * u_blurAmount * u_blurAmount));
            color += texture2D(u_texture, flippedTexCoord + vec2(x, y) * 0.005) * weight;
            total += weight;
        }
    }

    color /= total;  // Normalize color by total weight
    gl_FragColor = color;
}
`;
function createBlindnessEffect(videoElement, videoElementJquery) {
    canvas.style.transform = "translateY(0%)";
    const jCanvas = $('#webglCanvas');
    const gl = canvas.getContext('webgl');  // Use the existing canvas reference

    // Set canvas size to match the video element
    jCanvas.height(videoElementJquery.height());

    // Initialize shaders and WebGL program (rest of the function remains the same)


    // Initialize shaders and WebGL program
    function createShader(gl, type, source) {
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        return shader;
    }

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSourceBlindness);

    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    gl.useProgram(program);

    // Set up the rectangle covering the entire canvas
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        -1, -1, 1, -1, -1, 1,
        -1, 1, 1, -1, 1, 1,
    ]), gl.STATIC_DRAW);

    const positionLocation = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    // Set up texture coordinates
    const texCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        0, 0, 1, 0, 0, 1,
        0, 1, 1, 0, 1, 1,
    ]), gl.STATIC_DRAW);

    const texCoordLocation = gl.getAttribLocation(program, 'a_texCoord');
    gl.enableVertexAttribArray(texCoordLocation);
    gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 0, 0);

    // Set up the texture for the video
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    // Set uniform locations
    const resolutionLocation = gl.getUniformLocation(program, 'u_resolution');
    const blurAmountLocation = gl.getUniformLocation(program, 'u_blurAmount');  // Moved to after program creation
    gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
    gl.uniform1f(blurAmountLocation, 2.0); // Adjust this value for blurriness

    // Render loop
    function render() {
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, videoElement);

        gl.drawArrays(gl.TRIANGLES, 0, 6);
        requestAnimationFrame(render);
    }

    render();
}


function createDeafnessEffect() {
    // Function to switch the audio to the left channel
    function switchToLeftChannel() {
        if (pannerNode) {
            pannerNode.pan.value = -1; // Left channel
            console.log("Switched to left channel");
        }
    }
  
    // Function to switch the audio to the right channel
    function switchToRightChannel() {
        if (pannerNode) {
        pannerNode.pan.value = 1; // Right channel
        console.log("Switched to right channel");
        }
    }
    
    // Function to switch back to stereo (both channels)
    function switchToStereo() {
        if (pannerNode) {
        pannerNode.pan.value = 0; // Center (stereo)
        console.log("Switched to stereo (both channels)");
        }
    }
    
    // Function to mute the audio
    function muteAudio() {
        if (gainNode) {
        gainNode.gain.value = 0; // Mute by setting gain to 0
        console.log("Muted audio");
        }
    }
    
    // Function to unmute the audio
    function unmuteAudio() {
        if (gainNode) {
        gainNode.gain.value = 1; // Restore volume by setting gain to 1
        console.log("Unmuted audio");
        }
    }
    startMicrophone(); // Start microphone
      
    setTimeout(switchToLeftChannel, 5000);
}





    // Function to define a chapter in the UI
    function defineChapter(content, id) {
        $(".ChapterTab").append(`<div class="tooltipchapter"> <img src="Images/${content}" class="ChapterImg" id="${id}"></img> <span class="tooltiptextchapter">${id}</span> </div>`);
    }

    // Function to define a color filter in the UI
    function defineFilter(content, id) {
        $(".ColorFilters").append(`<div class="tooltipfilter"> <img src="Images/${content}" class="FilterImg" id="${id}"></img> <span class="tooltiptextfilter">${id}</span> </div>`);
    }

    // Function to define a play button in the UI
    function definePlay(content) {
        $(".Play").append(`<img src="Images/${content}" class="playButton"></img>`);
    }

    // Function to define a "more" button in the UI
    function defineMore(content) {
        $(".More").append(`<img src="Images/${content}" class="moreButton"></img>`);
    }

    // Function to define text content for chapters
    function defineText(text, chapter, subchapter) {
        $(".TextContent").append(`<span class="${chapter}-${subchapter}">${text}</span>`);
    }

    // Function to define animations for chapters
    function defineAnim(img, chapter) {
        $(".AnimationContent").append(`<img src="Images/${img}" class="img${chapter}">`);
    }

    // Function to enable scroll behavior for specific elements
    function scrollFix(element) {
        $(".TextContent > span").css("pointer-events", "none");
        $(element).css("pointer-events", "auto");
    }

    // Initialize chapters, filters, and interactions
    defineChapter("Eye-Black.png", "Colorblindness");
    defineChapter("Eye-Black.png", "Deafness");
    defineChapter("Eye-Black.png", "Blindness");
    defineChapter("Eye-Black.png", "Astigmatism");
    defineChapter("Eye-Black.png", "Dyslexia");

    defineFilter("full_color.png", "Normal");
    defineFilter("deuteranopia.png", "Deuteranopia");
    defineFilter("protanopia.png", "Protanopia");
    defineFilter("tritanopia.png", "Tritanopia");
    defineFilter("achromatopsia.png", "Achromatopsia");

    definePlay("Play.png");
    defineMore("QuestionMark.png");

    defineText("<ul><li>Color blindness is a condition where a person has cones in their eyes (the part of your eye that perceives color) that function improperly, poorly, or not at all.</li><li>There are three main types of color blindness:</li><ul><li>Deuteranopia (Red-Green Color Blindness) (green weak)</li><li>Protanopia (Red-Green Color Blindness) (red weak, what David has)</li><li>Tritanopia (Blue-Yellow Color Blindness) (blue weak)</li></ul></ul>", "Colorblindness", "1");

    defineAnim("Eye-Black.png", "Colorblindness");


    defineAnim("Eye-Black.png", "Colorblindness");
    
    defineAnim("dyslexia.jpeg", "Dyslexia")
    
    defineText("This is a simple visualization of dyslexia. It is an example of one kind at one severity, so bear in mind this is not perfectly accurate to all people, but it shows what living with this disability is like. Words appear to 'shift' and can be hard to understand quickly, if at all without years of practice and dedecation.", "Dyslexia", "1");

    defineText("<br><br><br>This is a simple visualization of dyslexia. It is an example of one kind at one severity, so bear in mind this is not perfectly accurate to all people, but it shows what living with this disability is like. Words appear to 'shift' and can be hard to understand quickly, if at all without years of practice and dedecation.", "Dyslexia", "1");


    // Handle chapter image clicks
    $(".ChapterImg").click(function() {
        $(".ChapterImg").css("border", "grey solid 0.25rem");
        $(this).css("border", "#41c341 solid 0.25rem");
        $(".TextContent > span").animate({ opacity: 0 });
        $(".AnimationContent > img").animate({ opacity: 0 });
        $(`.${$(this).attr("id")}-1`).animate({ opacity: 1 });
        $(`.img${$(this).attr("id")}`).animate({ opacity: 1 });
        if (curAnim != `.img${$(this).attr("id")}`) {
            newChapter = true;
        } else {
            newChapter = false;
        }
        curText = `.${$(this).attr("id")}-1`;
        curAnim = `.img${$(this).attr("id")}`;

        scrollFix(curText);

        // if ($(this).attr("id") === "Astigmatism") {
        //     // const videoElement = document.getElementById("videoElement");
        //     const videoElement = $("#videoElement")[0];
        //     videoElement.onloadeddata = () => {
        //         // createAstigmatismEffect(videoElement);
        //         eval("createAstigmatismEffect(videoElement)");
        //     };
        // }
        // if ($(this).attr("id") === "Astigmatism") {
        //     $("#videoElement")[0].onloadeddata = () => {
        //         global["create" + $(this).attr("id") + "Effect"]($("#videoElement")[0]);
                // eval("create" + curElem + "Effect")($("#videoElement")[0]);
        //     }
        // }
        getCamera();
        const videoElementJquery = $("#videoElement");
        // const videoElement = $("#videoElement")[0];
        videoElement.onloadeddata = () => {
            // createAstigmatismEffect(videoElement);
            eval("create" + $(this).attr("id") + "Effect(videoElementJquery[0], videoElementJquery)");
        };

        if ($(`.${$(this).attr("id")}-2`).length == 0) {
            bounceHide(".Play");
        } else {
            bounceShow(".Play");
        }
    });

    // Handle filter image clicks
    $(".FilterImg").click(function() {
        colorConfirm($(this).attr("id"));
        $(":root").css("filter", "url(#" + "modularFilter" + ")");
        $(".FilterImg").css("border", "grey solid 0.25rem");
        $(this).css("border", "#41c341 solid 0.25rem");
    });
    // Handle play button clicks
    $(".Play").click(function() {
        scrollFix(curText.replace(/.$/, "2"));
        $(".TextContent > span").animate({ opacity: 0 });
        $(curText.replace(/.$/, "2")).animate({ opacity: 1 });
        bounceHide(".Play");
    });

    // Handle more button clicks
    $(".More").click(function() {
        $(".TextContent > span").animate({ opacity: 0 });
        $(".AnimationContent > img").animate({ opacity: 0 });
        bounceHide(".Play");
        $(".More-1").animate({ opacity: 1 });
        $(`.imgMore`).animate({ opacity: 1 });
    });
};

NormalVision = [1.000000, 0.000000, -0.000000, 0.000000, 1.000000, 0.000000, -0.000000, -0.000000, 1.000000];
AchromatopsiaVision = [0.213,  0.715,  0.072, 0.213,  0.715,  0.072, 0.213,  0.715,  0.072];

Protanopia0 = [1.000000, 0.000000, -0.000000, 0.000000, 1.000000, 0.000000, -0.000000, -0.000000, 1.000000];
Deuteranopia0 = [1.000000, 0.000000, -0.000000, 0.000000, 1.000000, 0.000000, -0.000000, -0.000000, 1.000000];
Tritanopia0 = [1.000000, 0.000000, -0.000000, 0.000000, 1.000000, 0.000000, -0.000000, -0.000000, 1.000000];
Protanopia1 = [0.856167, 0.182038, -0.038205, 0.029342, 0.955115, 0.015544, -0.002880, -0.001563, 1.004443];
Deuteranopia1 = [0.866435, 0.177704, -0.044139, 0.049567, 0.939063, 0.011370, -0.003453, 0.007233, 0.996220];
Tritanopia1 = [0.926670, 0.092514, -0.019184, 0.021191, 0.964503, 0.014306, 0.008437, 0.054813, 0.936750];
Protanopia2 = [0.734766, 0.334872, -0.069637, 0.051840, 0.919198, 0.028963, -0.004928, -0.004209, 1.009137];
Deuteranopia2 = [0.760729, 0.319078, -0.079807, 0.090568, 0.889315, 0.020117, -0.006027, 0.013325, 0.992702];
Tritanopia2 = [0.895720, 0.133330, -0.029050, 0.029997, 0.945400, 0.024603, 0.013027, 0.104707, 0.882266];
Protanopia3 = [0.630323, 0.465641, -0.095964, 0.069181, 0.890046, 0.040773, -0.006308, -0.007724, 1.014032];
Deuteranopia3 = [0.675425, 0.433850, -0.109275, 0.125303, 0.847755, 0.026942, -0.007950, 0.018572, 0.989378];
Tritanopia3 = [0.905871, 0.127791, -0.033662, 0.026856, 0.941251, 0.031893, 0.013410, 0.148296, 0.838294];
Protanopia4 = [0.539009, 0.579343, -0.118352, 0.082546, 0.866121, 0.051332, -0.007136, -0.011959, 1.019095];
Deuteranopia4 = [0.605511, 0.528560, -0.134071, 0.155318, 0.812366, 0.032316, -0.009376, 0.023176, 0.986200];
Tritanopia4 = [0.948035, 0.089490, -0.037526, 0.014364, 0.946792, 0.038844, 0.010853, 0.193991, 0.795156];
Protanopia5 = [0.458064, 0.679578, -0.137642, 0.092785, 0.846313, 0.060902, -0.007494, -0.016807, 1.024301];
Deuteranopia5 = [0.547494, 0.607765, -0.155259, 0.181692, 0.781742, 0.036566, -0.010410, 0.027275, 0.983136];
Tritanopia5 = [1.017277, 0.027029, -0.044306, -0.006113, 0.958479, 0.047634, 0.006379, 0.248708, 0.744913];
Protanopia6 = [0.385450, 0.769005, -0.154455, 0.100526, 0.829802, 0.069673, -0.007442, -0.022190, 1.029632];
Deuteranopia6 = [0.498864, 0.674741, -0.173604, 0.205199, 0.754872, 0.039929, -0.011131, 0.030969, 0.980162];
Tritanopia6 = [1.104996, -0.046633, -0.058363, -0.032137, 0.971635, 0.060503, 0.001336, 0.317922, 0.680742];
Protanopia7 = [0.319627, 0.849633, -0.169261, 0.106241, 0.815969, 0.077790, -0.007025, -0.028051, 1.035076];
Deuteranopia7 = [0.457771, 0.731899, -0.189670, 0.226409, 0.731012, 0.042579, -0.011595, 0.034333, 0.977261];
Tritanopia7 = [1.193214, -0.109812, -0.083402, -0.058496, 0.979410, 0.079086, -0.002346, 0.403492, 0.598854];
Protanopia8 = [0.259411, 0.923008, -0.182420, 0.110296, 0.804340, 0.085364, -0.006276, -0.034346, 1.040622];
Deuteranopia8 = [0.422823, 0.781057, -0.203881, 0.245752, 0.709602, 0.044646, -0.011843, 0.037423, 0.974421];
Tritanopia8 = [1.257728, -0.139648, -0.118081, -0.078003, 0.975409, 0.102594, -0.003316, 0.501214, 0.502102];
Protanopia9 = [0.203876, 0.990338, -0.194214, 0.112975, 0.794542, 0.092483, -0.005222, -0.041043, 1.046265];
Deuteranopia9 = [0.392952, 0.823610, -0.216562, 0.263559, 0.690210, 0.046232, -0.011910, 0.040281, 0.971630];
Tritanopia9 = [1.278864, -0.125333, -0.153531, -0.084748, 0.957674, 0.127074, -0.000989, 0.601151, 0.399838];
Protanopia10 = [0.152286, 1.052583, -0.204868, 0.114503, 0.786281, 0.099216, -0.003882, -0.048116, 1.051998];
Deuteranopia10 = [0.367322, 0.860646, -0.227968, 0.280085, 0.672501, 0.047413, -0.011820, 0.042940, 0.968881];
Tritanopia10 = [1.255528, -0.076749, -0.178779, -0.078411, 0.930809, 0.147602, 0.004733, 0.691367, 0.303900];

function lerp(start, end, amt) {
    return start + (end - start) * amt;
}
function matrixLerp(array1, array2, amt) {
    var arrayOut = [...array1];
    for (var i = 0; i < array1.length; i++) {
        arrayOut[i] = lerp(array1[i], array2[i], amt);
    }
    return arrayOut;
}


// Tritanopia10
// var hi = `
// 1.256 -0.077 -0.179  0.000  0.000
// -0.078  0.931  0.148  0.000  0.000
// 0.005  0.691  0.304  0.000  0.000
// 0.000  0.000  0.000  1.000  0.000`
var oldColorBlind = "Normal"
function colorConfirm(colorBlind = oldColorBlind) {
    oldColorBlind = colorBlind
    // var inpuddy = 0.5678;
    var inpuddy = $(".slider").val() / 100;
    
    // var severity = 0;
    var sevArray;
    if (colorBlind == "Normal") {
        sevArray = Tritanopia0;
    } else if (colorBlind == "Achromatopsia") {
        sevArray = matrixLerp(NormalVision, AchromatopsiaVision, inpuddy);
    } else {
    inpuddy = ((inpuddy * 10).toString().split("."));
    if (inpuddy[0] != Math.floor(inpuddy[0])) {
        sevArray = matrixLerp(window[colorBlind + inpuddy[0]], window[colorBlind + (inpuddy[0] + 1)], inpuddy[1])
    } else {
        // window[colorBlind + inpuddy[0]];
        sevArray = window[colorBlind + inpuddy[0]]
    }
    // var sevArray = window[colorBlind + "8"];
    // "1.256 -0.077 -0.179  0.000  0.000 -0.078  0.931  0.148  0.000  0.000 0.005  0.691  0.304  0.000  0.000 0.000  0.000  0.000  1.000  0.000"

    // var modfil = $(".modularFilter");
    // modfil.attr("values", `${sevArray[0]} ${sevArray[1]} ${sevArray[2]} 0.000000 0.000000 ${sevArray[3]} ${sevArray[4]} ${sevArray[5]} 0.000000 0.000000 ${sevArray[6]} ${sevArray[7]} ${sevArray[8]} 0.000000 0.000000 0.000000 0.000000 0.000000 1.000000 0.000000`)
    }
    // if (colorBlind != "Normal") {
        var modfil = $(".modularFilter");
        modfil.attr("values", `${sevArray[0]} ${sevArray[1]} ${sevArray[2]} 0.000000 0.000000 ${sevArray[3]} ${sevArray[4]} ${sevArray[5]} 0.000000 0.000000 ${sevArray[6]} ${sevArray[7]} ${sevArray[8]} 0.000000 0.000000 0.000000 0.000000 0.000000 1.000000 0.000000`)
    // }
}

// modfil.

//slider stuff
$(".slider").on("input", function(){
    $(".sevAmt").text($(".slider").val() + "%");
    colorConfirm();
});