# Task Distribution System

A MERN stack web app where an **Admin** can create agents and distribute tasks by uploading CSV/XLSX/XLS files.  
The uploaded data is **validated, processed, and distributed equally among agents**, then displayed beautifully on the frontend.

---

### 🚀 Features
- Upload **CSV/XLS/XLSX** files with tasks  
- Distribute tasks automatically among agents  
- View assigned tasks on the frontend  

---

### ⚙️ Setup Instructions

#### 1. Clone the repo
```bash
git clone https://github.com/jiteshrajoriyaa/task-distribution-system.git
cd task-distribution
```

#### 2. Enter in backend dir
```
cd backend
npm install
```

#### 3. Make .env file and add this
```
PORT=3000
MONGO_URI=your-mongodb-url
JWT_SECRET=your-secret
```

#### 4. Run Server
```
node ./index.js
````

#### 5.frontend Setup
```
cd ../frontend
npm i
npm run dev
```

### Tech Stack
- Frontend: React, TailwindCSS, shadcn/ui, Axios
- Backend: Node.js, Express.js, MongoDB, Multer, XLSX, CSV-Parser


