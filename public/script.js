const searchButton = document.getElementById('searchButton');
const keywordInput = document.getElementById('keywordInput');
const urlList = document.getElementById('urlList');

const progressBar = document.getElementById('progressBar');
const progressBarInner = document.getElementById('progressBarInner');

const resultTitle = document.getElementById('resultTitle');

const downloadStatusElement = document.getElementById('downloadStatus');
const downloadedListElement = document.getElementById('downloadedList');

const selectedContentElement = document.getElementById('selectedContent');
const selectedContentTextElement = document.getElementById('selectedContentText');
const downloadedContent = new Set();


    searchButton.addEventListener('click', async () => {
        const keyword = keywordInput.value;
      if (!keyword) return;
     resultTitle.style.display = 'none'; 
  const urls = await getUrls(keyword);
  if (urls) {
    displayUrls(urls);
    resultTitle.style.display = 'block'; 
  }
});


async function getUrls(keyword) {
  try {
    const response = await fetch(`http://localhost:8080/search/${keyword}`);
    if (response.ok) {
      const urls = await response.json();
      return urls;
    } else {
      console.error('Ошибка:', response.status, response.statusText);
    }
  } catch (error) {
    console.error(error);
  }
}


function displayUrls(urls) {
  urlList.innerHTML = '';
    for (const url of urls) {
    const li = document.createElement('li');
        li.className = 'list-group-item';
          li.textContent = url;
        li.title = url; 
        li.addEventListener('click', () => downloadContentWithProgress(url, li));
        urlList.appendChild(li);
  }
}


async function downloadContentWithProgress(url, listItem) {
    if (downloadedContent.has(url)) {
      alert('Этот контент уже был загружен.');
        return;
  }

  try {
    const response = await fetch(`http://localhost:8080/download/${encodeURIComponent(url)}`);
    if (response.ok) {
      progressBar.style.display = 'block';
      progressBarInner.style.width = '0%';
    const contentLength = response.headers.get('Content-Length');
     const reader = response.body.getReader();
     let bytesReceived = 0;
      let content = '';
      while (true)  {
        const { done, value } = await reader.read();
        if (done) break;
      bytesReceived += value.length;
        content += new TextDecoder('utf-8').decode(value);
      const progress = Math.round((bytesReceived / contentLength) * 100);
        progressBarInner.style.width = `${progress}%`;

     
          downloadStatusElement.style.display = 'block';
           downloadStatusElement.textContent = `Размер: ${contentLength} | Прогресс: ${progress}%`;
    }
localStorage.setItem('content', content);
      progressBar.style.display = 'none';

   
    const statusResponse = await fetch('http://localhost:8080/status');
      if (statusResponse.ok) {
     const status = await statusResponse.json();
        downloadStatusElement.textContent = `Размер: ${status.size} | Потоки: ${status.threads} | Прогресс: ${status.progress}%`;
      }


        downloadedContent.add(url);
        listItem.disabled = true;
        listItem.style.opacity = '0.5';

       const li = document.createElement('li');
          li.className = 'list-group-item';
         li.textContent = url;
        li.title = url; 
        li.addEventListener('click', () => {
           selectedContentElement.style.display = 'block';
        selectedContentTextElement.textContent = content;
      } );
        downloadedListElement.appendChild(li);
    } else {
        console.error('Ошибка:', response.status, response.statusText);
    }
  }  catch (error) {
        console.error(error);
  }
}
