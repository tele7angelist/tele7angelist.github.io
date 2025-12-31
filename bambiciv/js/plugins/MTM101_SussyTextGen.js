/*:
 * @plugindesc Generates the Sussy Text used by the sus guys
 * @author MissingTextureMan101
 * @help
 * best MTM101.makeSussyTextStandard is the main function you wanna call
*/

MTM101 = MTM101 || {}



MTM101.makeSussyText = function(words, punctuations, length, characterlimit, backtrackChance = 0.2, holdChance = 0.4, capitalChance = 0.2)
{
	//hold chance is only when backtrack chance succeeds(aka this is either going backwards or not moving at all)
	var punctuationCount = Math.floor(Math.random() * 3)
	var finalText = [];
	var attempts = 0;
	while (finalText.length < length)
	{
		var curWord = words[Math.floor(Math.random() * words.length)]
		// console.log(curWord);
		var letterIndex = 0;
		var finalWord = "";
		while (letterIndex < curWord.length)
		{
			letterIndex = Math.max(letterIndex,0)
			
			finalWord += (Math.random() <= capitalChance) ? curWord.charAt(letterIndex).toUpperCase() : curWord.charAt(letterIndex);
			
			if (Math.random() <= backtrackChance)
			{
				if (Math.random() >= holdChance)
				{
					letterIndex--
				}
			}
			else
			{
				letterIndex++
			}
		}
		finalText.push(finalWord);
		var finalTextTest = finalText.join(" ");
		if ((finalTextTest.length > characterlimit))
		{
			//console.log("Sequence too long! (" + finalTextTest.length + ")");
			attempts++
			finalText.pop();
			if (attempts > 10)
			{
				finalText.push("")
			}
		}
	}
	for (var i=0; i < punctuationCount; i++)
	{
		finalText[Math.floor(Math.random() * finalText.length)] += punctuations[Math.floor(Math.random() * punctuations.length)];
	}
	finalText[finalText.length - 1] += punctuations[Math.floor(Math.random() * punctuations.length)]; // add punctuation to last word
	return finalText.join(" ").trim();
}

MTM101.makeSussyTextStandard = function()
{
	return MTM101.makeSussyText(
	[
		"among",
		"us",
		"when",
		"the",
		"impostor",
		"is",
		"sus",
		"run",
		"attack",
		"flee",
		"kill",
		"murder",
		"are",
		"you",
		"pain",
		"help",
		"amogus",
		"save",
		"me",
		"please",
		"mongus",
		"stop",
		"ragh",
		"vent",
		"grrr"
	],
	[
		".",
		"!!!",
		"/?",
		"?",
		"!1",
		"1!",
		"!1!",
		"//?",
		"?!/",
		"/",
		"..",
		"...",
		"!??",
		".?",
		"!5.",
		"!5",
		";",
		"//.",
		"!"
	],8, 66);
}


MTM101.makeSussyTextPain = function()
{
	return MTM101.makeSussyText(
	[
		"ow",
      	"ouch",
      	"owie",
      	"hurt",
      	"pain",
		"sus",
      	"youch",
      	"danger",
      	"help",
      	"blood",
      	"shatter",
      	"glass",
      	"cut",
      	"injury",
      	"why",
      	"sorry",
      	"bleeding",
      	"hurting",
      	"please",
      	"among",
      	"us",
      	"knocked",
      	"out",
      	"cant",
      	"breathe"
	],
	[
		".",
		"!!!",
		"/?",
		"?",
		"!1",
		"1!",
		"!1!",
		"//?",
		"?!/",
		"/",
		"..",
		"...",
		"!??",
		".?",
		"!.",
		"!",
		"!!.!",
		"//!",
		"!"
	],4, 66);
}

MTM101.makeSussyTextFled = function()
{
	return MTM101.makeSussyText(
	[
		"among",
      	"us",
      	"sus",
      	"lost",
      	"fled",
		"confused",
      	"missing",
      	"missed",
      	"escape",
      	"escaped",
      	"escaping",
      	"freedom",
      	"good",
		"pain",
      	"must",
      	"hurt",
      	"come",
      	"back",
      	"alone",
      	"scared",
      	""
	],
	[
		".",
		"!!!",
		"/?",
		"?",
		"!1",
		"1!",
		"!1!",
		"//?",
		"?!/",
		"/",
		"..",
		"...",
		"!??",
		".?",
		"!?.",
		"!?",
		";",
		"//.",
		"!"
	],5, 66);
}

MTM101.InvertCapitilization = function(txt)
{
	var invertedText = "";
	for (var i = 0; i < txt.length; i++)
	{
		var character = txt[i];
		if (character == character.toUpperCase())
		{
			invertedText += character.toLowerCase();
		}
		else
		{
			invertedText += character.toUpperCase();
		}
	}
	return invertedText;
}

MTM101.InsertString = function(ogTxt, newTxt, start, end)
{
	if (ogTxt.length != newTxt.length)
	{
		console.error("Attempted to two strings with non-matching lengths!");
		return "";
	}
	var finalText = "";
	for (var i = 0; i < ogTxt.length; i++)
	{
		if ((i >= start) && (i <= end))
		{
			finalText += newTxt[i];
		}
		else
		{
			finalText += ogTxt[i];
		}
	}
	return finalText;
}

MTM101.RandomlyCapitializeString = function(txt, flipCount, maxLength)
{
	var currentText = txt;
	for (var i = 0; i < flipCount; i++)
	{
		var startIndex = Math.round(Math.random() * (currentText.length - 1))
		var endIndex = Math.min(startIndex + Math.round(Math.random() * maxLength), currentText.length - 1)
		var flippedTxt = MTM101.InvertCapitilization(currentText)
		currentText = MTM101.InsertString(currentText, flippedTxt, startIndex, endIndex)
	}
	return currentText
}

MTM101.PCembiName = function(nm)
{
	return MTM101.RandomlyCapitializeString(nm, 3, 5)
}