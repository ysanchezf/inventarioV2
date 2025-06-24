import { prisma } from './prisma'

export async function query<T = any>(sql: string, params: any[] = []): Promise<T[]> {
  return prisma.$queryRawUnsafe(sql, ...params) as Promise<T[]>
}
