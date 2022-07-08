(function () {
  const onPost = function (event) {
    const xhr = new XMLHttpRequest();
    xhr.onload = () => {
      console.log(`response ${xhr.response}`);
    };
    xhr.open('GET', '/comments');
    xhr.send();
  };

  const formatFormData = (entries) => {
    const formData = [];
    for (const [key, value] of entries) {
      formData.push(`${key}=${value}`);
    }
    return formData;
  };

  const postComment = () => {
    const form = document.querySelector('#form');
    const formData = new FormData(form);
    const body = formatFormData(formData).join('&');
    console.log(body);
    const xhr = new XMLHttpRequest();
    xhr.onload = onPost;
    xhr.open('POST', '/comments');
    xhr.send(body);

  };

  const main = () => {
    const submit = document.querySelector('#submit');
    submit.onclick = postComment;
  };

  window.onload = main;
})();