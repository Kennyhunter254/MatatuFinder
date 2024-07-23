document.addEventListener('DOMContentLoaded', () => {
  const API_URL = "http://localhost:3000";

  // Fetch and display routes
  const fetchAndDisplayRoutes = () => {
    fetch(`${API_URL}/routes`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(routes => {
        displayRoutes(routes);
        populateRouteDropdown(routes); 
      })
      .catch(error => {
        console.error('Error fetching routes:', error);
      });
  };

  // Display routes
  const displayRoutes = (routes) => {
    const routeInfoContainer = document.getElementById('route-info-container');
    routeInfoContainer.innerHTML = '';

    if (routes.length === 0) {
      routeInfoContainer.innerHTML = '<p>No routes available</p>';
      return;
    }

    routes.forEach(route => {
      const routeElement = document.createElement('div');
      routeElement.classList.add('route');
      routeElement.innerHTML = `
        <p>Route ID: ${route.id || 'N/A'}</p>
        <p>Name: ${route.name || 'N/A'}</p>
        <p>Stops: ${route.stops.join(', ') || 'N/A'}</p>
        <p>Schedule: ${route.schedule || 'N/A'}</p>
        <button onclick="editRoute(${route.id})">Edit</button>
        <button onclick="updateRoute(${route.id})">Update</button>
        <button onclick="deleteRoute(${route.id})">Delete</button>
      `;
      routeInfoContainer.appendChild(routeElement);
    });
  };

  // Populate route dropdown
  const populateRouteDropdown = (routes) => {
    const routeSelect = document.getElementById('route');
    routeSelect.innerHTML = '<option value="">Select Route</option>'; 
    routes.forEach(route => {
      const option = document.createElement('option');
      option.value = route.id;
      option.textContent = route.name;
      routeSelect.appendChild(option);
    });
  };

  // Handle route creation
  const createRoute = (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const newRoute = {
      name: formData.get('route-name'),
      stops: formData.get('route-stops').split(',').map(stop => stop.trim()), 
      schedule: formData.get('route-schedule')
    };

    fetch(`${API_URL}/routes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newRoute)
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(() => {
      fetchAndDisplayRoutes(); 
      document.getElementById('create-route-form').reset();
    })
    .catch(error => {
      console.error('Error creating route:', error);
    });
  };

  // Edit route
  window.editRoute = (id) => {
    fetch(`${API_URL}/routes/${id}`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(route => {
        document.getElementById('route-name').value = route.name;
        document.getElementById('route-stops').value = route.stops.join(', ');
        document.getElementById('route-schedule').value = route.schedule;
        document.getElementById('create-route-form').setAttribute('data-edit-id', id);
      })
      .catch(error => {
        console.error('Error fetching route for editing:', error);
      });
  };

  // Update route
  window.updateRoute = (id) => {
    const formData = new FormData(document.getElementById('create-route-form'));
    const updatedRoute = {
      name: formData.get('route-name'),
      stops: formData.get('route-stops').split(',').map(stop => stop.trim()), 
      schedule: formData.get('route-schedule')
    };

    fetch(`${API_URL}/routes/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatedRoute)
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(() => {
      fetchAndDisplayRoutes(); 
      document.getElementById('create-route-form').reset();
      document.getElementById('create-route-form').removeAttribute('data-edit-id');
    })
    .catch(error => {
      console.error('Error updating route:', error);
    });
  };

  // Delete route
  window.deleteRoute = (id) => {
    fetch(`${API_URL}/routes/${id}`, {
      method: 'DELETE'
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(() => {
      fetchAndDisplayRoutes(); 
    })
    .catch(error => {
      console.error('Error deleting route:', error);
    });
  };

  // Attach event listener to the create route form
  document.getElementById('create-route-form').addEventListener('submit', (event) => {
    const editId = document.getElementById('create-route-form').getAttribute('data-edit-id');
    if (editId) {
      updateRoute(editId); 
    } else {
      createRoute(event);
    }
  });

  // Initial fetch
  fetchAndDisplayRoutes();

  // Handle booking form submission
  const handleBookingFormSubmit = (event) => {
    event.preventDefault(); 

    const formData = new FormData(event.target);
    const booking = {
      routeId: parseInt(formData.get('route')),
      name: formData.get('name'),
      email: formData.get('email')
    };

    fetch(`${API_URL}/bookingAlerts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(booking)
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      console.log('Booking successful:', data);
      
    })
    .catch(error => {
      console.error('Error booking:', error);
    });
  };

  // Attach event listener to the booking form
  document.getElementById('booking-form').addEventListener('submit', handleBookingFormSubmit);
});

document.addEventListener('DOMContentLoaded', () => {
  const API_URL = "http://localhost:3000";
  
  // Fetch and display feedback
  const fetchAndDisplayFeedback = () => {
    fetch(`${API_URL}/userFeedback`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(feedbackList => {
        const feedbackItems = document.getElementById('feedback-items');
        feedbackItems.innerHTML = '';

        if (feedbackList.length === 0) {
          feedbackItems.innerHTML = '<li>No feedback available</li>';
          return;
        }

        feedbackList.forEach(feedback => {
          const feedbackItem = document.createElement('li');
          feedbackItem.innerHTML = `
            <p>ID: ${feedback.id}</p>
            <p>Feedback: ${feedback.comment}</p>
            <button onclick="editFeedback(${feedback.id})">Edit</button>
            <button onclick="deleteFeedback(${feedback.id})">Delete</button>
          `;
          feedbackItems.appendChild(feedbackItem);
        });
      })
      .catch(error => {
        console.error('Error fetching feedback:', error);
      });
  };

  // Handle feedback creation
  const createFeedback = () => {
    const feedbackText = document.getElementById('feedback-text').value;

    const feedback = {
      comment: feedbackText
    };

    fetch(`${API_URL}/userFeedback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(feedback)
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(() => {
      fetchAndDisplayFeedback(); 
      document.getElementById('feedback-form').reset();
      document.getElementById('create-feedback-btn').classList.remove('hidden');
      document.getElementById('edit-feedback-btn').classList.add('hidden');
      document.getElementById('delete-feedback-btn').classList.add('hidden');
    })
    .catch(error => {
      console.error('Error creating feedback:', error);
    });
  };

  
  window.editFeedback = (id) => {
    fetch(`${API_URL}/userFeedback/${id}`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(feedback => {
        document.getElementById('feedback-text').value = feedback.comment;
        document.getElementById('feedback-id').value = feedback.id;
        document.getElementById('create-feedback-btn').classList.add('hidden');
        document.getElementById('edit-feedback-btn').classList.remove('hidden');
        document.getElementById('delete-feedback-btn').classList.remove('hidden');
      })
      .catch(error => {
        console.error('Error fetching feedback for editing:', error);
      });
  };

  
  const updateFeedback = (id) => {
    const feedbackText = document.getElementById('feedback-text').value;

    const feedback = {
      comment: feedbackText
    };

    fetch(`${API_URL}/userFeedback/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(feedback)
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(() => {
      fetchAndDisplayFeedback(); 
      document.getElementById('feedback-form').reset();
      document.getElementById('create-feedback-btn').classList.remove('hidden');
      document.getElementById('edit-feedback-btn').classList.add('hidden');
      document.getElementById('delete-feedback-btn').classList.add('hidden');
    })
    .catch(error => {
      console.error('Error updating feedback:', error);
    });
  };

  
  window.deleteFeedback = (id) => {
    fetch(`${API_URL}/userFeedback/${id}`, {
      method: 'DELETE'
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(() => {
      fetchAndDisplayFeedback(); 
    })
    .catch(error => {
      console.error('Error deleting feedback:', error);
    });
  };

  // Attach event listeners to buttons
  document.getElementById('create-feedback-btn').addEventListener('click', createFeedback);
  document.getElementById('edit-feedback-btn').addEventListener('click', () => {
    const feedbackId = document.getElementById('feedback-id').value;
    updateFeedback(feedbackId);
  });
  document.getElementById('delete-feedback-btn').addEventListener('click', () => {
    const feedbackId = document.getElementById('feedback-id').value;
    deleteFeedback(feedbackId);
  });

  // Initial fetch
  fetchAndDisplayFeedback();
});

document.addEventListener('DOMContentLoaded', () => {
  const API_URL = "http://localhost:3000";
  
  // Fetch and display routes
  const fetchAndDisplayRoutes = () => {
    fetch(`${API_URL}/routes`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(routes => {
        displayRoutes(routes);
        populateRouteDropdown(routes);
      })
      .catch(error => {
        console.error('Error fetching routes:', error);
      });
  };

  // Display routes
  const displayRoutes = (routes) => {
    const routeInfoContainer = document.getElementById('route-info-container');
    routeInfoContainer.innerHTML = '';

    if (routes.length === 0) {
      routeInfoContainer.innerHTML = '<p>No routes available</p>';
      return;
    }

    routes.forEach(route => {
      const routeElement = document.createElement('div');
      routeElement.classList.add('route');
      routeElement.innerHTML = `
        <p>Route ID: ${route.id || 'N/A'}</p>
        <p>Name: ${route.name || 'N/A'}</p>
        <p>Stops: ${route.stops.join(', ') || 'N/A'}</p>
        <p>Schedule: ${route.schedule || 'N/A'}</p>
        <button onclick="editRoute(${route.id})">Edit</button>
        <button onclick="updateRoute(${route.id})">Update</button>
        <button onclick="deleteRoute(${route.id})">Delete</button>
      `;
      routeInfoContainer.appendChild(routeElement);
    });
  };

  // Handle route creation
  const createRoute = (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const newRoute = {
      name: formData.get('route-name'),
      stops: formData.get('route-stops').split(',').map(stop => stop.trim()),
      schedule: formData.get('route-schedule')
    };

    fetch(`${API_URL}/routes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newRoute)
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(() => {
      fetchAndDisplayRoutes();
      document.getElementById('create-route-form').reset();
    })
    .catch(error => {
      console.error('Error creating route:', error);
    });
  };

  // Edit route
  window.editRoute = (id) => {
    fetch(`${API_URL}/routes/${id}`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(route => {
        document.getElementById('route-name').value = route.name;
        document.getElementById('route-stops').value = route.stops.join(', ');
        document.getElementById('route-schedule').value = route.schedule;
        document.getElementById('create-route-form').setAttribute('data-edit-id', id);
      })
      .catch(error => {
        console.error('Error fetching route for editing:', error);
      });
  };

  
  window.updateRoute = (id) => {
    const formData = new FormData(document.getElementById('create-route-form'));
    const updatedRoute = {
      name: formData.get('route-name'),
      stops: formData.get('route-stops').split(',').map(stop => stop.trim()),
      schedule: formData.get('route-schedule')
    };

    fetch(`${API_URL}/routes/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatedRoute)
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(() => {
      fetchAndDisplayRoutes();
      document.getElementById('create-route-form').reset();
      document.getElementById('create-route-form').removeAttribute('data-edit-id');
    })
    .catch(error => {
      console.error('Error updating route:', error);
    });
  };

  // Delete route
  window.deleteRoute = (id) => {
    fetch(`${API_URL}/routes/${id}`, {
      method: 'DELETE'
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(() => {
      fetchAndDisplayRoutes();
    })
    .catch(error => {
      console.error('Error deleting route:', error);
    });
  };

  
  const handleBookingFormSubmit = (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const booking = {
      routeId: parseInt(formData.get('route')),
      name: formData.get('name'),
      email: formData.get('email')
    };

    fetch(`${API_URL}/bookingAlerts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(booking)
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      console.log('Booking successful:', data);
      document.getElementById('booking-form').reset();
      document.getElementById('booking-confirmation').textContent = 'Your booking was successful!';
      setTimeout(() => {
        document.getElementById('booking-confirmation').textContent = ''; 
      }, 5000);
    })
    .catch(error => {
      console.error('Error booking:', error);
      document.getElementById('booking-confirmation').textContent = 'There was an error with your booking.';
      setTimeout(() => {
        document.getElementById('booking-confirmation').textContent = ''; 
      }, 5000);
    });
  };


  document.getElementById('create-route-form').addEventListener('submit', (event) => {
    const editId = document.getElementById('create-route-form').getAttribute('data-edit-id');
    if (editId) {
      updateRoute(editId);
    } else {
      createRoute(event);
    }
  });

  document.getElementById('booking-form').addEventListener('submit', handleBookingFormSubmit);

  // Initial fetch
  fetchAndDisplayRoutes();
});

