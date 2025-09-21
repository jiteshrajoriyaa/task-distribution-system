const { Router } = require('express')
const multer = require('multer')
const csv = require('csv-parser')
const XLSX = require('xlsx')
const stream = require('stream')
const { Agent, DistributedList } = require('../db')

const router = Router()
const upload = multer({ storage: multer.memoryStorage() })

//Helper: validate row for correct format
const validateRow = (row) => {
    const firstName = row.FirstName?.trim();
    const phone = row.Phone?.toString().trim();
    const notes = row.Notes?.trim();

    return (
        firstName && typeof firstName === 'string' &&
        phone && !isNaN(Number(phone)) &&
        notes && typeof notes === 'string'
    );
};

//File uploading router
router.post('/assign-task', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({
            msg: 'No file uploaded'
        })

        // For csv, xlsx and xls only
        const allowedTypes = [
            'text/csv',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'application/vnd.ms-excel'
        ]

        if (!allowedTypes.includes(req.file.mimetype)) {
            return res.status(400).json({
                msg: "Invalid file type. Only csv, xls and xlsx are allowed"
            })
        }

        let rows = []
        if (req.file.mimetype === 'text/csv') {
            // csv parsing
            const readable = new stream.Readable()
            readable.push(req.file.buffer)
            readable.push(null) // for ending


            await new Promise((resolve, reject) => {
                readable
                    .pipe(csv())
                    .on('data', (row) => {
                        if (!validateRow(row)) {
                            reject(new Error("csv file has invalid data types"))
                        }
                        rows.push({
                            FirstName: row.FirstName.trim(),
                            Phone: Number(row.Phone.toString().trim()),
                            Notes: row.Notes.trim()
                        })
                    })
                    .on('end', resolve)
                    .on('error', reject)
            })
        }
        else {
            // xlsx parsing
            const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
            const sheetName = workbook.SheetNames[0];
            const sheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName])

            for (let row of sheet) {
                if (!validateRow(row)) throw new Error("Excel file has invalid data types")
                rows.push({
                    FirstName: row.FirstName.trim(),
                    Phone: Number(row.Phone.toString().trim()),
                    Notes: row.Notes.trim()
                })
            }
        }

        // Fetching 5 agents from DB
        const agents = await Agent.find()
        if (agents.length < 1) return res.status(400).json({
            msg: "Add at least 1 agents"
        })

        //Distributing items
        const distributed = agents.map((agent) => ({ agentId: agent._id, name: agent.name, fullNumber: agent.fullNumber, email: agent.email, items: [] }))
        rows.forEach((item, idx) => {
            const agentIdx = idx % 5;
            distributed[agentIdx].items.push(item)
        })

        //Saving in mongoDB
        for (let list of distributed) {
            await DistributedList.create(list)
        }

        res.json({
            message: "Task distributed successfully", 
            distributed,
            agents
        })
    } catch (e) {
        res.status(500).send(e.toString())
    }
})

module.exports = router