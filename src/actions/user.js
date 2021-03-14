import firestore from '@react-native-firebase/firestore';
import  AsyncStorage  from '@react-native-community/async-storage'

const main_url='https://dztax.pl/wp-json/wp/v2/' 
export const updateKey = authKey => {
    return {
        type: UPDATE_KEY,
        payload: authKey
    }
}
export const updateUuid = uuID => {
    return {
        type: UPDATE_UUID,
        payload: uuID
    }
}
export const updateCredentials = obj => {
    return {
        type: UPDATE_CREDENTIALS,
        payload: obj
    }
}
export const setNavigationHandler = navigation => {
    return {
        type: UPDATE_NAVIGATION,
        payload: navigation
    }
}

export const setCategory = category => {
    return {
        type: SET_CATEGORY,
        payload: category
    }
}
export const setQuestion = subCategory => {
    return {
        type: SET_QUESTION,
        payload: subCategory
    }
}
export const setQuestionNumber = questionNumber => {
    return {
        type: SET_QUESTION_NUMBER,
        payload: questionNumber
    }
}
export const setLastPressed = lastPressed => {
    return {
        type: SET_LAST_PRESSED,
        payload: lastPressed
    }
}
export const setQuestionFlag = flag => {
    return {
        type: SET_QUESTION_FLAG,
        payload: flag
    }
}
export const passwordErrorVis = vis => {
    return {
        type: PASS_ERROR,
        payload: vis
    }
}
export const updateLoading = loading => {
    return {
        type: UPDATE_LOADING,
        payload: loading
    }
}




export const setGiftCardTotalPrice = totalPrice => {
    return {
        type: SET_GIFTCARD_PRICE,
        payload: totalPrice
    }
}
export const setMaxQuestionNumber = maxNumber => {
    return {
        type: SET_MAX_QUESTION_NUMBER,
        payload: maxNumber
    }
}

export const updateGiftCard = cardObj => {
    return {
        type: SET_CARD_PROPERTIES,
        payload: cardObj
    }
}
export const setCategoryLimits = (min,max) => {
    return {
        type: SET_CATEGORY_LIM,
        payload: {min:min,max:max}
    }
}
export const updateCategories = (categories) => {
    return {
        type: UPDATE_CATEGORIES,
        payload: categories
    }
}
export const updateCategoriesProgress = (progress) => {
    return {
        type: UPDATE_CATEGORIES_PROGRESS,
        payload: progress
    }
}

export const fetchCategories = (login,password) => {
    return async (dispatch,getState) => {
        try {
            dispatch(updateLoading(true))
            console.log('tutaj')
            let usersCollection = await firestore().collection('categories').get()
            console.log(usersCollection)
           
            let filtered=usersCollection._docs
            let newArr=[]
            for(let i=0;i<filtered.length;i++){
              newArr.push({...filtered[i]._data,pressed:false})
            }
            let url=main_url+'users/getcategories'
            let { credentials} = getState().user

            let response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Accept': '*/*',
                    'content-Type': 'application/json',
                },
                body: JSON.stringify({
                    login: login,
                    password:password,
                }),

                });
            let json=await response.json()
            
            if(json.categories){
                await dispatch(updateCategoriesProgress(json.categories[0]))
                await dispatch(updateCategories(newArr))
            }
            dispatch(updateLoading(false))
            return true
        }  
        catch (error) {
            console.error(error);
            dispatch(updateLoading(false))
            }    
    }
}
export const updateProgress = (categoryID,questionID,status) => {
    return async (dispatch,getState) => {
        try {
            
            let url=main_url+'users/updatecategories'
            let { categoryProgress,credentials} = getState().user
            let newCategories=categoryProgress
            let foundCategory=false
            let foundCategoryIndex=0
            let foundQuestion=false
            for(let i=0;i<newCategories.length;i++){
                if(newCategories[i].categoryID==categoryID){
                    foundCategory=true
                    foundCategoryIndex=i
                    for(let p=0;p<newCategories[i].questions.length;p++){
                        if(newCategories[i].questions[p].questionID==questionID){
                            foundQuestion=true
                            newCategories[i].questions[p].status=status
                        }
                    }
                }
            }
            if(foundCategory&&foundQuestion){
                console.log('we changed our status')
            }
            if(foundCategory&&!foundQuestion){
                newCategories[foundCategoryIndex].questions.push({questionID:questionID,status:status})
                console.log('we added question')
            }
            if(!foundCategory){
                newCategories.push({categoryID:categoryID,questions:[{questionID:questionID,status:status}]})
                console.log('we added category and question')
            }
            await dispatch(updateCategoriesProgress(newCategories))
            let response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Accept': '*/*',
                    'content-Type': 'application/json',
                },
                body: JSON.stringify({
                    login: credentials.login,
                    password: credentials.password,
                    categories:newCategories
                }),

                });
            let json=await response.json()
            
            return true
        }  
        catch (error) {
            console.error(error);
            return false
            }    
    }
}
export const userLogin = (login,password) => {
    return async (dispatch,getState) => {
        
        let url=main_url+'users/login'
        try {
            let response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Accept': '*/*',
                    'content-Type': 'application/json',
                },
                body: JSON.stringify({
                    login: login,
                    password: password,
                }),

                });
            let json=await response.json()
            console.log(json)
            if(json.success){
                let obj={login:login,password:password,uuID:json.id}
                await AsyncStorage.setItem('User', JSON.stringify({login:login,password:password,uuID:json.id}))

                await dispatch(updateCredentials(obj))
                return {success:true}
            }
            else{
                let {myNav}=getState().user
                await AsyncStorage.removeItem('User')
                dispatch(passwordErrorVis(true))
                myNav.reset({index: 0,routes: [{ name: 'Login' }]});

                return {success:false,reason:json.reason}
            }  

        }  
        catch (error) {
            console.error(error);
            let {myNav}=getState().user
            await AsyncStorage.removeItem('User')
            dispatch(passwordErrorVis(true))
            myNav.reset({index: 0,routes: [{ name: 'Login' }]});
            return {success:false,reason:2}
            }    
    }
}






export const UPDATE_KEY = 'UPDATE_KEY'
export const UPDATE_UUID = 'UPDATE_UUID'
export const SET_CATEGORY = 'SET_CATEGORY'
export const SET_QUESTION = 'SET_QUESTION'
export const SET_QUESTION_NUMBER = 'SET_QUESTION_NUMBER'
export const SET_GIFTCARD_PRICE = 'SET_GIFTCARD_PRICE'
export const SET_CARD_PROPERTIES = 'SET_CARD_PROPERTIES'
export const SET_CATEGORY_LIM = 'SET_CATEGORY_LIM'
export const UPDATE_CATEGORIES = 'UPDATE_CATEGORIES'
export const UPDATE_CREDENTIALS = 'UPDATE_CREDENTIALS'
export const UPDATE_CATEGORIES_PROGRESS = 'UPDATE_CATEGORIES_PROGRESS'
export const SET_QUESTION_FLAG = 'SET_QUESTION_FLAG'
export const SET_MAX_QUESTION_NUMBER = 'SET_MAX_QUESTION_NUMBER'
export const SET_LAST_PRESSED = 'SET_LAST_PRESSED'
export const UPDATE_NAVIGATION = 'UPDATE_NAVIGATION'
export const PASS_ERROR = 'PASS_ERROR'
export const UPDATE_LOADING = 'UPDATE_LOADING'






























