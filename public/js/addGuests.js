document.addEventListener('DOMContentLoaded', function () {
    const guestsButton = document.getElementById('guests-button');
    const guestsMenu = document.getElementById('guests-menu');
    const checkInInput = document.getElementById('checkin');
    const checkOutInput = document.getElementById('checkout');
    const totalPriceElement = document.getElementById('totalPriceValue');

    // Example listing data, replace with actual data from your backend
    // const listing = {
    //     price: 8900,
    //     priceAfterTax: 10502
    // };
    const price = listing.price;
    const priceAfterTax = listing.priceAfterTax;
    console.log(price, priceAfterTax);

    // Set default date values on window load
    window.onload = function () {
        const dateInputs = document.querySelectorAll('.dateInput');
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');

        const currentDate = `${year}-${month}-${day}`;
        dateInputs.forEach((ele) => {
            ele.value = currentDate;
        });

        // Call updateTotalPrice after setting the date values
        updateTotalPrice();
    };

    // Function to calculate total rent
    function calculateTotalRent(checkIn, checkOut, price, priceAfterTax, guests) {
        const checkInDate = new Date(checkIn);
        const checkOutDate = new Date(checkOut);

        // Ensure dates are valid
        if (isNaN(checkInDate) || isNaN(checkOutDate)) {
            console.error("Invalid check-in or check-out date.");
            return 0;
        }

        let sum = 0;
        if (guests.adults <= 2) {
            sum += priceAfterTax;
        } else {
            let extras = guests.adults - 2;
            sum += extras * (price / 2) + priceAfterTax;
        }
        if (guests.children > 2) {
            let extras = guests.children - 2;
            sum += extras * (price / 4);
        }
        if (guests.infants > 2) {
            let extras = guests.infants - 2;
            sum += extras * (price / 4);
        }
        const nights = (checkOutDate - checkInDate) / (1000 * 60 * 60 * 24);

        // Ensure nights are valid
        if (isNaN(nights) || nights < 0) {
            console.error("Invalid number of nights.");
            return 0;
        }

        return sum * (nights + 1);
    }

    // Function to update the total price
    function updateTotalPrice() {
        const checkIn = checkInInput.value;
        const checkOut = checkOutInput.value;
        console.log('Check-in date:', checkIn);
        console.log('Check-out date:', checkOut);

        if (!checkIn || !checkOut) {
            console.log("Check-in or check-out date is missing.");
            return;
        }

        const guests = {
            adults: parseInt(document.getElementById('adults-count').textContent),
            children: parseInt(document.getElementById('children-count').textContent),
            infants: parseInt(document.getElementById('infants-count').textContent)
        };
        console.log('Guests:', guests);

        const total = calculateTotalRent(checkIn, checkOut, price, priceAfterTax, guests);

        // Ensure total is a valid number
        if (isNaN(total)) {
            console.error("Total rent calculation resulted in NaN.");
            totalPriceElement.textContent = "Error calculating price";
            return;
        }

        totalPriceElement.textContent = total.toLocaleString("en-IN");
    }

    guestsButton.addEventListener('click', function () {
        guestsMenu.style.display = guestsMenu.style.display === 'block' ? 'none' : 'block';
    });

    document.querySelectorAll('.plus, .minus').forEach(button => {
        button.addEventListener('click', function () {
            const type = this.dataset.type;
            const countElement = document.getElementById(`${type}-count`);
            let count = parseInt(countElement.textContent);

            if (this.classList.contains('plus')) {
                count++;
            } else {
                count--;
            }

            if (count < 0) count = 0;

            countElement.textContent = count;
            document.getElementById(`${type}-input`).value = count;

            updateGuestsButton();
            updateTotalPrice(); // Update the price when guest count changes
        });
    });

    function updateGuestsButton() {
        const adults = parseInt(document.getElementById('adults-input').value);
        const children = parseInt(document.getElementById('children-input').value);
        const infants = parseInt(document.getElementById('infants-input').value);
        const totalGuests = adults + children;
        guestsButton.textContent = `${totalGuests} guest${totalGuests !== 1 ? 's' : ''}, ${infants} infant${infants !== 1 ? 's' : ''}`;
    }

    document.addEventListener('click', function (event) {
        if (!guestsButton.contains(event.target) && !guestsMenu.contains(event.target)) {
            guestsMenu.style.display = 'none';
        }
    });

    // Event listeners for date inputs
    checkInInput.addEventListener('change', updateTotalPrice);
    checkOutInput.addEventListener('change', updateTotalPrice);

    // Initial calculation on page load
    updateTotalPrice();
});
 














