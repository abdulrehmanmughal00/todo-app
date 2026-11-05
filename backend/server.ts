import app from "./src/app.js";
import connectToDB from "./src/db/db.js";

const startServer = async () => {
  try {
    await connectToDB();

    const PORT = process.env.PORT;

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server starting error:", error);
    process.exit(1);
  }
};

startServer();
