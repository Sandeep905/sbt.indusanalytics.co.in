
// Valid Email
function NONE(val) {
    var x, text;
    var get_Valid = "ValStr" + val.id;
    x = document.getElementById(val.id).value;
    return true;
}

//Numeric With Validate Mob.No.
function NumericWithPhone(val) {
    var x, text;
    var get_Valid = "ValStr" + val.id;
    x = document.getElementById(val.id).value;
    if (isNaN(x)) {
        text = "Input not valid..Please enter numeric value..";
        document.getElementById(get_Valid).style.display = "block";
        document.getElementById(get_Valid).innerHTML = text;
        document.getElementById(val.id).value = "";
        document.getElementById(val.id).focus();
        return false;
    } else if (x.length < 10 || x.length > 10) {
        text = "Input Only 10 degits valid..";
        document.getElementById(get_Valid).style.display = "block";
        document.getElementById(get_Valid).innerHTML = text;
        document.getElementById(val.id).value = "";
        document.getElementById(val.id).focus();
        return false;
    }
    document.getElementById(get_Valid).style.display = "none";
}

// Only Numeric
function Numeric(val) {
    var x, text;
    var get_Valid = "ValStr" + val.id;
    x = document.getElementById(val.id).value;
    if (isNaN(x)) {
        text = "Input not valid..Please enter numeric value..";
        document.getElementById(get_Valid).style.display = "block";
        document.getElementById(get_Valid).innerHTML = text;
        document.getElementById(val.id).value = "";
        document.getElementById(val.id).focus();
        return false;
    }
    document.getElementById(get_Valid).style.display = "none";
}

// Valid Email
function EmailValidation(val) {
    var x, text;
    var get_Valid = "ValStr" + val.id;
    x = document.getElementById(val.id).value;
    
    if (x.indexOf("@", 0) < 0) {
        text = "Please enter valid Email..";
        document.getElementById(get_Valid).style.display = "block";
        document.getElementById(get_Valid).innerHTML = text;
        document.getElementById(val.id).value = "";
        document.getElementById(val.id).focus();
        return false;
    }
    else if (x.indexOf(".", 0) < 0) {
        text = "Please enter valid Email..";
        document.getElementById(get_Valid).style.display = "block";
        document.getElementById(get_Valid).innerHTML = text;
        document.getElementById(val.id).value = "";
        document.getElementById(val.id).focus();
        return false;
    }
    document.getElementById(get_Valid).style.display = "none";
}

//Decimal value
function Decimal(val) {
    var x, text;
    var get_Valid = "ValStr" + val.id;
    x = document.getElementById(val.id).value;
    var decimal = /^[0-9]+\.?[0-9]*$/;
   
    if (decimal.test(x) == true) {
        document.getElementById(get_Valid).style.display = "none";
        return true;
    }
    else {
        text = 'This field must have alphanumeric OR decimal characters only';
        document.getElementById(get_Valid).style.display = "block";
        document.getElementById(get_Valid).innerHTML = text;
        document.getElementById(val.id).value = "";
        document.getElementById(val.id).focus();
        return false;
    }

    //if (!decimal.test(x)) {
    //    text = "Input not valid..Please enter numeric value..";
    //    document.getElementById(get_Valid).style.display = "block";
    //    document.getElementById(get_Valid).innerHTML = text;
    //    document.getElementById(val.id).value = "";
    //    document.getElementById(val.id).focus();
    //    return false;
    //}
    //document.getElementById(get_Valid).style.display = "none";
}

//Alfabate alfaNumeric Value
function numericAlfabate(val) {
    var x, text;
    var get_Valid = "ValStr" + val.id;
    x = document.getElementById(val.id).value;
    var letters = /^[0-9a-zA-Z]+$/;

    if (x.match(letters)) {
        document.getElementById(get_Valid).style.display = "none";
        return true;
    }
    else {
        text = 'This field must have alphanumeric characters only';
        document.getElementById(get_Valid).style.display = "block";
        document.getElementById(get_Valid).innerHTML = text;
        document.getElementById(val.id).value = "";
        document.getElementById(val.id).focus();
        return false;
    }
}

//alphabet characters only
function Alphabet(val) {
    var x, text;
    var get_Valid = "ValStr" + val.id;
    x = document.getElementById(val.id).value;
    var letters = /^[A-Za-z]+$/;

    if (x.match(letters)) {
        document.getElementById(get_Valid).style.display = "none";
        return true;
    }
    else {
        text = 'This field must have alphabet characters only';
        document.getElementById(get_Valid).style.display = "block";
        document.getElementById(get_Valid).innerHTML = text;
        document.getElementById(val.id).value = "";
        document.getElementById(val.id).focus();
        return false;
    }
}

//Password With bitween length
function PassWithLength(val) {
    var x, text;
    var get_Valid = "ValStr" + val.id;
    x = document.getElementById(val.id).value;
    if (x.length <= 4) {
        text = "Password should not be empty / length be between 5 to 10";
        document.getElementById(get_Valid).style.display = "block";
        document.getElementById(get_Valid).innerHTML = text;
        document.getElementById(val.id).value = "";
        document.getElementById(val.id).focus();
        return false;
    }
    else if (x.length > 10) {
        text = "Password should not be empty / length be between 5 to 10";
        document.getElementById(get_Valid).style.display = "block";
        document.getElementById(get_Valid).innerHTML = text;
        document.getElementById(val.id).value = "";
        document.getElementById(val.id).focus();
        return false;
    }
    document.getElementById(get_Valid).style.display = "none";
}

//Numeric characters only
function ZipCodeNumeric(val) {
    var x, text;
    var get_Valid = "ValStr" + val.id;
    x = document.getElementById(val.id).value;
    var numbers = /^[0-9]+$/;

    if (x.match(numbers)) {
        document.getElementById(get_Valid).style.display = "none";
        return true;
    }
    else {
        text = 'This field must have numeric characters only';
        document.getElementById(get_Valid).style.display = "block";
        document.getElementById(get_Valid).innerHTML = text;
        document.getElementById(val.id).value = "";
        document.getElementById(val.id).focus();
        return false;
    }
}

