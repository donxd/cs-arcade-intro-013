
function reverseInParentheses(inputString) {
    return resolveParentheses(inputString);
}

function resolveParentheses (text) {
    const pairs = findParenthesesPair(text);

    if (pairs.length) {
        return resolvePairs(pairs, text);
    }

    return text;
}

function resolvePairs (pairs, text) {
    const textChars = text.split('');
    let textComplete = text;

    pairs.forEach(pair => {
        let fragment = textComplete.substring(pair.startPosition+1, pair.endPosition);
        const chars = fragment.split('').reverse();
        let index = (pair.startPosition+1);

        chars.forEach(character => {
            textChars[index] = character;
            index++;
        });

        textChars[pair.startPosition] = '@';
        textChars[pair.endPosition] = '@';
        textComplete = textChars.join('');
    });

    return textChars.join('').replace(/@/g, '');
}

function findParenthesesPair (text) {
    const infoPairs = dataInfoPairs(text);

    if (hasParentheses(infoPairs.text)){
        searchParentheses(infoPairs);
    }

    processDataPairs(infoPairs);

    return infoPairs.pairs;
}

function dataInfoPairs (text) {
    return {
        pairs: [],
        points: [],
        text: text
    };
}

function organizePairs (infoPairs) {
    infoPairs.pairs.sort((a, b) => {
        if (a.startPosition > b.startPosition) return 1;
        if (a.startPosition < b.startPosition) return -1;
        return 0;
    });
}

function processDataPairs (infoPairs) {
    let indexPoint = 0;
    let indexStart = -1;
    let indexEnd = -1;

    let pair = newPair();

    let pilePoints = infoPairs.points;
    let resetSearch = false;

    while (pilePoints.length && indexPoint > -1) {
        let block = pilePoints[indexPoint];

        if (block.type === 's') {
            pair.startPosition = block.position;
            indexStart = indexPoint;
        }

        if (block.type === 'e') {
            pair.endPosition = block.position;
            indexEnd = indexPoint;
            infoPairs.pairs.push(pair);

            pair = newPair();

            pilePoints = pilePoints.filter((element, indexElement) => 
                (indexElement !== indexStart && indexElement !== indexEnd)
            );

            resetSearch = true;
        }

        indexPoint++;

        if (resetSearch) {
            indexPoint -= 2;
            resetSearch = false;

            if ((indexPoint-1) > -1) {
                pair.startPosition = pilePoints[indexPoint-1].position;
                indexStart = indexPoint-1;
            }
        }
    }
}

function newPair () {
    return {
        startPosition: -1,
        endPosition: -1
    };
}

function searchParentheses (infoPairs) {
    let firstStartPoint = infoPairs.text.indexOf('(');

    infoPairs.points.push({
        position: firstStartPoint,
        type: 's'
    });
    
    for (let index = (firstStartPoint+1); index < infoPairs.text.length; index++) {
        if (infoPairs.text[index] === '(') {
            infoPairs.points.push({
                position: index,
                type: 's'
            });
        }

        if (infoPairs.text[index] === ')') {
            infoPairs.points.push({
                position: index,
                type: 'e'
            }); 
        }
    }

    return infoPairs;
}

function hasParentheses (text) {
    return text && text.length && text.indexOf('(') !== -1;
}
