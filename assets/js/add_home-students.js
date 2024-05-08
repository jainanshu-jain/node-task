const handleSubmit = async (event) => {
  event.preventDefault();

  const form = document.getElementById("studentForm");
  const formData = new FormData(form);

  const courseScores = {
    dsaFinalScore: formData.get("courseScores.dsaFinalScore"),
    webDFinalScore: formData.get("courseScores.webDFinalScore"),
    reactFinalScore: formData.get("courseScores.reactFinalScore"),
  };

  const studentData = {
    name: formData.get("name"),
    email: formData.get("email"),
    college: formData.get("college"),
    batch: formData.get("batch"),
    placement_status: formData.get("placement_status"),
    courseScores: courseScores,
  };

  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(studentData),
  };

  let requestUrl = "/students/create"; // Default URL for creating a student

  const urlParams = new URLSearchParams(window.location.search);
  const studentId = urlParams.get("id");

  if (studentId) {
    requestUrl = `/students/update-student/${studentId}`;
    requestOptions.method = "PUT";
  }

  try {
    const response = await fetch(requestUrl, requestOptions);
    const data = await response.json();

    if (data.success) {
      form.reset();

      //after form reset redirect to the home page to see student list
      window.location.href = "/";
    }
  } catch (error) {
    console.log(error);
  }
};