// document.addEventListener('DOMContentLoaded', function () {
//     const guestsButton = document.getElementById('guests-button');
//     const guestsMenu = document.getElementById('guests-menu');
//     const checkInInput = document.getElementById('checkin');
//     const checkOutInput = document.getElementById('checkout');
//     const totalPriceElement = document.getElementById('totalPriceValue');

//     // Example listing data, replace with actual data from your backend
//     // const listing = {
//     //     price: 8900,
//     //     priceAfterTax: 10502
//     // };
//     const price = listing.price;
//     const priceAfterTax = listing.priceAfterTax;
//     console.log(price, priceAfterTax);

//     // Set default date values on window load
//     window.onload = function () {
//         const dateInputs = document.querySelectorAll('.dateInput');
//         const today = new Date();
//         const year = today.getFullYear();
//         const month = String(today.getMonth() + 1).padStart(2, '0');
//         const day = String(today.getDate()).padStart(2, '0');

//         const currentDate = `${year}-${month}-${day}`;
//         dateInputs.forEach((ele) => {
//             ele.value = currentDate;
//         });

//         // Call updateTotalPrice after setting the date values
//         updateTotalPrice();
//     };

//     // Function to calculate total rent
//     function calculateTotalRent(checkIn, checkOut, price, priceAfterTax, guests) {
//         const checkInDate = new Date(checkIn);
//         const checkOutDate = new Date(checkOut);
//         let sum = 0;
//         if (guests.adults <= 2) {
//             sum += priceAfterTax;
//         } else {
//             let extras = guests.adults - 2;
//             sum += extras * (price / 2) + priceAfterTax;
//         }
//         if (guests.children > 2) {
//             let extras = guests.children - 2;
//             sum += extras * (price / 4);
//         }
//         if (guests.infants > 2) {
//             let extras = guests.infants - 2;
//             sum += extras * (price / 4);
//         }
//         const nights = (checkOutDate - checkInDate) / (1000 * 60 * 60 * 24);
//         return sum * (nights + 1);
//     }

//     // Function to update the total price
//     function updateTotalPrice() {
//         const checkIn = checkInInput.value;
//         const checkOut = checkOutInput.value;
//         console.log('Check-in date:', checkIn);
//         console.log('Check-out date:', checkOut);

//         if (!checkIn || !checkOut) {
//             console.log("Check-in or check-out date is missing.");
//             return;
//         }

//         const guests = {
//             adults: parseInt(document.getElementById('adults-count').textContent),
//             children: parseInt(document.getElementById('children-count').textContent),
//             infants: parseInt(document.getElementById('infants-count').textContent)
//         };
//         console.log('Guests:', guests);

//         const total = calculateTotalRent(checkIn, checkOut, price, priceAfterTax, guests);
//         totalPriceElement.textContent = total.toLocaleString("en-IN");
//     }

//     guestsButton.addEventListener('click', function () {
//         guestsMenu.style.display = guestsMenu.style.display === 'block' ? 'none' : 'block';
//     });

//     document.querySelectorAll('.plus, .minus').forEach(button => {
//         button.addEventListener('click', function () {
//             const type = this.dataset.type;
//             const countElement = document.getElementById(`${type}-count`);
//             let count = parseInt(countElement.textContent);

//             if (this.classList.contains('plus')) {
//                 count++;
//             } else {
//                 count--;
//             }

//             if (count < 0) count = 0;

//             countElement.textContent = count;
//             document.getElementById(`${type}-input`).value = count;

//             updateGuestsButton();
//             updateTotalPrice(); // Update the price when guest count changes
//         });
//     });

//     function updateGuestsButton() {
//         const adults = parseInt(document.getElementById('adults-input').value);
//         const children = parseInt(document.getElementById('children-input').value);
//         const infants = parseInt(document.getElementById('infants-input').value);
//         const totalGuests = adults + children;
//         guestsButton.textContent = `${totalGuests} guest${totalGuests !== 1 ? 's' : ''}, ${infants} infant${infants !== 1 ? 's' : ''}`;
//     }

//     document.addEventListener('click', function (event) {
//         if (!guestsButton.contains(event.target) && !guestsMenu.contains(event.target)) {
//             guestsMenu.style.display = 'none';
//         }
//     });

//     // Event listeners for date inputs
//     checkInInput.addEventListener('change', updateTotalPrice);
//     checkOutInput.addEventListener('change', updateTotalPrice);

//     // Initial calculation on page load
//     updateTotalPrice();
// });
