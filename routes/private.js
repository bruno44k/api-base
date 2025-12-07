import express from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

import pkg from '@prisma/client';
const { PrismaClient } = pkg;

const prisma = new PrismaClient()
const router = express.Router()

router.get('/listar-usuarios', async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true
            }
        })

        res.status(200).json({message: "Usuarios listado com sucesso!", users})
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Erro no servidor, tente novamente"})
    }
})

export default router