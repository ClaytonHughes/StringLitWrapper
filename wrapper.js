function wrapText(textelemID, wrapColumn) {
  var textElement = document.getElementById(textelemID);
  var lineList = textElement.value.split('\n');

  var output = '';

  lineList = combineContiguousStrings(lineList);

  for(var i = 0; i < lineList.length; ++i) {
    
    var thisLine = lineList[i];

    if(thisLine.length < wrapColumn || !containsWrappableString(thisLine)) {
      output += thisLine + '\n';
    } else {

      var indentLevel = thisLine.indexOf('"') + 1; // ... assuming not a quote stuck in a comment somewhere
      var charsRemaining = thisLine.length;

      // copy the first part of the line into the output as-is
      var firstCopyChars = breakPos(thisLine, wrapColumn);
      output += thisLine.substring(0, firstCopyChars) + '"\n';

      charsRemaining -= firstCopyChars;
      thisLine = thisLine.substring(firstCopyChars, thisLine.length);

      var indentText = new Array(indentLevel).join(' ');

      // copy additional lines, indenting and quoting
      while(wrapColumn - indentLevel < charsRemaining) {
        var charsToCopy = breakPos(thisLine, wrapColumn - indentLevel);
        var nextLine = thisLine.substring(0,charsToCopy);

        charsRemaining -= charsToCopy;
        thisLine = thisLine.substring(charsToCopy, thisLine.length);

        output += indentText + '"' + nextLine + '"\n';
      }

      output += indentText + '"' + thisLine + '\n';
    }
  }

  // End with only one newline
  output = ensureTrailingNewline(output);

  textElement.value = output;
  textElement.focus();
  textElement.setSelectionRange(0,0);
  textElement.scrollTop = 0;
}

function containsWrappableString(line) {
  var stringLiteral = /\".+\"/; // anything with a pair of double-quotes
  return stringLiteral.test(line);
}

function breakPos(string, maxChars) {
  var breakchars = [' ', '-'];
  var maxBreakLen = -1;

  for(var i = 0; i < breakchars.length; ++i) {
    var search = string.substring(0, maxChars - 1); // leave a space for the final "
    var lastChar = search.lastIndexOf(' ');
    if(maxBreakLen < lastChar) {
      maxBreakLen = lastChar;
    }
  }
  
  // If there's no breakable character, just tax the max:
  if(maxBreakLen < 0) {
    maxBreakLen = maxChars - 2;
  }

  return maxBreakLen + 1;
}

function combineContiguousStrings(lineList) {
  var wrappedLine = /^\s*\"/; // white space followed by a quote
  var newList = [];
  for(var i = 0; i < lineList.length; ++i) {
    if(!wrappedLine.test(lineList[i])) {
      newList.push(lineList[i]);
    } else {
      var prevLine = newList[newList.length - 1];
      var lastQuote = prevLine.lastIndexOf('"');
      prevLine = prevLine.substring(0, lastQuote); // strip off last quote character.
      var append = lineList[i].substring(lineList[i].indexOf('"')+1); // strip off first quote character

      newList[newList.length - 1] = prevLine + append;
    }
  }
  return newList;
}

function ensureTrailingNewline(text) {
  if(text[text.length -1] != '\n') {
    text += '\n'; 
  } else {
    while(text[text.length - 2] === '\n') {
      text = text.substring(0, text.length - 1);
    }
  }
  return text;
} 
