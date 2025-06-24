import type { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";
import { prisma } from "../../lib/prisma";
import { DepartamentoSchema } from "../../lib/zodSchemas";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === "GET") {
      const deps = await prisma.departamento.findMany();
      return res.status(200).json(deps);
    }

    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
      return res.status(401).json({ message: "No autorizado" });
    }
    if ((token as any).rol !== "ADMIN") {
      return res.status(403).json({ message: "Forbidden" });
    }
    const actorId = Number(token.sub);

    if (req.method === "POST") {
      const data = DepartamentoSchema.parse(req.body);
      const dep = await prisma.departamento.create({ data });
      return res.status(201).json(dep);
    }

    if (req.method === "PUT") {
      const { id, ...rest } = req.body;
      const data = DepartamentoSchema.partial().parse(rest);
      const before = await prisma.departamento.findUnique({
        where: { id: Number(id) },
        select: { nombre: true, descripcion: true }
      });
      const dep = await prisma.departamento.update({
        where: { id: Number(id) },
        data,
      });

      await prisma.auditLog.create({
        data: {
          userId: actorId,
          action: 'EDITAR',
          entity: 'Departamento',
          entityId: Number(id),
          changes: { antes: before, despues: data }
        }
      });

      return res.status(200).json(dep);
    }

    if (req.method === "DELETE") {
      const { id } = req.query;
      const dep = await prisma.departamento.findUnique({
        where: { id: Number(id) },
        select: { nombre: true }
      });
      await prisma.departamento.delete({ where: { id: Number(id) } });

      await prisma.auditLog.create({
        data: {
          userId: actorId,
          action: 'ELIMINAR',
          entity: 'Departamento',
          entityId: Number(id),
          changes: dep
        }
      });

      return res.status(204).end();
    }

    res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
    return res.status(405).end();
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
}
