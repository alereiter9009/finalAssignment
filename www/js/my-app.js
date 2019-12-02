// Initialize app
var myApp = new Framework7();


// If we need to use custom DOM library, let's save it to $$ variable:
var $$ = Dom7;

// Add view
var mainView = myApp.addView('.view-main', {
    // Because we want to use dynamic navbar, we need to enable it for this view:
    dynamicNavbar: true
});

// Handle Cordova Device Ready Event
$$(document).on('deviceready', function() {
    console.log("Device is ready!");
    getLocation();
});


// Now we need to run the code that will be executed only for About page.

// Option 1. Using page callback for page (for "about" page in this case) (recommended way):
myApp.onPageInit('about', function (page) {
    // Do something here for "about" page

})

// Option 2. Using one 'pageInit' event handler for all pages:
$$(document).on('pageInit', function (e) {
    // Get page data from event data
    var page = e.detail.page;

    if (page.name === 'about') {
        // Following code will be executed for page with data-page attribute equal to "about"
        myApp.alert('Here comes About page');
    }
})

// Option 2. Using live 'pageInit' event handlers for each page
$$(document).on('pageInit', '.page[data-page="about"]', function (e) {
    // Following code will be executed for page with data-page attribute equal to "about"
    myApp.alert('About page');
});


//Creating function for calling plugin for GeoLocation
getLocation = () => navigator.geolocation.getCurrentPosition(geoCallback, onError);




// Call Back function that receives an argument of "position"
geoCallback = (position) => {
    //Variable created for representing the latitude 
    var latitude = position.coords.latitude;
    //Variable created for representing the longitude
    var longitude = position.coords.longitude;
    var latElement = document.getElementById('lat');
    var longElement = document.getElementById('long');
    // Adding Lat and Long to HTML
    latElement.innerHTML = 'Latitude: ' + latitude;
    longElement.innerHTML = 'Longitude: ' + longitude;
    // Calling openCageApi with lat and long provided by geoLocation
    openCageApi(latitude, longitude);
    // Calling openWeatherAPI with geoLocation
    openWeatherApi(latitude, longitude);
    
    // Blabla
    initMap(latitude, longitude);
}
onError = (error) => {
    alert("code: " + error.code + "\n" + "message: " + error.message + "\n");
}
// Function for adding marker based on your Lat and Long

// Function for Creating Google Map and adding marker based on your Lat and Long
initMap = (lat, lng) => {
    //creating variable with current location
    var currentLocation = {lat, lng};
    // creating the map itself and adding it based on the currentlocation
    var map = new google.maps.Map(document.getElementById('map'), { zoom: 13, center: currentLocation});
    var marker = new google.maps.Marker({position: currentLocation, map: map});
}

// function developed for calling API OpenCage, receiving the arguments of lat and long provided by the GPS
openCageApi = (lat, long) => {
    // My ApiKey below
    var myApiKey = 'a2c46e1f53c34b8bb6415250686f60a3';
    var http = new XMLHttpRequest();
    // URL constructed using API call and lat, long, as well as my private key
    const url = 'https://api.opencagedata.com/geocode/v1/json?q=' + lat + '+' + long + '&key=' + myApiKey;
    http.open("GET", url);
    http.send();
    http.onreadystatechange = (e) => {
        var response = http.responseText;
        // Assigning the desired elements from the JSON parsed response to variables
        var responseJSON = JSON.parse(response);
        // Country value string assigned to variable
        var country = responseJSON.results[0].components.country;
        // City value string assigned to variable
        var city = responseJSON.results[0].components.city;
        //Currency value string assigned to a variable
        var currencyAtm = responseJSON.results[0].annotations.currency.iso_code;
        // joga num input text type hide field
        //Elements being added to desired placeholders
        document.getElementById('city').innerHTML = 'City: ' + city;
        document.getElementById('country').innerHTML = 'Country: ' + country;
        document.getElementById('currencyHolder').value = currencyAtm;
        document.getElementById('local').innerHTML = "Local Currency: " + currencyAtm;

    }
}

//Function Created to Convert USD to EUR
usdToLocal = () => {
    // My ApiKey below
    var myApiKey = 'baf008a3dd0b4c2acf4504d9c4cea6cc';
    var globalCurrency = document.getElementById('currencyHolder').value;
    var http = new XMLHttpRequest();
    // The URL provided by the API, with my API key
    const url = 'http://www.apilayer.net/api/live?access_key=' + myApiKey;
    http.open("GET", url);
    http.send();
    http.onreadystatechange = (e) => {
        // assigning the response from the API into the desired variables
        var response = http.responseText;
        var responseJSON = JSON.parse(response);
        // Assigning the desired elements from the JSON parsed response to a variable
        var currency = responseJSON.quotes["USD" + globalCurrency];
        // Fetching the input from the user, in this case the currency amount
        var currencyAmount = document.getElementById('currencyUsd').value;
        // Converting the amount in USD to Currency
        var converted = currencyAmount * currency;
        converted = converted.toFixed(2);
        // Acessing the currency placeholder and modifying it to show the converted currency
        document.getElementById('convCurHolder').innerHTML = 'Converted currency : ' + converted + ' ' + globalCurrency;

    }
}

