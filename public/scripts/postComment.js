(function () {

  const createXhr = ({ method, url, body = '', onLoad }) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = () => {
      onLoad(xhr);
    };
    xhr.open(method, url);
    xhr.send(body);
  };

  const createRow = (row) => {
    const tr = document.createElement('tr');

    const tableData = Object.values(row).map(value => {
      const td = document.createElement('td');
      td.innerText = value;
      return td;
    });

    tableData.forEach(data => {
      tr.appendChild(data);
    });
    return tr;
  };

  const createTable = (xhr) => {
    const textArea = document.querySelector('textarea');
    textArea.value = '';
    const comments = JSON.parse(xhr.response);
    const table = document.querySelector('#comments');
    table.innerHTML = null;
    comments.forEach(comment => {
      const row = createRow(comment);
      table.appendChild(row);
    });

  };

  const getGuestBook = () => {
    let options = {
      method: 'GET',
      url: '/guest-book/api/comments',
      onLoad: createTable,
    };

    createXhr(options);
  };

  const postComment = () => {
    const form = document.querySelector('#form');
    const formData = new FormData(form);
    const body = new URLSearchParams(formData);
    const options = {
      method: 'POST',
      url: '/guest-book/comments',
      onLoad: getGuestBook,
      body,
    };

    createXhr(options);
  };

  const main = () => {
    const submit = document.querySelector('#submit');
    submit.onclick = postComment;
  };

  window.onload = main;
})();