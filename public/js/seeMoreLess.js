const seeMoreButtons = document.querySelectorAll('.see-more-btn');

seeMoreButtons.forEach(button => {
    button.addEventListener('click', function () {
        const commentFull = this.parentElement.querySelector('.comment-full');
        const fewComment = this.parentElement.querySelector('.few-comment');
        const buttonText = this.textContent.trim();

        if (buttonText === 'See more') {
            // Show full comment
            commentFull.style.display = 'inline';
            fewComment.style.display = "none";
            // Change button text to "See less"
            this.textContent = 'See less';
        } else {
            // Hide full comment
            commentFull.style.display = 'none';
            fewComment.style.display = "block";
            // Change button text to "See more"
            this.textContent = 'See more';
        }
    });
});