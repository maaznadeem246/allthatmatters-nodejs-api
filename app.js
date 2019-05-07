
const { getIpDetails, detailsWithName, detailsWithoutName} = require('./functs')
const express = require('express')

const yarg = require('yargs')



if(process.argv.length == 2){
    detailsWithoutName()
}else{
//    console.log(process.argv[2])
    detailsWithName(process.argv[2])


}


