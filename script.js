document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const animalContainer = document.getElementById('animalContainer');
    const loading = document.getElementById('loading');
    const emptyState = document.getElementById('emptyState');
    let breeds = [];

    // Fetch dog breeds data
    function fetchBreeds() {
        loading.style.display = 'block';
        fetch('https://dog.ceo/api/breeds/list/all')
            .then(response => response.json())
            .then(data => {
                breeds = Object.keys(data.message);
                loading.style.display = 'none';
            })
            .catch(error => {
                console.error('Error fetching dog breeds:', error);
                loading.style.display = 'none';
                emptyState.textContent = 'Failed to fetch breeds. Please try again later.';
                emptyState.style.display = 'block';
            });
    }

    // Function to display a breed's image and details
    function displayBreed(breed) {
        const animalCard = document.createElement('div');
        animalCard.className = 'animal-card';

        fetch(`https://dog.ceo/api/breed/${breed}/images/random`)
            .then(response => response.json())
            .then(data => {
                animalCard.innerHTML = `
                    <img src="${data.message}" alt="${breed}">
                    <div class="details">
                        <h3>${breed.charAt(0).toUpperCase() + breed.slice(1)}</h3>
                    </div>
                `;
                animalContainer.appendChild(animalCard);
            })
            .catch(error => {
                console.error('Error fetching breed image:', error);
            });
    }

    // Function to handle search
    function handleSearch() {
        const searchTerm = searchInput.value.toLowerCase();
        animalContainer.innerHTML = '';

        const filteredBreeds = breeds.filter(breed => breed.toLowerCase().includes(searchTerm));

        if (filteredBreeds.length === 0) {
            emptyState.style.display = 'block';
        } else {
            emptyState.style.display = 'none';
            filteredBreeds.forEach(breed => displayBreed(breed));
        }
    }

    // Attach event listener for search button
    searchBtn.addEventListener('click', handleSearch);

    // Initially fetch the breeds
    fetchBreeds();
});
