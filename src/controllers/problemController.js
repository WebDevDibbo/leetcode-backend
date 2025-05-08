const {getLanguageById, submitBatch, submitToken} = require("../utils/problemUtility");
const Problem = require("../models/problem")

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
                    res.status(400).send(`Error Occured`);
                }
            }

        }

        // we can store it in out db
        const storeProblem = await Problem.create({
            ...req.body, 
            problemCreator : req.result._id
        })

        res.status(201).send("Problem Saved Successfully");
         

    }
    catch(err){
        res.status(400).send(`Error : ${err.message}`)
    }

}


module.exports = createProblem;