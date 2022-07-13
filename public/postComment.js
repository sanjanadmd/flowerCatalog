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
    const comments = JSON.parse(xhr.response);
    const table = document.querySelector('#comments');
    table.innerHTML = null;
    comments.forEach(comment => {
      const row = createRow(comment);
      table.appendChild(row);
    });

  };

  const getGuestBook = () => {
    const options = {
      method: 'GET',
      url: '/api/comments',
      statusCodes: 200,
      onLoad: createTable,
    };

    createXhr(options);
  };

  const postComment = () => {
    const form = document.querySelector('#form');
    const formData = new FormData(form);
    const body = new URLSearchParams(formData).toString();

    const options = {
      method: 'POST',
      url: '/comments',
      statusCodes: 201,
      onLoad: getGuestBook,
      body: body
    };

    createXhr(options);
  };

  const main = () => {
    const submit = document.querySelector('#submit');
    submit.onclick = postComment;
  };

  window.onload = main;
})();