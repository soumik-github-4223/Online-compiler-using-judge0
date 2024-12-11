import React from "react";

const languageCodeMap = {
  cpp: 54,
  python: 92,
  javascript: 93,
  java: 91,
};

async function getSubmission(tokenId, callback) {
  const url = `https://judge0-ce.p.rapidapi.com/submissions/${tokenId}?base64_encoded=true&fields=*`;
  const options = {
    method: "GET",
    headers: {
      "x-rapidapi-key": "7f75da015amsh3062d8b3f38d572p119fa7jsn8331cf0f2c60",
      "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
    },
  };

  try {
    const response = await fetch(url, options);
    const result = await response.json();
    // console.log(result);
    return result;
  } catch (error) {
    callback({ apiStatus: "error", message: JSON.stringify(error) });
  }
}

export async function makeSubmission({ code, language, callback, stdin }) {
  // make a submission handle the status of the submission
  const url = 'https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=true&wait=false&fields=*';
const options = {
	method: 'POST',
	headers: {
		'x-rapidapi-key': '7f75da015amsh3062d8b3f38d572p119fa7jsn8331cf0f2c60',
		'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
		'Content-Type': 'application/json'
	},
    body: JSON.stringify({
      language_id: languageCodeMap[language],
      source_code: btoa(code),
      stdin: btoa(stdin),
    }),
  };

  /*
  generic response from this function
apiStatus: 'loading' | error | success"
data: response,
message: 'Runtime error' | 'Compilation error'
*/

  try {
    callback({ apiStatus: "loading" });
    const response = await fetch(url, options);
    const result = await response.json();
    const tokenId = result.token;
    let statusCode = 1; // in queue
    let apiSubmissionResult;
    while (statusCode === 1 || statusCode === 2) {
      try {
        apiSubmissionResult = await getSubmission(tokenId);
        statusCode = apiSubmissionResult.status.id;
      } catch (error) {
        callback({
          apiStatus: "error",
          message: JSON.stringify(error),
        });

        return;
      }
    }

    if (apiSubmissionResult) {
      callback({ apiStatus: "success", data: apiSubmissionResult });
    }
  } catch (error) {
    callback({
      apiStatus: "error",
      message: JSON.stringify(error),
    });
  }
}
