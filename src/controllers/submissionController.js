const Problem = require("../models/problem");
const Submission = require('../models/submission');
const { getLanguageById, submitBatch, submitToken } = require("../utils/problemUtility");



const submitCode = async(req,res) => {


    try{

        const problemId = req.params._id;
        const userId = req.result._id;
        const {code, language} = req.body;

        if(!userId || !problemId || !code || !language){
            return res.status(400).send('some field missing');
        }

        const problem = await Problem.findById(problemId);

        if(!problem){
            return res.status(400).send("problem not found");
        }

        // we store submission data before code submitted to judge0 --> cause if judge0 will fail for some reason then we cant tell the user to submit the code again 
        const submitedResult = await Submission.create({
            userId,
            problemId,
            code,
            language,
            testCasesPassed : 0,
            status : 'pending',
            testCaseTotal : problem.hiddenTestCases.length
        })
        

        // now submit the code to judge0

        const languageId = getLanguageById(language);

        const submissions = problem.hiddenTestCases.map(testCase => ({

                source_code : code,
                language_id : languageId,
                stdin : testCase.input,
                expected_output : testCase.output

        }))

        const submitResult = await submitBatch(submissions);

        const resultToken = submitResult.map(val => val.token);

        const testResult =  await submitToken(resultToken);

        let runtime = 0;
        let memory = 0;
        let testCasePassed = 0;
        let status = 'accepted';
        let errorMessage = null;

        for(const testCase of testResult){

            if(testCase.status_id === 3){
                testCasePassed++;
                runtime = runtime + parseFloat(testCase.time);
                memory = Math.max(memory,testCase.memory);
            }else{
                if(testCase.status_id === 4){
                    status = 'error';
                    errorMessage = testCase.sterr;
                }
                else{
                    status = 'wrong';
                    errorMessage = testCase.sterr;

                }
            }
        }

        submitedResult.status = status;
        submitedResult.testCasesPassed = testCasePassed;
        submitedResult.errorMessage = errorMessage;
        submitedResult.runtime = runtime;
        submitedResult.memory = memory;

        await submitedResult.save();

        // we will insert problemid into userSchema problemSolved field if it is not present there

        if(!req.result.problemSolved.includes(problemId))
        {
            req.result.problemSolved.push(problemId);
            await req.result.save(); 
        }

        res.status(201).send(submitedResult);

        


    }
    catch(err){
        res.status(500).send(`Error : ${err.message}`);
    }
   
} 

const runCode = async(req,res) => {

}

module.exports = {submitCode,runCode};