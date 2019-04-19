var browserType = navigator.userAgent.toLowerCase().match(/msie ([\d.]+)/);
if (browserType) {
    window.location.href = "error.html";
}