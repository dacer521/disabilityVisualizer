
function dyslexia(){
    let txtElements = document.getElementsByClassName("Dyslexia-1");

    if (txtElements.length > 0) {
        let txt = txtElements[0];
        
        function updateWords() {
            let words = txt.textContent.split(' '); // Get the latest text split into words
            
            function randInt(min, max) {
                return Math.floor(Math.random() * (max - min + 1)) + min;
            }

            function shuffleWord(word) {
                let wordArray = word.split(''); // Split the word into characters
                for (let i = 0; i < wordArray.length / 3; i++) {
                    let index = randInt(i, wordArray.length - 1);
                    let temp = wordArray[i];
                    wordArray[i] = wordArray[index];
                    wordArray[index] = temp;
                }
                return wordArray.join(''); 
            }

            function randomizeText(words, textElement) {
                let scrambledWords = words.map(word => shuffleWord(word)); // Scramble each word
                textElement.textContent = scrambledWords.join(' '); // Join scrambled words back into a sentence
            }

            randomizeText(words, txt); // Call the function to scramble the text
        }

        // Run every second
        setInterval(function() {
            updateWords();
        }, 1000);
    } else {
        console.error("No element found with the class 'Dyslexia-1'");
    }
}