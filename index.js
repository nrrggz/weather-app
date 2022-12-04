const container = document.querySelector(".container"),
informationPart = container.querySelector(".information"),
boxText = informationPart.querySelector(".info-text"),
boxPart = informationPart.querySelector("input"),
locationBtn = informationPart.querySelector("button"),
weatherInformation = container.querySelector(".info-weather"),
imageWeather = document.querySelector(".info-weather img"),
weatherBody = document.querySelector(".body"),
returningBack = container.querySelector("header i");

let api;
boxPart.addEventListener("keyup", e =>{
    if (e.key == "Enter" && boxPart.value != ""){
        requestApi(boxPart.value);
    }
});

locationBtn.addEventListener("click", () =>{
    if(navigator.geolocation){
         navigator.geolocation.getCurrentPosition(onSuccess, onError);
     }else{
         alert("Your browser not support geolocation api");
     }
     });

    function onSuccess(position){
        const{latitude, longitude}=position.coords;
        api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=05fa113414e438012693c49067410772`;
        fetchData();
    }
    
    function onError(error){
        boxText.innerText = error.message;
        boxText.classList.add("error");
    }
    
    function requestApi(city){
        api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=05fa113414e438012693c49067410772`;
        fetchData();
    } 
    
    function fetchData(){
        boxText.innerText = "Information about Weather";
        boxText.classList.add("pending");
        fetch(api).then(response => response.json()) .then(result=>weatherDetails(result));
    }
    
    function weatherDetails(informationAbout){
        if(informationAbout.cod == "404"){
            boxText.classList.replace("pending", "error" );
            boxText.innerText = `${boxPart.value} isn't a valid city name`; 
        }else{
            const city = informationAbout.name;
            const country = informationAbout.sys.country;
            const {description, id}= informationAbout.weather[0];
            const {temp, feels_like, humidity, pressure, temp_max, temp_min}= informationAbout.main;
            const {speed} = informationAbout.wind;

            if(id == 800){
                imageWeather.src = "sunny.png";
            }else if(id >=200 && id<=232){
                imageWeather.src = "storm.png";
            }else if(id >=701 && id<=781){
                imageWeather.src = "haze.png";
            }else if((id >=500 && id<=531) || (id >=300 && id<=321)){
                imageWeather.src = "rainy.png";
            }else if(id >=600 && id<=622){
                imageWeather.src = "snow.png";
            }else if(id >=801 && id<=804){
                imageWeather.src = "cloud.png";
            }

            weatherInformation.querySelector(".temperature .data").innerText=Math.floor(temp);
            weatherInformation.querySelector(".weather").innerText=description;
            weatherInformation.querySelector(".location span").innerText=`${city}, ${country}`;
            weatherInformation.querySelector(".temperature .temp-data").innerText=Math.floor(feels_like);
            weatherInformation.querySelector(".humidity span").innerText=`${humidity}%`;
            weatherInformation.querySelector(".pressure span").innerText=`${pressure}hPa`;
            weatherInformation.querySelector(".wind span").innerText=`${speed}km/h`;
            weatherInformation.querySelector(".max-temperature span").innerText=Math.floor(temp_max);
            weatherInformation.querySelector(".min-temperature span").innerText=Math.floor(temp_min);

            boxText.classList.remove("pending", "error");
            container.classList.add("active");
            console.log(informationAbout);
        }
    }
    returningBack.addEventListener("click", ()=>{
        container.classList.remove("active");
});