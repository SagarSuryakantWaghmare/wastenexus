// All the api related code is in utils/db/action.ts

import {db} from './dbConfig';
import {Users,Notifications, Transactions} from './schema';
import {eq,and,desc} from 'drizzle-orm';

export async function createUser(email:string,name:string){
    try {
        // If a user with this email already exists, return it instead of inserting (idempotent)
        const existing = await getUserByEmail(email);
        if (existing) return existing;

        const [user] = await db.insert(Users).values({ email, name }).returning().execute();
        return user;
    } catch (error) {
        console.error('Error creating user', error);
        // As a fallback, try to return existing user if duplicate key was the issue
        try {
            const existing = await getUserByEmail(email);
            if (existing) return existing;
        } catch {
            // ignore
        }
        return null;
    }
}

export async function getUserByEmail(email:string){
    try {
        const [user]=await db.select().from(Users).where(eq(Users.email,email)).execute();
        return user;
    } catch (error) {
        console.error('Error fetching user by email',error);
        return null;
    }
}

export async function getUnreadNotifications(userId:number){
    try {
        return await db.select().from(Notifications).where(and(eq(Notifications.userId,userId),eq(Notifications.isRead,false))).orderBy(desc(Notifications.createdAt)).execute();        
    } catch (error) {
     console.log("Error while fetching notifications",error);
     return null;   
    }
}

export async function getUserBalance(userId:number):Promise<number>{
    const transactions=await getRewardTransactions(userId)||[];
    if(!transactions) return 0;
    const balance = transactions?.reduce((acc: number, transaction: unknown) => {
        const t = transaction as { type: string; amount: number };
        return t.type.startsWith('earned') ? acc + t.amount : acc - t.amount;
    }, 0);
    return Math.max(balance,0);
}

export async function getRewardTransactions(userId:number){
    try {
        const transactions=await db.select({
            id:Transactions.id,
            type:Transactions.type,
            amount:Transactions.amount,
            description:Transactions.description,
            date:Transactions.date
        }).from(Transactions).where(eq(Transactions.userId,userId)).orderBy(desc(Transactions.date)).limit(10).execute();

        const formattedTransctions=transactions.map(t=>({
            ...t,
            date:t.date.toISOString().split('T')[0] //YYY-MM-DD
        }))

        return formattedTransctions;
        
    } catch (error) {
        console.error("Error fetching reward transactions",error);
        return null;
    }
}

export async function markNotificationAsRead(notificationId:number){
    try {
        await db.update(Notifications).set({isRead:true}).where(eq(Notifications.id,notificationId)).execute();

    } catch (error) {
        console.log('Error marking notification as read',error);
        return;
    }
}