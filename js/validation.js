function validateLoginForm() {
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  if (email === "" || password === "") {
    alert("Please fill in all fields");
    return false;
  }

  if (!email.includes("@")) {
    alert("Invalid email format");
    return false;
  }

  return true;
}
