
function createEssayHTML(index, title, content) {
    const essayContainer = document.createElement('div');
    essayContainer.classList.add('published-essay');
    essayContainer.setAttribute('data-index', index);

    const titleContainer = document.createElement('div');
    titleContainer.classList.add('essay-title');
    const titleHeading = document.createElement('h3');
    titleHeading.textContent = title;
    titleContainer.appendChild(titleHeading);

    const contentContainer = document.createElement('div');
    contentContainer.classList.add('essay-content');
    const contentParagraph = document.createElement('p');
    contentParagraph.textContent = content;
    contentContainer.appendChild(contentParagraph);

    const editButton = document.createElement('button');
    editButton.textContent = 'Edit';
    editButton.addEventListener('click', function () {
        editContent(this);
    });

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', function () {
        deleteContent(index);
    });

    essayContainer.appendChild(titleContainer);
    essayContainer.appendChild(contentContainer);
    essayContainer.appendChild(editButton);
    essayContainer.appendChild(deleteButton);

    return essayContainer;
}

// Modify the publishContent function to use both title and content
// Modify the publishContent function to use both title and content
async function publishContent() {
    var title = document.getElementById("blogTitle").value.trim();
    var content = document.getElementById("blogContent").value.trim();

    if (!title || title === "") {
        alert("Please enter a title for the essay.");
        return;
    }

    if (content === "") {
        alert("Please enter some content before publishing.");
        return;
    }

    const response = await fetch('/publish', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, content }),
    });

    if (response.ok) {
        document.getElementById("blogTitle").value = ''; // Clear the title input
        document.getElementById("blogContent").value = ''; // Clear the content textarea
        fetchContent(); // Fetch and display the updated content from the server
    } else {
        console.error('Failed to publish content');
    }
}






async function updateContent(index, content) {
    // Send the update request to the server
    const response = await fetch(`/update/${index}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',  // Change the content type to JSON
        },
        body: JSON.stringify({ content }),  // Stringify the content as JSON
    });

    if (response.ok) {
        // Clear the textarea
        document.getElementById("blogContent").value = '';

        // Remove the data-index attribute after successful update
        document.getElementById("blogContent").removeAttribute("data-index");

        // Fetch and display the updated content from the server
        fetchContent();
    } else {
        console.error(`Failed to update content at index ${index}`);
    }
}


async function deleteContent(index) {
    const response = await fetch(`/delete/${index}`, {
        method: 'DELETE',
    });

    if (response.ok) {
        fetchContent(); // Fetch and display the updated content from the server
    } else {
        console.error('Failed to delete content');
    }
}



function editContent(button) {
    const essayContainer = button.closest('.published-essay');
    const titleElement = essayContainer.querySelector('.essay-title h3');
    const contentElement = essayContainer.querySelector('.essay-content p');

    // Check if the title and content elements are not null before accessing innerText
    const title = titleElement ? titleElement.innerText : '';
    const content = contentElement ? contentElement.innerText : '';

    document.getElementById('blogContent').value = content;

    // Optionally, you can update the title too
    // document.getElementById('blogTitle').value = title;
}

// Update the fetchContent function to include the index in the HTML
// Modify the fetchContent function to log the received data
async function fetchContent() {
    try {
        const response = await fetch('/get_content');
        const data = await response.json();
        console.log('Received data:', data); // Log the received data for debugging

        const publishedContentContainer = document.getElementById('publishedContent');
        publishedContentContainer.innerHTML = ''; // Clear the existing content

        if (Array.isArray(data)) {
            // If data is an array, iterate over it
            data.forEach((item, index) => {
                const essayHTML = createEssayHTML(index, item.title, item.content);
                publishedContentContainer.appendChild(essayHTML);
            });
        } else {
            // If data is not an array, assume it's a single item
            const essayHTML = createEssayHTML(0, data.title, data.content);
            publishedContentContainer.appendChild(essayHTML);
        }
    } catch (error) {
        console.error('Error fetching content:', error);
    }
}


// Fetch and display content on page load
window.addEventListener('DOMContentLoaded', fetchContent);

