
window.onload = function () {
    const dateInput = document.querySelectorAll('.dateInput');
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-based, so we add 1.
    const day = String(today.getDate()).padStart(2, '0');

    const currentDate = `${year}-${month}-${day}`;
    dateInput.forEach((ele) => {
        ele.value = currentDate;
    })
};
