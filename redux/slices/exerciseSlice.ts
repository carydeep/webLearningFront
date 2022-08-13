import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Exercise, Question } from "../../models/exercise";

interface StateProps{
    exercise:Exercise[]|undefined,
    loading:boolean,
    error:boolean
}

const initialState:StateProps = {
    exercise:undefined,
    loading:false,
    error:false
}

export const exerciseSlice = createSlice({
    name:'exercise',
    initialState,
    reducers:{
        startLoading:(state)=>{
            state.loading=true
        },
        actionFail:(state)=>{
            state.loading = false
            state.error = true
        },
        createExercise:(state,action:PayloadAction<Exercise>)=>{
            state.loading = false
            state.error = false
            state.exercise?.push(action.payload)
        },
        getExercise:(state,action:PayloadAction<Array<Exercise>>)=>{
            state.loading = false
            state.error = false
            state.exercise = action.payload
        },
        deleteExercise:(state,action:PayloadAction<Exercise>)=>{
            state.loading = false
            state.error = false
            const removeExercise = state.exercise?.filter(ex=>ex._id!==action.payload._id)
            state.exercise = removeExercise
        },
        updateExercise:(state,action:PayloadAction<Exercise>)=>{
            const {_id} = action.payload
            state.loading = false
            state.error = false
            if(state.exercise){
                const findIndexExercise = state.exercise.findIndex(ex=>ex._id===_id)
                if(findIndexExercise!==undefined){
                    state.exercise[findIndexExercise] = action.payload
                }
            }
        },
        addQuestion:(state,action:PayloadAction<Question>)=>{
            const {exerciseId} = action.payload
            state.loading = false
            state.error = false
            if(state.exercise){
                const findIndexExercise = state.exercise.findIndex(ex=>ex._id===exerciseId)
                if(findIndexExercise!==undefined && state.exercise[findIndexExercise].questions){
                    state.exercise[findIndexExercise].questions.push(action.payload)
                }
            }
        },
        deleteQuestion:(state,action:PayloadAction<Question>)=>{
            state.loading=false
            state.error=false
            const {exerciseId,_id} = action.payload
            if(state.exercise){
                const findIndexExercise = state.exercise.findIndex(ex=>ex._id===exerciseId)
                if(findIndexExercise!==undefined){
                    const filterQuestion = state.exercise[findIndexExercise].questions.filter(ques=>ques._id!==_id)
                    state.exercise[findIndexExercise].questions = filterQuestion
                }
            }
        },
        updateQuestion:(state,action:PayloadAction<Question>)=>{
            state.loading=false
            state.error=false
            const {exerciseId,_id,name,options} = action.payload
            if(state.exercise){
                const findIndexExercise = state.exercise.findIndex(ex=>ex._id===exerciseId)
                if(findIndexExercise!==undefined){
                    const findIndexQues = state.exercise[findIndexExercise].questions.findIndex(ques=>ques._id===_id)
                    if(findIndexQues!==undefined){
                        state.exercise[findIndexExercise].questions[findIndexQues].name = name
                        state.exercise[findIndexExercise].questions[findIndexQues].options = options
                    }
                }
            }
        },
        resetExercise:(state)=>{
            state.loading = false
            state.error = false
            state.exercise = undefined
        }
    }
})

export const {resetExercise,startLoading,actionFail,createExercise,getExercise,updateExercise,deleteExercise,addQuestion,deleteQuestion,updateQuestion} = exerciseSlice.actions

const {reducer:exerciseReducer} = exerciseSlice
export default exerciseReducer