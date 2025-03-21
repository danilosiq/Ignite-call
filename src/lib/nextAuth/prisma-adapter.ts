import { Adapter } from "next-auth/adapters";
import { cookies } from "next/headers";
import { prisma } from "../prisma";

export function PrismaAdapter(): Adapter {
  return {
    
    async createUser(user: any) {
      const userCookies = (await cookies()).get('@igniteCall:userId')

      if(!userCookies){
        throw new Error ('user fot found on cookies')
      }

      const prismaUser = await prisma.user.update({
        where:{
          id:userCookies.value
        },
        data:{
          name:user.name,
          email:user.email,
          avatar_url:user.avatar_url
        }
      })

      

      return {
        id: prismaUser.id,
        name: prismaUser.name,
        email: prismaUser.email!,
        username: prismaUser.username,
        avatar_url: prismaUser.avatar_url!,
      };
    },

    async getUser(id) {
      const user = await prisma.user.findUnique({
        where: {
          id,
        },
      });

      if(!user){
        return null
      }

      return {
        id: user.id,
        name: user.name,
        email: user.email!,
        username: user.username,
        avatar_url: user.avatar_url!,
        emailVerified: null,
      };
    },

    async getUserByEmail(email) {
      const user = await prisma.user.findUnique({
        where: {
          email,
        },
      });

      if(!user){
        return null
      }

      return {
        id: user.id,
        name: user.name,
        email: user.email!,
        username: user.username,
        avatar_url: user.avatar_url!,
        emailVerified: null,
      };
    },

    async getUserByAccount({ providerAccountId, provider }) {
      const account = await prisma.account.findUnique({
        where: {
          provider_provider_account_id: {
            provider,
            provider_account_id: providerAccountId,
          },
        },
        include: {
          user: true,
        },
      });
      if(!account || !account.user){
        return null
      }
      const {user} = account
      return {
        id: user.id,
        name: user.name,
        email: user.email!,
        username: user.username,
        avatar_url: user.avatar_url!,
        emailVerified: null,
      };
    },
    async updateUser(user) {
      const prismaUser = await prisma.user.update({
        where: {
          id: user.id!,
        },
        data: {
          name: user.name,
          email: user.email,
          avatar_url: user.avatar_url,
        },
      });
      return {
        id: prismaUser.id,
        name: prismaUser.name,
        email: prismaUser.email!,
        username: prismaUser.username,
        avatar_url: prismaUser.avatar_url!,
        emailVerified: null,
      };
    },

    async linkAccount(account:any) {
      let user = await prisma.user.findFirst({
        where: { email: account.email },
      });
    
      if (!user) {
        user = await prisma.user.create({
          data: {
            name: account.name ?? 'Unknown',
            email: account.email ?? null,
            avatar_url: account.image ?? null,
            username: account.email?.split('@')[0] ?? `user_${Date.now()}`
          }
        });
      }
      await prisma.account.create({
        data:{
          user_id:user.id,
          type:account.type,
          provider:account.provider,
          provider_account_id:account.providerAccountId,
          refresh_token:account.refresh_token,
          access_token:account.access_token,
          expires_at:account.expires_at,
          token_type:account.token_type,
          scope:account.scope,
          id_token:account.id_token,
          session_state:account.session_state

        }
      })
    },
    async getSessionAndUser(sessionToken) {
      const prismaSession = await prisma.session.findUnique({
        where: {
          session_token: sessionToken,
        },
        include: {
          user: true,
        },
      });
      if(!prismaSession || !prismaSession.user){
        return null
      }
  
      const {user, ...session} = prismaSession
      return {
        session: {
          userId: session.user_id,
          expires: session.expires,
          sessionToken: session.session_token,
        },
        user: {
          id: user.id,
          name: user.name,
          email: user.email!,
          username: user.username,
          avatar_url: user.avatar_url!,
          emailVerified: null,
        },
      };
    },
    async updateSession({ sessionToken,userId,expires }) {
        const prismaSession = await prisma.session.update({
            where: {
              session_token: sessionToken
            },
            data: {
              expires,
              user_id:userId
            },
          });
          return {
            sessionToken:prismaSession.session_token,
            userId:prismaSession.user_id,
            expires:prismaSession.expires
          };
    },

    async createSession({ userId, sessionToken, expires }: { userId: string, sessionToken: string, expires: Date }) {
      const session = await prisma.session.create({
        data: {
          user_id: userId,
          session_token: sessionToken,
          expires,
        },
      });
    
      return {
        sessionToken: session.session_token,
        userId: session.user_id,
        expires: session.expires,
      };
    }
  };
}
