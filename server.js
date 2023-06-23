const express = require('express');
const app = express();
const port = 8080;
const host = 'localhost';

const config = {
  maxThreads: 3,
  threadSpeed: 1024 
};

const keywordsList = {
  'one' : 
  ['https://jsonplaceholder.typicode.com/comments/1', 
  'https://jsonplaceholder.typicode.com/comments/2', 
  'https://jsonplaceholder.typicode.com/comments/3', 
  'https://jsonplaceholder.typicode.com/comments/4'],
  
  'two' : 
  ['https://jsonplaceholder.typicode.com/comments/5', 
  'https://jsonplaceholder.typicode.com/comments/6', 
  'https://jsonplaceholder.typicode.com/comments/7', 
  'https://jsonplaceholder.typicode.com/comments/8'],

  'three' : 
  ['https://jsonplaceholder.typicode.com/comments/9', 
  'https://jsonplaceholder.typicode.com/comments/10', 
  'https://jsonplaceholder.typicode.com/comments/11', 
  'https://jsonplaceholder.typicode.com/comments/12']
};

app.use(express.static('public'));

app.get('/search/:keyword', (req, res) => {
  const keyword = req.params.keyword;
  const urls = keywordsList[keyword];
  if (urls) {
    res.json(urls);
  } else {
    res.status(404).send('Ключевое слово не найдено');
  }
});

app.listen(port, host, () => {
  console.log(`Сервер запущен по адресу: http://${host}:${port}`);
});

app.get('/download/:url', async (req, res) => {
  const url = req.params.url;
  try {
    const response = await fetch(url);
    if (response.ok) {
      const content = await response.text();
      res.send(content);
    } else {
      res.status(response.status).send(response.statusText);
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
});


app.get('/status', (req, res) => {
  const threads = Math.min(config.maxThreads, keywordsList.length);
  const progress = Math.round((bytesReceived / contentLength) * 100);
  const status = {
    size: contentLength,
    threads: threads,
    progress: progress
  };
  res.json(status);
});