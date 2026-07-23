
import env from "./config/env";
import prisma from "./lib/prisma";
import app from "./app";


const PORT = env.PORT ;


    
async function startServer() {

    try{
        await prisma.$connect();
        console.log("Connected to database successfully.");
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    }catch(err){
        console.error("Error while starting server:", err);
        await prisma.$disconnect();
        process.exit(1);
    }

}


startServer();