
import { BaseService } from "./baseService";
import { NextFunction, Request, Response } from "express";
const request=require('request');
const pvURL = 'http://baseflat.itexapp.com:9053/';
const pvToken="a870a27fca4ed7ba3601d85d1c79d113";
const infobipURL = 'https://bazookastage.azurewebsites.net/';
const UssdMenu = require('ussd-menu-builder');
if (typeof localStorage === "undefined" || localStorage === null) {
    var LocalStorage = require('node-localstorage').LocalStorage;
    LocalStorage = new LocalStorage('./scratch');
  }

export class ussdMenuService extends BaseService {
  
    async ussdMenu( req: Request, res: Response, next: NextFunction){
        
        
        
        
        let menu = new UssdMenu();
         
        // Define menu states
        menu.startState({
            run: () => {
                // use menu.con() to send response without terminating session      
                menu.con('Welcome to Pay Vice:' +
                    '\n1. Show Balance' +
                    '\n2. Buy Airtime' +
                    '\n3. Make Payment'
                );
            },
            // next object links to next state based on user input
            next: {
                '1': 'showBalance',
                '2': 'buyAirtime',
                '3': 'MakePayment'
            }
        });
         
        menu.state('showBalance', {
            run: () => {
                // fetch balance
                this.fetchBalance(menu.args.phoneNumber).then(bal=>{
                    menu.end('Your balance is NGN ' + bal);
                }
                 );
            }
        });
         
        menu.state('buyAirtime', {
            run: () => {
                menu.con('Enter amount:');
            },
            next: {
                // using regex to match user input to next state
                '*\\d+': 'buyAirtime.amount'
            }
        });
         
        // nesting states
        menu.state('buyAirtime.amount', {
            run: () => {
                // use menu.val to access user input value
                var amount = Number(menu.val);
                this.buyAirtime(menu.args.phoneNumber, amount).then(res=>{
                    menu.end('Airtime bought successfully.');
                });
            }
        });
        // nesting states
        menu.state('MakePayment', {
            run: () => {
                menu.con('Enter Amount-CardNumber-MM-YY-CVV2');
                // var amount = Number(menu.val);
                // savePaymentAmount(menu.args.phoneNumber, amount).then(res=>{});
            },
            next:{
                 // using regex to match user input to next state
                 '*\\d+-\\d\\d\\d\\d\\d\\d\\d\\d\\d\\d\\d\\d\\d\\d\\d\\d-\\d\\d-\\d\\d-\\d\\d\\d': 'MakePayment.cardDetails'
            }
        });
        // nesting states
        menu.state('MakePayment.cardDetails', {
            run: () => {
                var card_details = menu.val.split("-");
                makePayment(menu.args.phoneNumber, card_details).then(res=>{
                    // menu.con('Enter CardNumber/MM/YY/CVV2:');
                    if(res =='success')
                    {
                        menu.end('Payment successfully made with reference: '+res);
                    }
                    else{
                        menu.end('Payment was NOT successfully! Please try again');
                    }
                    
                });
            },
            next:{
                 // using regex to match user input to next state
                //  '*\\d+': 'MakePayment.cardDetails'
            }
        });
        // Registering USSD handler with Express
        
       
            // let args = {
            //     phoneNumber: req.body.phoneNumber,
            //     sessionId: req.body.sessionId,
            //     serviceCode: req.body.serviceCode,
            //     text: req.body.text
            // };
            // menu.run(args, resMsg => {
            //     res.send(resMsg);
            // });
        
    
            menu.run(req.body, ussdResult => {
                res.send(ussdResult);
            });
    
        
        
        //2000,1234567676543212,12,18,123
        
        function makePayment(phoneNumber,card_details) {
            return new Promise((resolve,reject)=>{
                console.log("card Details : "+card_details);
                card_details[0]
                //initiate Payment
                request.post({
                    url:`${pvURL}api/transaction/initiate`,
                    headers: {
                      'Authorization': 'Bearer '+pvToken,
                       "Content-Type": "application/json"
                    },
                    body: {
                        "amount": card_details[0]+'00',
                        "currency": "NGN",
                        "customer_email": 'templar@3nitix.guru', //templar@3nitix.guru ernest.uduje@iisysgroup.com
                        "description":'Payment by '+phoneNumber+' from USSD'
                    },
                    json:true
                    }, function(ierror, iresponse, body){
                        console.log('Initialise payment Error for '+phoneNumber+' '+ierror);
                        console.log('Initialise Response '+JSON.stringify(iresponse));
                         //Charge Card
                            request.post({
                                url:`${pvURL}api/transaction/chargeCard/${iresponse.body.data.gateway_code}`,
                                headers: {
                                'Authorization': 'Bearer '+pvToken,
                                "Content-Type": "application/json"
                                },
                                body: {
                                    "card_number": card_details[1],
                                    "card_month": card_details[2],
                                    "card_year": card_details[3],
                                    "security_code": card_details[4]
                                },
                                json:true
                                }, function(rerror, rresponse, body){
                                    console.log('Charge payment Error for '+phoneNumber+' '+rerror);
                                    console.log('Charge Response '+JSON.stringify(rresponse));
                                    // resolve(rresponse);  
                                    //Send Message
                                    request.post({
                                        url:`${infobipURL}sms_gate`,
                                        headers: {
                                        "Content-Type": "application/json"
                                        },
                                        body: {
                                            "from":"Payvice",
                                            "to":"2348098367527",//2348054400003 2348098367527
                                            "text":`USSD Payment of ${card_details[0]} was successful\n\nRefno:${rresponse.body.data.reference}`
                                        },
                                        json:true
                                        }, function(serror, sresponse, body){
                                            console.log('Charge SMS Error for '+phoneNumber+' '+serror);
                                            console.log('SMS Response '+JSON.stringify(sresponse));
                                            resolve(rresponse); 
                                            reject('An error occurred, try again later')         
                                        });              
                                    });    
                                
                    });
                // resolve(ref); 
            })
        }
        
    }


    private buyAirtime(phoneNumber,amount) {
        return new Promise((resolve,reject)=>{
            console.log("buyAirtime Amount: "+amount);
            console.log("buyAirtime Mobile: "+phoneNumber)
            resolve(amount);
            reject("An error occurred, try again later") 
        })
    }

    private fetchBalance(phoneNumber) {
        return new Promise((resolve,reject)=>{
            console.log("FetchBalance Mobile: "+phoneNumber)
            resolve(20000); 
            reject("An error occurred, try again later"); 
        })
    }
}
 