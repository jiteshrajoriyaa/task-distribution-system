const express = require('express')
const { Router } = require('express')
const router = Router()
const { z } = require('zod')
const { Admin } = require('../db')
const jwt = require('jsonwebtoken')

const adminZod = z.object({
    name: z.string().min(1),
    email: z.email(),
    password: z.string().min(8)
})

router.post('/signup', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const response = adminZod.safeParse({ name, email, password });
        if (!response.success) {
            return res.status(422).json({
                msg: "Please enter data in valid format",
            })
        }

        const exisitingUser = await Admin.findOne({
            email
        })
        if (exisitingUser) {
            return res.status(409).json({
                msg: "User already exist"
            })
        }
        const token = jwt.sign({ email }, process.env.JWT_STRING)

        await Admin.create({
            name,
            email,
            password
        })

        res.json({
            msg: "User created successfully",
            token
        })
    } catch (e) {
        console.error(e)
        return res.status(500).json({ msg: "Internal server error" });

    }
})

router.post('/signin', async (req, res) => {
    const { email, password } = req.body;
    try {

        const exisitingUser = await Admin.findOne({ email, password })
        if (!exisitingUser) {
            return res.status(401).json({
                msg: "email id or password is wrong"
            })
        }

        const token = jwt.sign({ email }, process.env.JWT_STRING)
        res.json({
            msg: "User logged in succesfully",
            token
        })
    } catch (e) {
        console.error(e)
        return res.status(500).json({ msg: "Internal server error" });

    }
})

module.exports = router