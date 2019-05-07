var ip = require('ip')
const chalk = require('chalk');
var internetAvailable = require("internet-available");
const request = require('request')
const NewsAPI = require('newsapi');
const newsapi = new NewsAPI('5687f28192564a3aa23b060a11cf8f9b');

const mbxClient = require('@mapbox/mapbox-sdk');
const mbxGeocodingClient = require('@mapbox/mapbox-sdk/services/geocoding');

const baseClient = mbxClient({ accessToken: 'pk.eyJ1IjoibWFhenVkZGluIiwiYSI6ImNqdW8xdTBiazE5bDgzeXB3M3IxbzA3NTIifQ.bVvx_uKuNVBfEf680xtVAA' });
const geocodingClient = mbxGeocodingClient(baseClient);




const getIp = () =>{
    return ip.address()
}

const getIpDetails = () => {
    const url = 'https://api.ipgeolocation.io/ipgeo?apiKey=ad7705d5417146f9adc16b2f5a1a3696';

    const callback = (error, response) => {
         if(response != undefined){
             //console.log("error: ", error)
             //console.log('StatusCode: ', response && response.statusCode)
             //console.log("response body: ", response && JSON.parse(response.body))


            if (response.statusCode == 200) {
                const jdata = JSON.parse(response.body)
               // console.log(jdata.city)
                getLonglat(jdata.city);
            } else {
                console.log(error)
            }
        }else{
             console.log(chalk.bgRedBright.white.bold(' Internet Problem ! '))
        }
 
    }
    request(url, callback)
}

const getNewsDetails = (country) => {
     let countryl = country.toLowerCase()
//    console.log(countryl)
    newsapi.v2.topHeadlines({  

        country: countryl
    }).then(response => {
  //      console.log(response)

        if(response.status == 'ok'){
            console.log('')
            console.log(chalk.bgBlue.white.bold(' News : '))
            console.log('')
            if(response.articles.length != 0){
                for (let i = 0; i < 5; i++) {

                    console.log(chalk.bgYellowBright.black.bold(' News Head : '),response.articles[i].title)
                   
                    console.log(chalk.bgYellowBright.black.bold(' News :'),response.articles[i].description)

                }
            }else{
                console.log(chalk.bgRedBright.white.bold(' No News Available '),)
            }

 
        }

        /*
          {
            status: "ok",
            articles: [...]
          }
        */
    });



}


const getLonglat = (sear) => {

    geocodingClient.forwardGeocode({
        query: sear,
        limit: 1
    })
        .send()
        .then(response => {
            const match = response.body;
            //console.log(match.features[0].properties)
            getlonlatDetails(response.body.features[0].center[1], response.body.features[0].center[0])       

  //          console.log('got')
        });

}


const getlonlatDetails = (lat,lon) => {
    const url = 'http://dataservice.accuweather.com/locations/v1/cities/geoposition/search?apikey=GAuwgAK5G9HOuU8CJh5JJ8ZMqGTnFF7Z&q=' + `${lat}` +'%2C'+`${lon}`;

    const callback = (e,response) => {



        const jdata = JSON.parse(response.body)  
          if(jdata.Code == undefined){
              console.log(chalk.bgBlue.white.bold(' Details : '))
              console.log('')

              console.log(chalk.bgYellowBright.black.bold(' Country '),jdata.Country.LocalizedName)
              console.log('')
              console.log(chalk.bgYellowBright.black.bold(' Region '),jdata.Region.LocalizedName)
              getForcastDetails(jdata.Key)
              getNewsDetails(jdata.Country.ID)

          }else{
    //              console.log(jdata)
    console.log('')
              console.log(chalk.bgRedBright.white.bold(' Internet Problem ! '))
          }            
    }
    request(url, callback)
}


const getForcastDetails = (key) => {
    const url = 'http://dataservice.accuweather.com/forecasts/v1/hourly/1hour/' + `${key}` +'?apikey=GAuwgAK5G9HOuU8CJh5JJ8ZMqGTnFF7Z';

    const callback = (e, response) => {



        const jdata = JSON.parse(response.body)
        let celcius = (jdata[0].Temperature.Value - 32) * 5 / 9
        
        if (jdata.Code == undefined) {
            console.log('')
            console.log(chalk.bgYellowBright.black.bold(' Temperature '),celcius)
            
        }else {

        }
    }
    request(url, callback)
}


const detailsWithName = (name) => {
    internetAvailable({
        // Provide maximum execution time for the verification
        timeout: 3000,
        // If it tries 5 times and it fails, then it will throw no internet
        retries: 3
    }).then(() => {
//      console.log("Internet available");
        getLonglat(name)
    }).catch(() => {
        console.log('n')
        console.log(chalk.bgRedBright.white.bold(' Internet Problem ! '))
 
    });

}


const detailsWithoutName = () => {
    internetAvailable({
        // Provide maximum execution time for the verification
        timeout: 3000,
        // If it tries 5 times and it fails, then it will throw no internet
        retries: 3
    }).then(() => {
        //      console.log("Internet available");
        getIpDetails()
    }).catch(() => {
        console.log('n')
        console.log(chalk.bgRedBright.white.bold(' Internet Problem ! '))

    });

}


module.exports = { getIpDetails, getLonglat, detailsWithName, detailsWithoutName }