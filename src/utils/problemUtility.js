const axios = require("axios");

const getLanguageById = (lang) => {
  const language = {
    "c++": 54,
    java: 62,
    javascript: 63,
  };

  return language[lang.toLowerCase()];
};

const submitBatch = async (submissions) => {
  const options = {
    method: "POST",
    url: "https://judge0-ce.p.rapidapi.com/submissions/batch",
    params: {
      base64_encoded: "true",
    },
    headers: {
      "x-rapidapi-key": "c02404b052mshf1c75d2d7f61e7ep1aa913jsnebdad3961847",
      "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
      "Content-Type": "application/json",
    },
    data: { submissions },
  };

  async function fetchData() {
    try {
      const response = await axios.request(options);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }

  return await fetchData();
};

const submitToken = async (resultToken) => {

  const options = {
    method: "GET",
    url: "https://judge0-ce.p.rapidapi.com/submissions/batch",
    params: {
      tokens: resultToken.join(","),
      base64_encoded: "true",
      fields: "*",
    },
    headers: {
      "x-rapidapi-key": "c02404b052mshf1c75d2d7f61e7ep1aa913jsnebdad3961847",
      "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
    },
  };

  async function fetchData() {
    try {
      const response = await axios.request(options);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }

  while(true)
  {

    const result = await fetchData();

    // we have to check status_id if it is not 3 call again
    const isResultObtained = result.submissions.every(key => key.status_id > 2);
  
    if(isResultObtained)
    {
        return result.submissions;
    }

    await waiting(1000);
  }


};

const waiting = async (time) => {

    setTimeout(()=>{
         return 1
    },time)
}

module.exports = { getLanguageById, submitBatch, submitToken };
