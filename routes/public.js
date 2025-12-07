import express from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

import pkg from '@prisma/client';
const { PrismaClient } = pkg;
export { prisma }

const prisma = new PrismaClient()
const router = express.Router()

const JWT_SECRET = process.env.JWT_SECRET

//cadastro
router.post('/cadastro', async (req, res) => {
    const user = req.body
    const salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(user.password, salt)

    try {
        await prisma.user.create({
            data:{
                email: user.email,
                name: user.name,
                password: hashPassword
            }
        })
    
        res.status(201).json({message: "Usuário cadastrado com sucesso!"})
    } catch (error) {
        res.status(500).json({message: "Erro no servidor, tente novamente"})
    }

})

//login
router.post('/login', async (req, res) => {
    try {
        const userInfo = req.body

        //Busca usuário no banco de dados
        const user = await prisma.user.findUnique({
            where:{
                email: userInfo.email
            }
        })

        //Verifica se retornou o usuário
        if(!user){
            return res.status(404).json({message: "Usuário não encontrado"})
        }

        //Compara a sneha do banco com a senha digitada
        const isMatch = await bcrypt.compare(userInfo.password, user.password)

        if (!isMatch) {
            return res.status(400).json({message: "Senha inválida"})
        }

        //Gerar Token JWT
        const token = jwt.sign({id: user.id}, JWT_SECRET, {expiresIn: '15'})

        res.status(200).json(token)
    } catch (error) {
        res.status(500).json({message: "Erro no servidor, tente novamente"})
    }
})

export default router