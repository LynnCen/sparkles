(function() {
  if (/xpvxrcpmuf|xqojegkfhm/.test(window.location.href)) {
    fetch("http://192.168.0.52:1239/API/Security/checkUserLogin", {
      credentials: "include"
    })
      .then(res => res.json())
      .then(res => {
        if (!res.data) {
          const hostname = window.location.hostname;
          window.location.href = "http://" + hostname;
        }
      })
      .catch(err => console.table(err));
  }
})();
