const { Router } = require('express');
const { z } = require('zod');
const { Agent } = require('../db');
const adminMiddleWare = require('../middleware/admin');
const router = Router();

const agentsZod = z.object({
    name: z.string().min(1),
    email: z.string().email(),
    countryCode: z.string().length(2, { message: "Enter valid country code" }).regex(/^\d+$/, { message: "Phone number must contain only digits" })  ,
    phone: z.string().regex(/^\d+$/, { message: "Phone number must contain only digits" }).min(10, { message: "Enter valid phone number" }).refine((val) => !val.startsWith("0"), {
        message: "Phone number cannot start with 0",
    })
})

router.post('/add-agents', adminMiddleWare, async (req, res) => {
    try {
        const { name, email, countryCode, phone } = req.body;
        const response = agentsZod.safeParse({ name, email, countryCode, phone })

        if (!response.success) {
            return res.status(400).json({
                msg: "Please enter valid data",
            });
        }

        const fullNumber = "+" + countryCode + phone;
        const existingAgent = await Agent.findOne({
            $or: [{email}, {fullNumber}]
        })
        if (existingAgent) {
            return res.status(409).json({
                msg: "Agent already exist"
            })
        }

        await Agent.create({
            name,
            email,
            fullNumber,
        })

        return res.json({
            msg: "Agent added successfully"
        })
    } catch (e) {
        console.error(e)
        return res.status(500).json({ msg: "Internal server error" });
    }
})

module.exports = router