const alert = document.getElementById('alert');
if (alert) {
    setTimeout(() => {
        alert.remove();
    }, 1500);
}