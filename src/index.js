import dotenv from "dotenv";
import { app } from "./app.js";
import dbconnect from "../src/db/dbconnect.js";

dotenv.config({
    path: './env'
})

dbconnect()
.then(() => {
    app.listen(process.env.PORT || 8080, () => console.log(`App is listening on PORT : ${process.env.PORT}`));
})
.catch((error) => {
    console.log("Error: ", error);
})


