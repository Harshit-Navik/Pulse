import connectDB from "./db/index.js";
import app from "./app.js";

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Pulse server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error(" Database connection failed:", err);
    process.exit(1);
  });