//Function Created to Convert USD to EUR
localToUsd = () => {
    // My ApiKey below
    var myApiKey = 'baf008a3dd0b4c2acf4504d9c4cea6cc';
    var globalCurrency = document.getElementById('currencyHolder').value;
    var http = new XMLHttpRequest();
    // The URL provided by the API, with my API key
    const url = 'http://www.apilayer.net/api/live?access_key=' + myApiKey;
    http.open("GET", url);
    http.send();
    http.onreadystatechange = (e) => {
        // assigning the response from the API into the desired variables
        var response = http.responseText;
        var responseJSON = JSON.parse(response);
        // Assigning the desired elements from the JSON parsed response to a variable
        var currency = responseJSON.quotes["USD" + globalCurrency];
        // Fetching the input from the user, in this case the currency amount
        var currencyAmount = document.getElementById('currencyEur').value;
        // Converting the amount of Local Currency to USD
        var converted = currencyAmount / currency;
        converted = converted.toFixed(2);
        // Acessing the placeholder and modifying it to show the converted currency
        document.getElementById('localCurHolder').innerHTML = 'Converted currency : ' + converted + " USD";

    }
}

// Function developed for calling openWeather API, receiving the arguments of lat and long provided by the GPS
openWeatherApi = (lat, long) => {
    // API Key provided by API
    var myApiKey = '88df3867373faf45aebcbf8b7dd1f60d';
    var http = new XMLHttpRequest();
    // URL Necessary for calling API with lat,long,apikey and metric units provided
    const url = 'http://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + long + '&APPID=' + myApiKey + '&units=metric';
    http.open("GET", url);
    http.send();
    http.onreadystatechange = (e) => {
        var response = http.responseText;
        // Parsing JSON response
        var responseJSON = JSON.parse(response);
        // Assigning MinTemp to a variable
        var minTemperature = responseJSON.main.temp_min;
        // Assigning MaxTemp to a variable
        var maxTemperature = responseJSON.main.temp_max;
        // Assgining Humidity to a variable
        var humidity = responseJSON.main.humidity;
        //Assigning Weather Description to a variable
        var mainWeather = responseJSON.weather[0].description;
        //Adding all variables as text to innerHTML in weather placeholder
        document.getElementById('weather').innerHTML = 'Min: ' + minTemperature + ' C' + '<br>' + 'Max: ' + maxTemperature + ' C' + '<br>' + 'Humidity: ' + humidity + ' %' + '<br>' + 'Current Weather: ' + mainWeather;

    }
};


// File Reading and Writing

tryingFile = () => window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, fileSystemCallback, onError);

fileSystemCallback = (fs) => {

    // Name of the file I want to create
    var fileToCreate = "test112File.txt";

    // Opening/creating the file
    fs.root.getFile(fileToCreate, fileSystemOptionals, getFileCallback, onError);
}

var fileSystemOptionals = { create: true, exclusive: false };



getFileCallback = (fileEntry) => {

    var dataObj = new Blob([
        document.getElementById('city').innerHTML, document.getElementById('country').innerHTML, document.getElementById('local').innerHTML, document.getElementById('lat').innerHTML, document.getElementById('long').innerHTML], {
        type: 'text/plain'
    });
    // Now decide what to do
    // Write to the file
    writeFile(fileEntry, dataObj);

    // Or read the file
    readFile(fileEntry);
}

// Let's write some files
writeFile = (fileEntry, dataObj) => {

    // Create a FileWriter object for our FileEntry (log.txt).
    fileEntry.createWriter(function (fileWriter) {

        // If data object is not passed in,
        // create a new Blob instead.
        if (!dataObj) {
            dataObj = new Blob([
                document.getElementById('city').innerHTML, document.getElementById('country').innerHTML, document.getElementById('local').innerHTML, document.getElementById('lat').innerHTML, document.getElementById('long').innerHTML], {
                type: 'text/plain'
            });
        }

        fileWriter.write(dataObj);

        fileWriter.onwriteend = function () {
            console.log("Successful file write...");
        };

        fileWriter.onerror = function (e) {
            console.log("Failed file write: " + e.toString());
        };

    });
}

// Let's read some files
readFile = (fileEntry) => {

    // Get the file from the file entry
    fileEntry.file(function (file) {

        // Create the reader
        var reader = new FileReader();
        reader.readAsText(file);

        reader.onloadend = function () {

            console.log("Successful file read: " + this.result);
            console.log("file path: " + fileEntry.fullPath);
            document.getElementById('content').innerHTML = this.result;

        };

    }, onError);
}

onError = (msg) => console.log(msg);
