this.wrapText = function(textelemID, wrapColumn) {
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

      // copy the first part of the line into the output as-is
      var slice = breakString(thisLine, wrapColumn);
      output += slice.line + '"\n';
      thisLine = slice.rest;

      var indentText = new Array(indentLevel).join(' ');

      // copy additional lines, indenting and quoting
      while(wrapColumn - indentLevel < thisLine.length) {
        slice = breakString(thisLine, wrapColumn - indentLevel);
        thisLine = slice.rest;

        output += indentText + '"' + slice.line + '"\n';
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

this.containsWrappableString = function(line) {
  var stringLiteral = /\".+\"/; // anything with a pair of double-quotes
  return stringLiteral.test(line);
}

this.breakString = function(string, maxChars) {
  var breakchars = [' ', '-'];
  var maxBreakLen = -1;

  for(var i = 0; i < breakchars.length; ++i) {
    var search = string.substring(0, maxChars - 1); // leave a space for the final "
    var lastChar = search.lastIndexOf(' ');
    if(maxBreakLen < lastChar) {
      maxBreakLen = lastChar;
    }
  }
  
  // If there's no breakable character, just take the max:
  if(maxBreakLen < 0) {
    maxBreakLen = maxChars - 2;
  }

  return { line: string.substring(0, maxBreakLen + 1),
           rest: string.substring(maxBreakLen + 1, string.length) };
}

this.combineContiguousStrings = function(lineList) {
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

this.ensureTrailingNewline = function(str) {
  if(str[str.length - 1] != '\n') {
    str += '\n'; 
  } else {
    var i = str.length - 1;
    while(str[i] === '\n' && 0 < i) {
      --i;      
    }
    str = str.substring(0, i+2);
  }
  return str;
} 
