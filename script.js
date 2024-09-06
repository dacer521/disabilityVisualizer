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

    function defineChapter(content, id) {
        $(".ChapterTab").append(`<div class="tooltipchapter"> <img src="Images/Chapters/${content}" class="ChapterImg" id="${id}"></img> <span class="tooltiptextchapter">${id}</span> </div>`);
    }

    function defineFilter(content, id) {
        $(".ColorFilters").append(`<div class="tooltipfilter"> <img src="Images/Filters/${content}" class="FilterImg" id="${id}"></img> <span class="tooltiptextfilter">${id}</span> </div>`);
    }

    function definePlay(content) {
        $(".Play").append(`<img src="Images/Symbols/${content}" class="playButton"></img>`);
    }

    function defineMore(content) {
        $(".More").append(`<img src="Images/Symbols/${content}" class="moreButton"></img>`);
    }

    function defineText(text, chapter, subchapter) {
        $(".TextContent").append(`<span class="${chapter}-${subchapter}">${text}</span>`);
    }

    function defineAnim(img, chapter) {
        $(".AnimationContent").append(`<img src="Images/Anim/${img}" class="img${chapter}">`);
    }

    function scrollFix(element) {
        $(".TextContent > span").css("pointer-events", "none");
        $(element).css("pointer-events", "auto");
    }

    bounceHide(".Play");

    defineChapter("Eye-Black.png", "Colorblindness");
    defineChapter("Hourglass.png", "History");
    defineChapter("DNA.jpg", "Inheritance");
    defineChapter("Color-Wheel.png", "Existence");
    defineChapter("Microscope.png", "Treatments");

    defineFilter("full_color.png", "Normal");
    defineFilter("deuteranopia.png", "Deuteranopia");
    defineFilter("protanopia.png", "Protanopia");
    defineFilter("tritanopia.png", "Tritanopia");
    defineFilter("achromatopsia.png", "Achromatopsia");

    definePlay("Play.png");
    defineMore("QuestionMark.png");

    defineText("<ul><li>Color blindness is a condition where a person has cones in their eyes (the part of your eye that perceives color) that function improperly, poorly, or not at all.</li><li>There are three main types of color blindness:</li><ul><li>Deuteranopia (Red-Green Color Blindness) (green weak)</li><li>Protanopia (Red-Green Color Blindness) (red weak, what David has)</li><li>Tritanopia (Blue-Yellow Color Blindness) (blue weak)</li></ul></ul>", "Colorblindness", "1");

    defineAnim("eye.png", "Colorblindness"); // eye png
    defineText("Yes, color blindness does affect animals. Most animals see color differently than humans, so the way we are color blind is different, but animals can be color blind.", "Colorblindness", "2");

    defineText("Color blindness was discovered by a man named John Dalton. He was an English scientist who studied it because he and his brother both had inaccurate color vision. Fun fact: his eyes were preserved after his death. He believed that his color blindness was caused by a discoloration in his aqueous humour. He was wrong, but produced the concept right.", "History", "1");
    defineAnim("museum.png", "History"); // Museam?

    defineText("Color blindness has a fairly simple inheritance pattern, but as most things in real life it does not follow Mendelian inheritance. Color blindness has an X-linked recessive inheritance pattern. This means that whether you have it or not is based on your chromosomes. It occurs on the X-chromosome, specifically either the OPN1LW or OPN1MW genes for red green, or OPN1SW for blue yellow (in regular color blindness). This makes it so color blindness is much more common in men because they only have 1 X chromosome, meaning they only need one recessive chromosome to become colorblind.", "Inheritance", "1");

    defineAnim("dna.png", "Inheritance");

    defineText("In short, rare color blindness is caused by mutations in the genes that cause color blindness. This is because severe colorblindness is caused by a difference in the absorption of maxima of the photopigments encoded by the first two genes of the array. In summary, mutations make it so certain that all cones work ineffectively, or not at all. These kinds of conditions are caused by frameshift mutations, generally, from insertion or deletion. However, less severe cases of rarer types of color blindness are usually caused by non-detrimental point mutations such as substitution (silent is not included because it would not make an impact). <ul><li>Blue cone monochromacy is caused by having zero (or so few it's basically zero) functional red or green cones, and it is caused by a frameshift mutation caused by a deletion, or any mutation that makes the expression of the red/green gene array not work properly, or inactivate the red and green pigment genes, or both.</li><li>Total color blindness causes all cones to not function. It is caused by a mutation that makes all of the cones unable to function properly. It is not tied to a single mutation and is usually caused by several, leading to a severe frameshift, nonfunctional proteins, a different critical mutation, or both.</li></ul>", "Inheritance", "2");

    defineText("Colorblindness only has one symptom, a lack of or compromised ability to see and interpret color. Normal color blindness can be annoying at times, but it is not very impactful on my life. People with a total lack of certain color visions can struggle with certain things, such as reading some road signs or viewing and/or creating art, but the vast majority of colorblind people live perfectly normal lives.", "Existence", "1");
    defineAnim("house.png", "Existence");

    defineText("In short, there is no cure (as of now). However, there are two things you can do to decrease its effect. <ol><li>You can buy and wear colorblind glasses. They work by having lenses that adjust the color based on your specific colorblindness. They are very effective but expensive and time-consuming. To have them take effect you have to wear them for 12+ hours a day for roughly a month, and if you miss them for a certain amount of time it is reset. However, one thing to note is that the severity and type of color blindness you have, can greatly change how well the glasses work. They are very effective, but not perfect.</li><li>Gene therapies: Through gene splicing, there are now several gene therapies that attempt to fix color blindness. They do this through injecting cones into the eyes of a person, and injecting functional proteins so the working cones will be developed. They are not prominently available yet, but research studies, and trial patients have so all recovered some or all of their color vision, with little to no downsides or side effects. It is not a cure (yet), but with more time and research it may be soon.</li></ol>", "Treatments", "1");
    defineAnim("vaccine.png", "Treatments");

    defineText("If you click on one of the color wheels on the left side of the screen it will simulate a corresponding type of color blindness.<br><br>To go to a section you can click on one of the chapters at the top of the screen.<br><br>If you see a play button in the bottom right side of the screen you will need to click it to progress to the next section of the chapter (not all chapters have multiple sections).<br><br>For an alternate medium that explores this topic as well as the sources this page drew on go <a href = 'https://minuteman-my.sharepoint.com/:p:/g/personal/37977_minutemanstudent_org/ERel3UrfBRZCgTD8ifF8DmMBc7AWAlFSwcit3UyYRGeGCA?e=oB16mk'>here.</a><br><br>Sources:<br><br>Default - Stanford Medicine Children’s health. Stanford Medicine Children’s Health - Lucile Packard Children’s Hospital Stanford. (n.d.). https://www.stanfordchildrens.org/en/topic/default?id=x-linked-recessive-red-green-color-blindness-hemophilia-a-90-P02164<br><br>professional, C. C. medical. (n.d.). Color blindness: Types, causes & treatment. Cleveland Clinic. https://my.clevelandclinic.org/health/diseases/11604-color-blindness<br><br>Mulligan, K. (2018, September 5). John Dalton: The father of color blindness. EnChroma. https://enchroma.com/blogs/beyond-color/john-dalton-the-father-of-color-blindness<br><br>S;, D. S. (n.d.). Genetics of color vision deficiencies. Developments in ophthalmology. https://pubmed.ncbi.nlm.nih.gov/12876837/#:~:text=Total%20color%20blindness%20is%20another,been%20implicated%20in%20this%20disorder.<br><br>U.S. Department of Health and Human Services. (n.d.). Color blindness. National Eye Institute. https://www.nei.nih.gov/learn-about-eye-health/eye-conditions-and-diseases/color-blindness#:~:text=There’s%20no%20cure%2C%20but%20special,have%20problems%20with%20everyday%20activities.<br><br>Ucl. (2022, August 25). Gene therapy for completely colourblind children partly restores cone function. UCL News. https://www.ucl.ac.uk/news/2022/aug/gene-therapy-completely-colourblind-children-partly-restores-cone-function<br><br>U.S. National Library of Medicine. (n.d.). Color vision deficiency: Medlineplus genetics. MedlinePlus. https://medlineplus.gov/genetics/condition/color-vision-deficiency/#:~:text=Genetic%20changes%20involving%20the%20OPN1LW,mutations%20in%20the%20OPN1SW%20gene.<br><br>Manuel, David a color blind person.", "More", "1");
    defineAnim("color.jpg", "More");

    $(".ChapterImg").click(function() {
        $(".ChapterImg").css("border", "grey solid 0.25rem");
        $(this).css("border", "#41c341 solid 0.25rem");
        $(".TextContent > span").animate({ opacity: 0 });
        $(".AnimationContent > img").animate({ opacity: 0 });
        $(`.${$(this).attr("id")}-1`).animate({ opacity: 1 });
        $(`.img${$(this).attr("id")}`).animate({ opacity: 1 });
        curText = `.${$(this).attr("id")}-1`;
        curAnim = `.img${$(this).attr("id")}`;

        scrollFix(curText)

        if ($(`.${$(this).attr("id")}-2`).length == 0) {
            bounceHide(".Play");
        } else {
            bounceShow(".Play");
        }
    });

    $(".FilterImg").click(function() {
        $(":root").css("filter", "url(#" + $(this).attr("id") + ")");
        $(".FilterImg").css("border", "grey solid 0.25rem");
        $(this).css("border", "#41c341 solid 0.25rem");
    });

    $(".Play").click(function() {
        scrollFix(curText.replace(/.$/, "2"))
        $(".TextContent > span").animate({ opacity: 0 });
        $(curText.replace(/.$/, "2")).animate({ opacity: 1 });
        bounceHide(".Play");
    });
    $(".More").click(function() {
        $(".TextContent > span").animate({ opacity: 0 });
        $(".AnimationContent > img").animate({ opacity: 0 });
        $(".AnimationContent > img").animate({ opacity: 0 });
        bounceHide(".Play");
        $(".More-1").animate({ opacity: 1 });
        $(`.imgMore`).animate({ opacity: 1 });
    });
};