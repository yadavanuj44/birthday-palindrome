const dateInput = document.querySelector("#date-input")
const checkButton = document.querySelector("#check-btn")
const output = document.querySelector("#output")



function reverseStr(str) { 
    return str.split('').reverse().join('')
}

function checkPalindrome(str) {
    var revStr = reverseStr(str);
    return str === revStr;
}

function convertDateToString(date) {
   var dateStr = { day: '', month: '', year: '' };
   if(date.day < 10) {
       dateStr.day = '0' + date.day;
   } else {
       dateStr.day = date.day.toString();
   }
   if(date.month < 10) {
    dateStr.month = '0' + date.month;
    } else {
        dateStr.month = date.month.toString();
    }
    dateStr.year = date.year.toString();
    return dateStr;
}

function getAllDateFormats(date) {
    var dateStr = convertDateToString(date);
    var ddmmyyyy = dateStr.day + dateStr.month + dateStr.year;
    var mmddyyyy = dateStr.month + dateStr.day + dateStr.year;
    var yyyymmdd = dateStr.year + dateStr.month + dateStr.day;
    var ddmmyy = dateStr.day + dateStr.month + dateStr.year.slice(-2);
    var mmddyy = dateStr.month + dateStr.day + dateStr.year.slice(-2);
    var yymmdd = dateStr.year.slice(-2) + dateStr.month + dateStr.day;
    return [ddmmyyyy, mmddyyyy, yyyymmdd, ddmmyy, mmddyy, yymmdd];
}

function checkPalindromeForAllDateFormats(date) {
    var listOfPalindromes = getAllDateFormats(date);
    var isPalindrome = false;
    for(var i=0; i<listOfPalindromes.length; i++) {
        if(checkPalindrome(listOfPalindromes[i])) {
            isPalindrome = true;
            break;
        }
    }
    return isPalindrome;
}

function isLeapYear(year) {
    if(year % 400 === 0) {
        return true;
    }
    if(year % 100 === 0) {
        return false;
    }
    if(year % 4 === 0) {
        return true;
    }
    return false;
}

function getNextDate(date) {
    var day = date.day + 1;
    var month = date.month;
    var year = date.year;

    var daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    if(month === 2) {
        if(isLeapYear(year)) {
            if(day > 29) {
                day = 1;
                month++;
            }
        } else {
            if(day > 28) {
                day = 1;
                month++;
            }
        }
    } else {
        if(day > daysInMonth[month - 1]) {
            day = 1;
            month++;
        }
    }
    if(month > 12) {
        month = 1;
        year++;
    }
    return {
        day: day,
        month: month,
        year: year
    };
} 

function getPreviousDate(date) {
    var day = date.day - 1;
    var month = date.month;
    var year = date.year;

    var daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    if(month === 3) {
        if(isLeapYear(year)) {
            if(day === 0) {
                day = 29;
                month--;
            }
        } else {
            if(day === 0) {
                day = 28;
                month--;
            }
        }
    } else {
        if(day === 0) {
            month--;
            day = daysInMonth[month-1];
        }
    }
    if(month === 0) {
        month = 12;
        day = daysInMonth[month-1];
        year--;
    }
    return {
        day: day,
        month: month,
        year: year
    };
} 

function getNextPalindromeDate(date) {
    var ctr = 0;
    var nextDate = getNextDate(date);
    while(1) {
        ctr++;
        var isPalindrome = checkPalindromeForAllDateFormats(nextDate);
        if(isPalindrome) {
            break;
        }
        nextDate = getNextDate(nextDate);
    }
    return [ctr, nextDate];
}

function getPreviousPalindromeDate(date) {
    var ctr = 0;
    var prevDate = getPreviousDate(date);
    while(1) {
        ctr--;
        var isPalindrome = checkPalindromeForAllDateFormats(prevDate);
        if(isPalindrome) {
            break;
        }
        prevDate = getPreviousDate(prevDate);
    }
    return [ctr, prevDate];
}

function getNearestDate(nextDate, prevDate) {
    if(nextDate[0] < Math.abs(prevDate[0])) {
        return nextDate;
    }
    return prevDate;
}



function showMessage(message) {
    output.innerText = message;
}

checkButton.addEventListener("click", function checkPalindromeBirthdayHandler() {
    var dateStr = dateInput.value;
    if(dateStr !== '') {
        var listOfDate = dateStr.split("-")
        var date = {
            day: Number(listOfDate[2]),
            month: Number(listOfDate[1]),
            year: Number(listOfDate[0])
        }
        var isPalindrome = checkPalindromeForAllDateFormats(date);
        if(isPalindrome) {
            showMessage("Yes, Your birthday is a palindrome.")
        } else {
            var [ctr, palindromeDate] = getNearestDate(getNextPalindromeDate(date), getPreviousPalindromeDate(date));
            if(ctr < 0) {
                showMessage("No, Your birthday is not a palindrome. The nearest palindrome date is " + palindromeDate.day + "-" + palindromeDate.month + "-" + palindromeDate.year + " which is " + Math.abs(ctr) + " days before your birthday.");
            } else {
                showMessage("No, Your birthday is not a palindrome. The nearest palindrome date is " + palindromeDate.day + "-" + palindromeDate.month + "-" + palindromeDate.year + " which is " + ctr + " days after your birthday.");
            }
            
        }
    } else {
        showMessage("Enter your DOB.");
    }
})