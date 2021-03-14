const main_url='https://dztax.pl/wp-json/wp/v2/' 


export async function registerUser (registerObject) {

    let url=main_url+'users/register/'

    try {
    let response = await fetch(url, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        } ,
        body: JSON.stringify(registerObject),
        });                
        let json = await response.json();
        console.log(json)
        if(json.success){
            return {success:true}
        }
        else{
            return {success:false,reason:json.reason}
        }

    }  
    catch (error) {
        console.error(error);
        return {success:false,reason:2}
    }
}
export async function getPaymentLink (login,password,months) {

    let url=main_url+'users/createPaymentLink/'

    try {
    let response = await fetch(url, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        } ,
        body: JSON.stringify(
            {
                login:login,
                password:password,
                months:months
            }
        ),
        });                
        let json = await response.json();
        console.log(json)
        if(json.success){
            return {success:true,link:json.link}
        }
        else{
            return {success:false,reason:json.reason}
        }

    }  
    catch (error) {
        console.error(error);
        return {success:false,reason:2}
    }
}
export async function checkGiftCard (giftCardPin) {

    let url=main_url+'users/checkValidEcard/'

    try {
    let response = await fetch(url, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        } ,
        body: JSON.stringify(
            {
                ecardPIN:parseInt(giftCardPin) ,

            }
        ),
        });                
        let json = await response.json();
        console.log(json)
        if(json.success){
            return true
        }
        else{
            return false
        }

    }  
    catch (error) {
        console.error(error);
        return false
    }
}
export async function handleGiftCardPayment (login,password,months,firstName,lastName,title,image,email) {

    let url=main_url+'users/createPaymentLinkEcard/'
    try {
    let response = await fetch(url, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        } ,
        body: JSON.stringify(
            {
                login:login ,
                password:password ,
                months:months ,
                firstname:firstName ,
                lastname:lastName ,
                title:title ,
                image:image ,
                email:email 
            }
        ),
        });                
        let json = await response.json();
        console.log(json)
        if(json.success){
            return {success:true,link:json.link}
        }
        else{
            return {success:false}
        }

    }  
    catch (error) {
        console.error(error);
        return {success:false}
    }

}
export async function getSubscriptionMonths (login,password) {

    let url=main_url+'users/getsubscriptionmonth/'
    try {
    let response = await fetch(url, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        } ,
        body: JSON.stringify(
            {
                login:login ,
                password:password 
            }
        ),
        });                
        let json = await response.json();
        if(json.success){
            return {success:true,date:json.date}
        }
        else{
            return {success:false}
        }

    }  
    catch (error) {
        console.error(error);
        return {success:false}
    }

}
export async function handleRenewSubscription (login,password,months) {

    let url=main_url+'users/renewsubscription/'
    try {
    let response = await fetch(url, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        } ,
        body: JSON.stringify(
            {
                login:login ,
                password:password ,
                months:months
            }
        ),
        });                
        let json = await response.json();
        if(json.success){
            return {success:true,link:json.link}
        }
        else{
            return {success:false}
        }

    }  
    catch (error) {
        console.error(error);
        return {success:false}
    }

}
export async function fetchMyDataInfo (login,password) {

    let url=main_url+'users/fetchmydatainfo/'
    try {
    let response = await fetch(url, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        } ,
        body: JSON.stringify(
            {
                login:login ,
                password:password 
            }
        ),
        });                
        let json = await response.json();
        if(json.success){
            return {success:true,data:json.data}
        }
        else{
            return {success:false}
        }

    }  
    catch (error) {
        console.error(error);
        return {success:false}
    }

}
export async function updateMyDataInfo (login,password,data) {

    let url=main_url+'users/updatemydatainfo/'
    try {
    let response = await fetch(url, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        } ,
        body: JSON.stringify(
            {
                login:login ,
                password:password ,
                data:data
            }
        ),
        });                
        let json = await response.json();
        if(json.success){
            return {success:true,returned:json.returned}
        }
        else{
            return {success:false}
        }

    }  
    catch (error) {
        console.error(error);
        return {success:false}
    }

}






