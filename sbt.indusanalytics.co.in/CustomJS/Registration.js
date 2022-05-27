"use strict";

var OTPVarified = false;
var chkotpstatus = false;
var countryListAllIsoData = [];

fillcountry();
function fillcountry() {
   /// for (let i = 0; i <= countryListAllIsoData.length; i++) {
        $('#country-select')
            .append($("<option></option>")
                .attr("value", "+91")
                .text("India"));
    //}
}

$(document).ready(function () {
    $("input").focusout(function (e) {
        if (e.currentTarget.attributes.id.nodeValue === "Phone") {
            var ph_no = document.getElementById("Phone").value;
            var Ph_Ok = validatePhoneNumber(ph_no);
            if (Ph_Ok === true) {
                document.getElementById('forphone').removeAttribute("style");
            } else {
                document.getElementById('forphone').style.borderBottom = "1px solid #ff3300";
            }
        } else if (e.currentTarget.attributes.id.nodeValue === "email") {
            var Mail_Add = document.getElementById("email").value;
            var Em_Ok = ValidateEmail(Mail_Add);
            if (Em_Ok === true) {
                document.getElementById('email').removeAttribute("style");
            } else {
                document.getElementById('email').style.borderBottom = "1px solid #ff3300";
            }
        }
    });
});


$("#btnRegister").click(function () {

    var prifix = document.getElementById("country-select").value;
    var ph_no = document.getElementById("Phone").value;
    var Mail_Add = document.getElementById("email").value;
    var Country = $("#country-select option:selected").text();
    var User_Name = document.getElementById("UserName").value.trim();
    var Company_Name = document.getElementById("CompanyName").value.trim();
    var Em_Ok = ValidateEmail(Mail_Add);
    var Ph_Ok = validatePhoneNumber(ph_no);
    
    $("#validateMsg").addClass("hidden");
    document.getElementById('validateMsg').innerHTML = "";

    if (Em_Ok === false) {
        document.getElementById("email").focus();
        document.getElementById('email').style.borderBottom = "1px solid #ff3300";
        document.getElementById('validateMsg').innerHTML = "Invalid email, please check your email again";
        $("#validateMsg").removeClass("hidden");
        return;
    }
    if (Ph_Ok === false) {
        document.getElementById('Phone').style.borderBottom = "1px solid #ff3300";
        document.getElementById('validateMsg').innerHTML = "Invalid phone number, please check your number again";
        $("#validateMsg").removeClass("hidden");
        document.getElementById("Phone").focus();
        return;
    }
    if (User_Name === "") {
        document.getElementById("UserName").focus();
        document.getElementById('UserName').style.borderBottom = "1px solid #ff3300";
        document.getElementById('validateMsg').innerHTML = "Please enter user name";
        $("#validateMsg").removeClass("hidden");
        return;
    }
    if (Company_Name === "") {
        document.getElementById("CompanyName").focus();
        document.getElementById('CompanyName').style.borderBottom = "1px solid #ff3300";
        document.getElementById('validateMsg').innerHTML = "Empty Company Name, please enter your company name";
        $("#validateMsg").removeClass("hidden");
        return;
    }
    if (document.getElementById("LabelMob").innerHTML.trim() !== ph_no){
        OTPVarified = false;
    }
    document.getElementById("LabelMob").innerHTML = ph_no;

    if (OTPVarified === false) {
	    $("#loader").fadeIn();
	    $("#loader-wrapper").fadeIn("fast");
				
        /// for OTP verification
        $.ajax({
            async: false,
            type: "POST",
            url: "UserAuthentication.asmx/SendOtp",
            data: '{MobNo:' + JSON.stringify(ph_no) + ',prifix:' + JSON.stringify(prifix) + '}',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (results) {
                if (results.d === "Success") {
                    document.getElementById('validateMsg').innerHTML = "OTP sent successfully! ";
                    $("#OtpVerify").removeClass("hidden");
                    $("#form1").addClass("hidden");
                    chkotpstatus = true;
                } else {
                    document.getElementById('validateMsg').innerHTML = results.d;
                }
                $("#validateMsg").removeClass("hidden");

		        $("#loader").fadeOut();
		        $("#loader-wrapper").fadeOut("fast");				
            },
            error: function (e) {
                console.log(e);
		        $("#loader").fadeOut();
		        $("#loader-wrapper").fadeOut("fast");				
            }
        });
    }
});

