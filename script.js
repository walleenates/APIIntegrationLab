// Select the button and container elements
const searchInput = document.getElementById('searchInput');
const animalContainer = document.getElementById('animalContainer');
const loading = document.getElementById('loading');
const emptyState = document.getElementById('emptyState');
const breedInfo = document.getElementById('breedInfo');

// Debounce function to limit the rate of API calls
function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

// Function to fetch and display all breeds
function fetchBreeds() {
    loading.style.display = 'block';
    animalContainer.innerHTML = '';

    fetch('https://dog.ceo/api/breeds/list/all')
        .then(response => response.json())
        .then(data => {
            const breedsObj = data.message;
            const breedNames = Object.keys(breedsObj);
            displayBreeds(breedNames);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            animalContainer.innerHTML = '<p style="color:red;">Failed to fetch data. Please try again later.</p>';
        })
        .finally(() => {
            loading.style.display = 'none';
        });
}

// Function to display breeds
function displayBreeds(breeds) {
    if (breeds.length === 0) {
        emptyState.style.display = 'block';
    } else {
        emptyState.style.display = 'none';
    }

    animalContainer.innerHTML = ''; // Clear existing breeds

    breeds.forEach(breed => {
        fetch(`https://dog.ceo/api/breed/${breed}/images/random`)
            .then(response => response.json())
            .then(data => {
                const breedCard = document.createElement('div');
                breedCard.className = 'animal-card';
                
                breedCard.innerHTML = `
                    <img src="${data.message}" alt="${breed}">
                    <div class="details">
                        <h3>${breed.charAt(0).toUpperCase() + breed.slice(1)}</h3>
                    </div>
                `;
                
                breedCard.addEventListener('click', () => showBreedInfo(breed));
                animalContainer.appendChild(breedCard);
            })
            .catch(error => {
                console.error('Error fetching breed image:', error);
            });
    });
}

// Function to show detailed breed information
function showBreedInfo(breed) {
    loading.style.display = 'block';
    breedInfo.innerHTML = '';

    // Replace with an actual API endpoint that provides breed information
    fetch(`https://api.example.com/breed/${breed}`) // Example URL
        .then(response => response.json())
        .then(data => {
            const breedDetails = data || {}; // Adjust according to the actual API response structure
            breedInfo.innerHTML = `
                <h2>${breed.charAt(0).toUpperCase() + breed.slice(1)}</h2>
                <p><strong>Scientific Name:</strong> ${breedDetails.scientific_name || 'N/A'}</p>
                <p><strong>Life Span:</strong> ${breedDetails.life_span || 'N/A'}</p>
                <p><strong>Average Weight:</strong> ${breedDetails.average_weight || 'N/A'}</p>
                <p><strong>Average Height:</strong> ${breedDetails.average_height || 'N/A'}</p>
                <p><strong>Description:</strong> ${breedDetails.description || 'N/A'}</p>
            `;
            breedInfo.style.display = 'block';
        })
        .catch(error => {
            console.error('Error fetching breed information:', error);
            breedInfo.innerHTML = '<p style="color:red;">Failed to fetch breed information. Please try again later.</p>';
        })
        .finally(() => {
            loading.style.display = 'none';
        });
}

// Function to handle the search
function handleSearch() {
    const searchTerm = searchInput.value.toLowerCase();

    fetch('https://dog.ceo/api/breeds/list/all')
        .then(response => response.json())
        .then(data => {
            const breedsObj = data.message;
            const filteredBreeds = Object.keys(breedsObj).filter(breed =>
                breed.toLowerCase().includes(searchTerm)
            );
            displayBreeds(filteredBreeds);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}

// Attach event listener with debounce
searchInput.addEventListener('input', debounce(handleSearch, 300));

// Optionally fetch all breeds initially
fetchBreeds();
