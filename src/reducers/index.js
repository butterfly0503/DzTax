import { combineReducers } from 'redux'
import { UPDATE_KEY,UPDATE_UUID,SET_CATEGORY,SET_QUESTION,
    SET_QUESTION_NUMBER,SET_GIFTCARD_PRICE,SET_CARD_PROPERTIES,PASS_ERROR,UPDATE_LOADING,
    SET_CATEGORY_LIM,UPDATE_CATEGORIES,UPDATE_CREDENTIALS,UPDATE_CATEGORIES_PROGRESS,SET_QUESTION_FLAG,SET_MAX_QUESTION_NUMBER,SET_LAST_PRESSED,UPDATE_NAVIGATION} from '../actions/user'

const user = (state = {}, action) => {
    switch (action.type) {
        case UPDATE_KEY:
            return { ...state, authKey: action.payload }
        case UPDATE_UUID:
            return { ...state, uuID: action.payload }       
        case SET_CATEGORY:
            return { ...state, chosenCategory: action.payload }
        case SET_QUESTION:
            return { ...state, chosenQuestion: action.payload }    
        case SET_QUESTION_NUMBER:
            return { ...state, chosenQuestionNumber: action.payload }
        case SET_CATEGORY_LIM:
            return { ...state, chosenCategoryLimits: action.payload }        
        case SET_GIFTCARD_PRICE:
            return { ...state, giftCardTotalPrice: action.payload }
        case SET_CARD_PROPERTIES:
            return { ...state, giftCard: action.payload }
        case UPDATE_CATEGORIES:
            return { ...state, categoryList: action.payload }
        case UPDATE_CREDENTIALS:
            return { ...state, credentials: action.payload }
        case UPDATE_CATEGORIES_PROGRESS:
            return { ...state, categoryProgress: action.payload }
        case SET_QUESTION_FLAG:
            return { ...state, categoriesQuestionPicked: action.payload }
        case SET_MAX_QUESTION_NUMBER:
            return { ...state, maxQuestionNumber: action.payload }
        case SET_LAST_PRESSED:
            return { ...state, lastPressed: action.payload }
        case UPDATE_NAVIGATION:
            return { ...state, myNav: action.payload }
        case PASS_ERROR:
            return { ...state, passError: action.payload }
        case UPDATE_LOADING:
            return { ...state, loading: action.payload }
            
            
            
            
                    
                  
        default:
            return state
    }
}


const rootReducer = combineReducers({
    user
})

export default rootReducer
