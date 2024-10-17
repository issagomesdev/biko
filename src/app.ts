import express from 'express';
import path from 'path';
import jwt from 'jsonwebtoken';

const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, '../public')));

// function authUser(req: express.Request, res: express.Response, next: express.NextFunction) {
//     const token = req.headers.authorization?.split(' ')[1];

//     if (!token) {
//         return res.redirect('/login');
//     }

//     jwt.verify(token, 'seu_segredo', (err:any, decoded:any) => {
//         if (err) {
//             return res.redirect('/login');
//         }
        
//         next();
//     });
// }

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/pages/internal/index.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/pages/auth/login.html'));
});

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/pages/auth/register.html'));
});

app.get('/logout', (req, res) => {
    res.redirect('/login');
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
