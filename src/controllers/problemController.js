const {getLanguageById, submitBatch, submitToken} = require("../utils/problemUtility");
const Problem = require("../models/problem");
const { findById, findByIdAndDelete } = require("../models/user");

const createProblem = async(req,res) => {

    const {title, description, difficulty, topics, visibleTestCases, hiddenTestCases, starterCode, referenceSolution, problemCreator} = req.body;
    
    // problem database e save korar age admin er dewa code and solution check korte hobe 
    // const referenceSolution = [
    // admin will provide this when he will create question
    //     
    //     {    language :  c++,  completeCode : code  },
    //     {    language :  java,  completeCode : code  },
    //     {    language :  javascript,  completeCode : code  },
    //     {
    // ],

    try{

        for(const {language,completeCode} of referenceSolution)
        {

            const languageId = getLanguageById(language);

            // This returns a (new object for each testCase)
            const submissions = visibleTestCases.map(testCase => ({

                source_code : completeCode,
                language_id : languageId,
                stdin : testCase.input,
                expected_output : testCase.output

            }))
            // i am sending this submissions to judge0 -- it will return a token 
            const submitResult = await submitBatch(submissions);

            const resultToken = submitResult.map(val => val.token);

            const testResult =  await submitToken(resultToken);

            for(test of testResult){

                if(test.status_id !== 3){
                    return res.status(400).send(`Error Occured`);
                }
            }

        }

        // we can store it in our db
        await Problem.create({
            ...req.body, 
            problemCreator : req.result._id
        })

        res.status(201).send("Problem Saved Successfully");
         

    }
    catch(err){
        res.status(400).send(`Error : ${err.message}`)
    }

}


const updateProblem = async(req,res) => {

    const {id} = req.params;
    const {title, description, difficulty, topics, visibleTestCases, hiddenTestCases, starterCode, referenceSolution, problemCreator} = req.body;


    try{
        if(!id) {
            return res.status(400).send("Field ID Missing!")
        }
        const DsaProblem = await findById(id);
        if(!DsaProblem){
            return res.status(404).send("ID is not present in server");
        }

        for(const {language,completeCode} of referenceSolution)
        {

            const languageId = getLanguageById(language);

            // This returns a (new object for each testCase)
            const submissions = visibleTestCases.map(testCase => ({

                source_code : completeCode,
                language_id : languageId,
                stdin : testCase.input,
                expected_output : testCase.output

            }))
            // i am sending this submissions to judge0 -- it will return a token 
            const submitResult = await submitBatch(submissions);

            const resultToken = submitResult.map(val => val.token);

            const testResult =  await submitToken(resultToken);

            for(test of testResult){

                if(test.status_id !== 3){
                    return res.status(400).send(`Error Occured`);
                }
            }

        }

        await Problem.findByIdAndUpdate(id, {...req.body}, {runValidators:true, new:true});

        res.status(200).send("Problem Updated Successfully");


    }
    catch(err){
        res.status(404).send(`error : ${err.message}`);
    }
}

const deleteProblem = async(req,res) => {

    const {id} = req.params;

    try{

        if(!id) {
            return res.status(400).send("Field ID Missing!")
        }

        const deletedProblem = await findByIdAndDelete(id);

        if(!deletedProblem){
            return res.status(404).send("Problem is missing");
        }
        res.status(200).send("Problem Deleted Successfully");


    }
    catch(err) {
        res.status()
    }
}

const getProblemById = async(req,res)=>{

    const {id} = req.params;

    try{
        
        if(!id){
            return res.status(400).send("ID is missing");
        }

        const getProblem = await Problem.findById(id);

        if(!getProblem){
            return res.status(404).send("Problem is Missing");
        }

        res.status(200).send(getProblem);
    }
    catch(err){
        res.status(500).send(`Error : ${err.message}`);
    }
}


const getAllProblem = async(req,res) => {


    try{

        const problems =  await Problem.find({});
        if(problems.length === 0){
            return  res.status(404).send("Problems missing");
    }
    res.status(200).send(problems);

    }
    catch(err){
        res.status(500).send(`Error : ${err.message}`);
    }

}

// submit korar por seta store korte hobe kon user dara eta submit hoise??

module.exports = {createProblem, updateProblem, deleteProblem, getProblemById, getAllProblem};