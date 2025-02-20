function status(request, response) {
  response.status(200).json({
    message: "everything is fine",
  });
}
export default status;
