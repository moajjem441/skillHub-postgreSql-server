import dotenv from "dotenv";

dotenv.config();

import app from "./app";
import {PrismaClient} from "@prisma/client";

const prisma = new PrismaClient();

const PORT = process.env.PORT || 5000;

async function main(){

    try{

        await prisma.$connect();
        console.log("Database connected successfully");

        app.listen(PORT,()=> {
            console.log(`Server is running on http://localhost:${PORT}`);

        });
    } catch (error){
        console.error("Error connecting to the database:", error);
    
        await prisma.$disconnect();

        process.exit(1)
    
    }

    
}

main();