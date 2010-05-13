
function getDate() {
    var days = 
    [
        "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
    ];
    var months =
    [
        "January", "February", "March", "April", "May", "June", "July", "August",
        "September", "October", "November", "December"
    ];

    var dt = new Date();
    
    var longdate = days[dt.getDay()] + ", " + 
                   months[dt.getMonth()] + " " + 
                   dt.getDate() + ", " + 
                   dt.getFullYear();
    
    return longdate;
}

function getTime() {
    var dt = new Date();
    
    var hour = dt.getHours();
    
    var am_pm = " AM";
    if( hour >= 12 ) am_pm = " PM";
    if( hour == 0 ) hour = 12;
    if( hour > 12 ) hour -= 12;
    
    var minutes = dt.getMinutes().toString();
    if (minutes.length == 1) minutes = "0" + minutes;
    
    return hour + ":" + minutes + am_pm;
}
