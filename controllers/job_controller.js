const axios = require("axios");

async function fetchJobsFromAPI(apiUrl, params) {
  try {
    const response = await axios.get(apiUrl, { params });

    return response.data.results;
  } catch (error) {
    console.error(error);
    throw new Error("Error fetching jobs from the API");
  }
}

module.exports.getJobList = async (req, res) => {
  try {
    // const jobsFromGithub = await fetchJobsFromAPI(
    //   ""
    // );
    const jobsFromAdzuna = await fetchJobsFromAPI(
      "http://api.adzuna.com/v1/api/jobs/in/search/1?app_id=75dd08f9&app_key=fcbefd4625adbc3e8fd5f83138f6a2df&results_per_page=10&what=react%20nodejs%20developer&content-type=application/json"
    );

    const allJobs = [...jobsFromAdzuna];

    return res.render("job", {
      title: "Job Portal",
      jobs: allJobs,
    });
  } catch (err) {
    console.log(err);
    //flash message
    req.flash("error", "Error fetching jobs from the API");
  }
};
