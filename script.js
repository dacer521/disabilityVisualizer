var curText = "";
var curAnim = "";

window.onload = function() {
    $(".start").css("transition-duration", "1s");
    $(".start").click(function() {
        $("body > *:not(.start)").css("filter", "blur(0rem)");
        bounceHide(".start");
    });

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

    const fragmentShaderSource = `
        precision mediump float;
        varying vec2 v_texCoord;
        uniform sampler2D u_image;
        uniform vec2 u_resolution;
        uniform float u_distortionAmount;

        void main() {
            vec2 offset = vec2(u_distortionAmount / u_resolution.x, u_distortionAmount / u_resolution.y);
            
            vec4 color = texture2D(u_image, v_texCoord) * 0.5;
            color += texture2D(u_image, v_texCoord + vec2(offset.x, 0.0)) * 0.25;
            color += texture2D(u_image, v_texCoord + vec2(0.0, offset.y)) * 0.25;

            gl_FragColor = color;
        }
    `;

    function createAstigmatismEffect(videoElement) {
        const canvas = document.getElementById('webglCanvas');
        const gl = canvas.getContext('webgl');
        canvas.width = videoElement.videoWidth;
        canvas.height = videoElement.videoHeight;

        // Initialize shaders and WebGL program
        function createShader(gl, type, source) {
            const shader = gl.createShader(type);
            gl.shaderSource(shader, source);
            gl.compileShader(shader);
            return shader;
        }

        const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
        const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

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
        gl.uniform1f(distortionAmountLocation, 20.0); // Adjust this value for distortion intensity

        // Render loop
        function render() {
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, videoElement);

            gl.drawArrays(gl.TRIANGLES, 0, 6);
            requestAnimationFrame(render);
        }

        render();
    }

    // Function to define a chapter in the UI
    function defineChapter(content, id) {
        $(".ChapterTab").append(`<div class="tooltipchapter"> <img src="Images/${content}" class="ChapterImg" id="${id}"></img> <span class="tooltiptextchapter">${id}</span> </div>`);
    }

    // Function to define a color filter in the UI
    function defineFilter(content, id) {
        $(".ColorFilters").append(`<div class="tooltipfilter"> <img src="Images/Filters/${content}" class="FilterImg" id="${id}"></img> <span class="tooltiptextfilter">${id}</span> </div>`);
    }

    // Function to define a play button in the UI
    function definePlay(content) {
        $(".Play").append(`<img src="Images/Symbols/${content}" class="playButton"></img>`);
    }

    // Function to define a "more" button in the UI
    function defineMore(content) {
        $(".More").append(`<img src="Images/Symbols/${content}" class="moreButton"></img>`);
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
    defineText("Yes, color blindness does affect animals. Most animals see color differently than humans, so the way we are color blind is different, but animals can be color blind.", "Colorblindness", "2");

    // Handle chapter image clicks
    $(".ChapterImg").click(function() {
        $(".ChapterImg").css("border", "grey solid 0.25rem");
        $(this).css("border", "#41c341 solid 0.25rem");
        $(".TextContent > span").animate({ opacity: 0 });
        $(".AnimationContent > img").animate({ opacity: 0 });
        $(`.${$(this).attr("id")}-1`).animate({ opacity: 1 });
        $(`.img${$(this).attr("id")}`).animate({ opacity: 1 });
        curText = `.${$(this).attr("id")}-1`;
        curAnim = `.img${$(this).attr("id")}`;

        scrollFix(curText);

        if ($(this).attr("id") === "Astigmatism") {
            const videoElement = document.getElementById("videoElement");
            videoElement.onloadeddata = () => {
                createAstigmatismEffect(videoElement);
            };
        }

        if ($(`.${$(this).attr("id")}-2`).length == 0) {
            bounceHide(".Play");
        } else {
            bounceShow(".Play");
        }
    });

    // Handle filter image clicks
    $(".FilterImg").click(function() {
        $(":root").css("filter", "url(#" + $(this).attr("id") + ")");
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
