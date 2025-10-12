// All the api related code is in utils/db/action.ts

import { trackSynchronousPlatformIOAccessInDev } from 'next/dist/server/app-render/dynamic-rendering';
import {db} from './dbConfig';
import {Users,Notifications, Transactions, Reports, Rewards} from './schema';
import { eq, sql, and, desc, ne } from 'drizzle-orm';

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

export async function createReport(
    userId:number,
    location:string,
    wasteType:string,
    amount:string,
    imageUrl?:string,
    verificationResults?:any
) {
    try {
        const[report]=await db.insert(Reports).values({
            userId,
            location,
            wasteType,
            amount,
            imageUrl,
            verificationResults,
            status:"pending",
        }).returning().execute();

        const pointsEarned=10;
        // updatedRewardsPoints
        await updateRewardPoints(userId,pointsEarned);
        // createTransaction
        await createTransaction(userId,'earned_report',pointsEarned,'Points earned for reporting')
        // createNotification
        await createNotification(
            userId,
            `You have earned ${pointsEarned} points for reporting wate!`,'reward')
            return report;

    } catch (error) {
        console.error('Error creating report',error);
    }
}
export async function updateRewardPoints(userId: number, pointsToAdd: number) {
  try {
    const [updatedReward] = await db
      .update(Rewards)
      .set({ 
        points: sql`${Rewards.points} + ${pointsToAdd}`,
        updatedAt: new Date()
      })
      .where(eq(Rewards.userId, userId))
      .returning()
      .execute();
    return updatedReward;
  } catch (error) {
    console.error("Error updating reward points:", error);
    return null;
  }
}


export async function createTransaction(userId:number,type:'earned_report'|'earned_collect'|'redeemed',amount:number,description:string) {
    try {
        const[transaction]=await db.insert(Transactions).values({
            userId,type,amount,description
        }).returning().execute();
        return transaction
        
    } catch (error) {
        
    }
}

export async function createNotification(userId:number,message:string,type:string) {
    try {
        const[notification]=await db.insert(Notifications).values({userId,message,type}).returning().execute();
        return notification;

    } catch (error) {
        console.error('Error creating notification')
        
    }
}

export async function getRecentReports(limit:number=10) {
    try {
        const reports=await db.select().from(Reports).orderBy(desc(Reports.createdAt)).limit(limit).execute();

    } catch (error) {
        console.error('Error fetching recent reports',error);
        return [];
    }
}

export async function getAvailableRewards(userId:number){
    try {
        const userTransactions=await getRewardTransactions(userId);
        const userPoints=userTransactions?.reduce((total,transaction)=>{
           return transaction.type.startsWith('earned')?total+transaction.amount:total-transaction.amount;
        },0)

        const dbRewards=await db.select({
            id:Rewards.id,
            name:Rewards.name,
            cost:Rewards.points,
            description:Rewards.description,
            collectionInfo:Rewards.collectionsInfo,
        })
        .from(Rewards)
        .where(eq(Rewards.isAvailable,true))
        .execute();

        const allRewards=[
            {
                id:0,
                name:"Your Points",
                cost:userPoints,
                description:"Redeem your earned Points",
                collectionInfo:"Points earned from reporting and collection waste"
            },
            ...dbRewards
        ];

        return allRewards;


    } catch (error) {
        console.error('Error fetching availabel reward',error);
        return[];
    }
}

export async function getWasteCollectionTasks(limit: number = 20) {
  try {
    const tasks = await db
      .select({
        id: Reports.id,
        location: Reports.location,
        wasteType: Reports.wasteType,
        amount: Reports.amount,
        status: Reports.status,
        date: Reports.createdAt,
        collectorId: Reports.collectorId,
      })
      .from(Reports)
      .limit(limit)
      .execute();

    return tasks.map(task => ({
      ...task,
      date: task.date.toISOString().split('T')[0], // Format date as YYYY-MM-DD
    }));
  } catch (error) {
    console.error("Error fetching waste collection tasks:", error);
    return [];
  }
}

export async function updateTaskStatus(reportId: number, newStatus: string, collectorId?: number) {
  try {
    const updateData: any = { status: newStatus };
    if (collectorId !== undefined) {
      updateData.collectorId = collectorId;
    }
    const [updatedReport] = await db
      .update(Reports)
      .set(updateData)
      .where(eq(Reports.id, reportId))
      .returning()
      .execute();
    return updatedReport;
  } catch (error) {
    console.error("Error updating task status:", error);
    throw error;
  }
}


export async function saveReward(userId: number, amount: number) {
  try {
    const [reward] = await db
      .insert(Rewards)
      .values({
        userId,
        name: 'Waste Collection Reward',
        collectionInfo: 'Points earned from waste collection',
        points: amount,
        level: 1,
        isAvailable: true,
      })
      .returning()
      .execute();
    
    // Create a transaction for this reward
    await createTransaction(userId, 'earned_collect', amount, 'Points earned for collecting waste');

    return reward;
  } catch (error) {
    console.error("Error saving reward:", error);
    throw error;
  }
}

export async function saveCollectedWaste(reportId: number, collectorId: number, verificationResult: any) {
  try {
    const [collectedWaste] = await db
      .insert(CollectedWastes)
      .values({
        reportId,
        collectorId,
        collectionDate: new Date(),
        status: 'verified',
      })
      .returning()
      .execute();
    return collectedWaste;
  } catch (error) {
    console.error("Error saving collected waste:", error);
    throw error;
  }
}
