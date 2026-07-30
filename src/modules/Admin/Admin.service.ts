import { UserStatus } from "../../../generated/prisma/enums";
import prisma from "../../lib/prisma";

const getAllUsersIntoDb = async () => {
    const users = await prisma.user.findMany({
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            status: true
        }
    });

    const totalUsers = await prisma.user.count();

    if (!users) {
        throw new Error("No users Created yet");
    }
    return { users, totalUsers };
}
 
const updateUserStatusIntoDb = async (userId: string, status: UserStatus) => {

    const existingUser = await prisma.user.findUnique({
        where: {
            id: userId
        }
    });

    if (!existingUser) {
        throw new Error("User not found");
    }

    const user = await prisma.user.update({
        where: { 
            id: userId 
        },
        data: {
             status: status
        }
    });

    const updatedUser = await prisma.user.findUnique({
        where: {
            id: userId
        },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            status: true
        }
    });

    return updatedUser;
}


const getAllBookingsIntoDb = async () => {

 const bookings = await prisma.bookings.findMany({
        include: {
            service: true,
            technician: {
                select: {
                    id: true,
                    name: true,
                    email: true
                }
            },
            customer: {
                select: {
                    id: true,
                    name: true,
                    email: true
                }
            }
        }

    });

    const totalBookings = await prisma.bookings.count()
    const CompletedBookings = await prisma.bookings.count({
        where: {
            status: "COMPLETED"
        }
    });

     const ConfirmedBookings = await prisma.bookings.count({
        where: {
            status: "CONFIRMED"
        }
    });

    const InProgressBookings = await prisma.bookings.count({
        where: {
            status: "IN_PROGRESS"
        }
    });

    if (!bookings) {
        throw new Error("No bookings found");
    }

    return { bookings, totalBookings, CompletedBookings, ConfirmedBookings, InProgressBookings,  };
}

const getAllCategoriesIntoDb = async () => {
    const categories = await prisma.categories.findMany({
       
    });
    const TotalCategories = await prisma.categories.count()

    if (!categories) {
        throw new Error("No categories found");
    }
    return {categories,TotalCategories};
}


const createCategoryIntoDb = async (categoryName: string) => {


    // Check if the category already exists
    const existingCategory = await prisma.categories.findUnique({
        where: {
            name: categoryName,
        }
    });
    
    if (existingCategory) {
        throw new Error("Category already exists");
    }

     const category = await prisma.categories.create({
        data: {
            name: categoryName
        }
    });
    
    return category;
}





export const AdminService = {
    getAllUsersIntoDb,
    getAllBookingsIntoDb,
    getAllCategoriesIntoDb,
    updateUserStatusIntoDb,
    createCategoryIntoDb
}