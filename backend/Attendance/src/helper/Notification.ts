const axios = require("axios");

async function Notification(data: any) {
  const { srecipient, message, type } = data.data;
  const { name, dept_id, user_id } = data;

  console.log(srecipient, dept_id, message, type, user_id);

  try {
    const response = await axios.post("http://localhost:6000/notification", {
      data: {
        srecipient,
        message,
        type,
      },
      name,
      dept_id,
      user_id,
    });

    return response.status === 200;
  } catch (error) {
    console.error("Error in Notification function:", error);
    return false;
  }
}

module.exports = Notification;