$("#btnSubmitOtp").click(function () {
    if(chkotpstatus == false) return;
    var ph_no = document.getElementById("Phone").value;
    var Mail_Add = document.getElementById("email").value;
    var Country = $("#country-select option:selected").text();
    var User_Name = document.getElementById("UserName").value;
    var Company_Name = document.getElementById("CompanyName").value;
    var Otp = document.getElementById("txtOTP").value;
    
    var Em_Ok = ValidateEmail(Mail_Add);
    var Ph_Ok = validatePhoneNumber(ph_no);
    $("#validateMsg").addClass("hidden");
    document.getElementById('validateMsg').innerHTML = "";

    if (Em_Ok === false) {
        document.getElementById("email").focus();
        document.getElementById('email').style.borderBottom = "1px solid #ff3300";
        document.getElementById('validateMsg').innerHTML = "Invalid email, please check your email again";
        $("#validateMsg").removeClass("hidden");
        return;
    }
    if (Ph_Ok === false) {
        document.getElementById('Phone').style.borderBottom = "1px solid #ff3300";
        document.getElementById('validateMsg').innerHTML = "Invalid phone number, please check your number again";
        $("#validateMsg").removeClass("hidden");
        document.getElementById("Phone").focus();
        return;
    }
    if (User_Name === "") {
        document.getElementById("UserName").focus();
        document.getElementById('UserName').style.borderBottom = "1px solid #ff3300";
        document.getElementById('validateMsg').innerHTML = "Please enter user name";
        $("#validateMsg").removeClass("hidden");
        return;
    }
    if (Company_Name === "") {
        document.getElementById("CompanyName").focus();
        document.getElementById('CompanyName').style.borderBottom = "1px solid #ff3300";
        document.getElementById('validateMsg').innerHTML = "Empty Company Name, please enter your company name";
        $("#validateMsg").removeClass("hidden");
        return;
    }
  
    if (Otp === ""|| Otp.length <= 0){
        document.getElementById('validateMsg').innerHTML = "Please enter OTP first..!";
        $("#validateMsg").removeClass("hidden");
        document.getElementById("txtOTP").focus();
        return;
    }
    if (Otp.length < 4){
        document.getElementById('validateMsg').innerHTML = "Invalid OTP entered..!";
        $("#validateMsg").removeClass("hidden");
        document.getElementById("txtOTP").focus();
        return;
    }

	$("#loader").fadeIn();
	$("#loader-wrapper").fadeIn("fast");
				
    /// for confirm OTP
    $.ajax({
        type: "POST",
        url: "UserAuthentication.asmx/confirmOTP",
        data: '{UserOTP:' + JSON.stringify(document.getElementById("txtOTP").value) + '}',
        contentType: "application/json; charset=utf-8",
        dataType: "text",
        success: function (results) {
            var res = results.replace(/"/g, '');
            res = res.replace(/d:/g, '');
            res = res.replace(/{/g, '');
            res = res.replace(/}/g, '');
            $("#validateMsg").removeClass("hidden");
            if (res === "Success") {
                document.getElementById('validateMsg').innerHTML = "Mobile number varified successfully...! ";
                $.ajax({
                    type: "POST",
                    url: "UserAuthentication.asmx/SaveData",
                    data: '{Country:' + JSON.stringify(Country) + ',ph_no:' + JSON.stringify(ph_no) + ',Mail_Add:' + JSON.stringify(Mail_Add) + ',User_Name:' + JSON.stringify(User_Name) + ',Company_Name:' + JSON.stringify(Company_Name) + '}',
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function (results) {
                        $("#validateMsg").removeClass("hidden");				
                        if (results.d.includes("failed")) {
                            document.getElementById('validateMsg').innerHTML = results.d;
                        } else if (results.d.includes("already exist")){
                            document.getElementById('validateMsg').innerHTML = results.d;
                        } else {
                            window.location.href = results.d;
                            window.location.href.reload(true);
                        }
	                    $("#loader").fadeOut();
	                    $("#loader-wrapper").fadeOut("fast");
                    },
                    error: function (e) {
                        console.log(e);
	                    $("#loader").fadeOut();
	                    $("#loader-wrapper").fadeOut("fast");				
                    }
                });

            } else if (res === "Failed") {
                document.getElementById('validateMsg').innerHTML = "Your OTP is incorrect...!";
            } else {
                document.getElementById('validateMsg').innerHTML = res;
            }
	        $("#loader").fadeOut();
	        $("#loader-wrapper").fadeOut("fast");
        },
        error: function (e) {
            console.log(e);
	        $("#loader").fadeOut();
	        $("#loader-wrapper").fadeOut("fast");				
        }
    });
});

$("#btnModifyNumber").click(function(){
    document.getElementById('validateMsg').innerHTML = "";    
    $("#OtpVerify").addClass("hidden");
    $("#form1").removeClass("hidden");
});

$('.phone').focusout(function (e) {
    document.getElementById('forphone').style.borderBottom = "1px solid #fff";
});

function validatePhoneNumber(input_str) {
    var re = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
    return re.test(input_str);
}
function ValidateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}
