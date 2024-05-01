function tax_switch() {
    let taxSwitch = document.getElementById('tax_switch');
    let priceAfterTax = document.querySelectorAll('.priceAfterTax');
    let price = document.querySelectorAll('.price');
    if (taxSwitch.checked == true) {
        priceAfterTax.forEach(el => {
            el.style.display = "block";
            taxSwitch.style.backgroundColor = 'lightblue';
            taxSwitch.style.border = 'none';
        });
        price.forEach(el => {
            el.style.display = "none";
        });
    } else {
        price.forEach(el => {
            el.style.display = "block";
            taxSwitch.style.backgroundColor = 'transparent';
            taxSwitch.style.border = '1px solid gray';
        });
        priceAfterTax.forEach(el => {
            el.style.display = "none";
        });
    }
}