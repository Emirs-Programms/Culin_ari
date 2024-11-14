document.addEventListener("DOMContentLoaded", function() {
    const reviewsSection = document.getElementById("reviews-section");
    const addReviewButton = document.getElementById("addReviewButton");

    // Load reviews from the API when the page loads
    loadReviews();

    // Event handler for like buttons
    reviewsSection.addEventListener("click", function(event) {
        if (event.target.classList.contains("like-button")) {
            const review = event.target.closest(".review");
            const likeCountSpan = review.querySelector(".like-count");
            let likeCount = parseInt(likeCountSpan.textContent, 10);
            const reviewId = review.getAttribute("data-id");

            // Check if the user has already liked this review
            const hasLiked = localStorage.getItem(`liked-${reviewId}`);

            if (!hasLiked) {
                // Increase like count
                likeCount++;
                likeCountSpan.textContent = likeCount;

                // Save the like status in localStorage
                localStorage.setItem(`liked-${reviewId}`, 'true');

                // Update likes in the API (optional, if you have an endpoint to handle likes)
                // saveLikes(reviewId, likeCount);
            } else {
                alert("Вы уже поставили лайк на этот отзыв.");
            }
        }
    });

    // Event handler for adding new reviews
    addReviewButton.addEventListener("click", function() {
        const userName = prompt("Введите ваше имя:");
        const userReview = prompt("Введите ваш отзыв:");

        if (userName && userReview) {
            // Create a new review element
            const newReview = document.createElement("div");
            const reviewId = Date.now(); // Unique identifier for the review
            newReview.classList.add("review");
            newReview.setAttribute("data-id", reviewId); // Set a unique data attribute

            // Insert HTML for the new review
            newReview.innerHTML = `
                <h3>${userName}</h3>
                <p>${userReview}</p>
                <span class="date">${new Date().toLocaleDateString()}</span>
                <div class="like-section">
                    <button class="like-button">👍</button>
                    <span class="like-count">0</span>
                </div>
            `;

            // Add the new review to the section
            reviewsSection.appendChild(newReview);
            // Save review to the API
            saveReviewToAPI({ id: reviewId, name: userName, content: userReview, likes: 0 });
        } else {
            alert("Пожалуйста, заполните оба поля.");
        }
    });


// Отслеживаем прокрутку страницы
window.addEventListener('scroll', () => {
    const progressBar = document.getElementById('scroll-progress');
    const scrolledFraction = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
    progressBar.style.transform = `scaleX(${scrolledFraction})`;
});


    // Function to load reviews from the API
    function loadReviews() {
        fetch('https://api-ay9f1w2m8-emirs-projects-4082d7d6.vercel.app/api/reviews')
            .then(response => response.json())
            .then(reviews => {
                reviews.forEach(reviewData => {
                    const newReview = document.createElement("div");
                    newReview.classList.add("review");
                    newReview.setAttribute("data-id", reviewData.id); // Unique ID
                    newReview.setAttribute("data-likes", reviewData.likes); // Load like count

                    // Insert HTML for the review
                    newReview.innerHTML = `
                        <h3>${reviewData.name}</h3>
                        <p>${reviewData.content}</p>
                        <span class="date">${reviewData.date}</span>
                        <div class="like-section">
                            <button class="like-button">👍</button>
                            <span class="like-count">${reviewData.likes}</span>
                        </div>
                    `;

                    // Check if the user has already liked this review
                    const likedKey = `liked-${reviewData.id}`;
                    if (localStorage.getItem(likedKey)) {
                        newReview.querySelector('.like-button').disabled = true; // Disable the button if already liked
                    }

                    // Add the loaded review to the section
                    reviewsSection.appendChild(newReview);
                });
            })
            .catch(error => console.error('Error loading reviews:', error));
    }

    // Function to save a review to the API
    function saveReviewToAPI(reviewData) {
        fetch('https://api-ay9f1w2m8-emirs-projects-4082d7d6.vercel.app/api/reviews', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(reviewData)
        })
        .then(response => response.json())
        .then(data => {
            console.log('Review saved:', data);
        })
        .catch(error => console.error('Error saving review:', error));
    }

    // Clear all reviews from localStorage and reload the page
    document.getElementById("clearStorageButton").addEventListener("click", function() {
        localStorage.clear();
        reviewsSection.innerHTML = ""; // Clear the reviews section
    });
});
