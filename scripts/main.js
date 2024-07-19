document.addEventListener("DOMContentLoaded", () => {
  
  const routeInfoContainer = document.getElementById("route-info-container");
  const seatAvailabilityContainer = document.getElementById("seat-availability-container");
  const bookingAlertsContainer = document.getElementById("booking-alerts-container");
  const userFeedbackContainer = document.getElementById("user-feedback-container");
  const bookingForm = document.getElementById("booking-form");
  const routeSelect = document.getElementById("route");
  const bookingConfirmation = document.getElementById("booking-confirmation");
  const confirmationMessage = document.getElementById("confirmation-message");
  const closeButton = document.getElementById("close-confirmation-btn");

  const API_URL = "http://localhost:3000";

  // Feedback section elements
  const feedbackForm = document.getElementById("feedback-form");
  const feedbackIdInput = document.getElementById("feedback-id");
  const feedbackTextArea = document.getElementById("feedback-text");
  const feedbackItemsList = document.getElementById("feedback-items");

  const createFeedbackBtn = document.getElementById("create-feedback-btn");
  const editFeedbackBtn = document.getElementById("edit-feedback-btn");
  const submitFeedbackBtn = document.getElementById("submit-feedback-btn");
  const deleteFeedbackBtn = document.getElementById("delete-feedback-btn");

  let isEditing = false;
  let feedbackData = [];

  const fetchRoutes = () => {
      fetch(`${API_URL}/routes`)
          .then(response => response.json())
          .then(routes => {
              routeInfoContainer.innerHTML = "<h2>Route Information</h2>";
              routeSelect.innerHTML = "<option value=''>Select a route</option>";
              routes.forEach(route => {
                  const routeCard = document.createElement("div");
                  routeCard.className = "card";
                  routeCard.innerHTML = `
                      <h3>${route.name}</h3>
                      <p>Stops: ${route.stops.join(", ")}</p>
                      <p>Schedule: ${route.schedule}</p>
                  `;
                  routeInfoContainer.appendChild(routeCard);

                  const option = document.createElement("option");
                  option.value = route.id;
                  option.textContent = route.name;
                  routeSelect.appendChild(option);
              });
          })
          .catch(error => console.error("Error fetching routes:", error));
  };

  const fetchSeatAvailability = () => {
      fetch(`${API_URL}/seatAvailability`)
          .then(response => response.json())
          .then(seats => {
              seatAvailabilityContainer.innerHTML = "<h2>Seat Availability</h2>";
              seats.forEach(seat => {
                  const seatCard = document.createElement("div");
                  seatCard.className = "card";
                  seatCard.innerHTML = `
                      <p>Route ID: ${seat.routeId}</p>
                      <p>Seats Available: ${seat.seatsAvailable}</p>
                  `;
                  seatAvailabilityContainer.appendChild(seatCard);
              });
          })
          .catch(error => console.error("Error fetching seat availability:", error));
  };

  const fetchBookingAlerts = () => {
      fetch(`${API_URL}/bookingAlerts`)
          .then(response => response.json())
          .then(alerts => {
              bookingAlertsContainer.innerHTML = "<h2>Booking Alerts</h2>";
              alerts.forEach(alert => {
                  const alertCard = document.createElement("div");
                  alertCard.className = "card";
                  alertCard.innerHTML = `
                      <p>User ID: ${alert.userId}</p>
                      <p>Route ID: ${alert.routeId}</p>
                      <p>Alert: ${alert.alertMessage}</p>
                  `;
                  bookingAlertsContainer.appendChild(alertCard);
              });
          })
          .catch(error => console.error("Error fetching booking alerts:", error));
  };

  const fetchUserFeedback = () => {
      fetch(`${API_URL}/userFeedback`)
          .then(response => response.json())
          .then(feedbacks => {
              userFeedbackContainer.innerHTML = "<h2>User Feedback</h2>";
              feedbacks.forEach(feedback => {
                  const feedbackCard = document.createElement("div");
                  feedbackCard.className = "card";
                  feedbackCard.innerHTML = `
                      <p>User ID: ${feedback.userId}</p>
                      <p>Route ID: ${feedback.routeId}</p>
                      <p>Rating: ${feedback.rating}</p>
                      <p>Comment: ${feedback.comment}</p>
                  `;
                  userFeedbackContainer.appendChild(feedbackCard);
              });
          })
          .catch(error => console.error("Error fetching user feedback:", error));
  };

  bookingForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const routeId = routeSelect.value;
      const name = bookingForm.name.value;
      const email = bookingForm.email.value;

      if (!routeId || !name || !email) {
          alert("Please fill in all the fields");
          return;
      }

      fetch(`${API_URL}/seatAvailability?routeId=${routeId}`)
          .then(response => response.json())
          .then(seats => {
              if (seats.length === 0 || seats[0].seatsAvailable <= 0) {
                  alert("No seats available for the selected route");
                  return;
              }

              const seat = seats[0];
              seat.seatsAvailable -= 1;

              fetch(`${API_URL}/seatAvailability/${seat.id}`, {
                  method: "PUT",
                  headers: {
                      "Content-Type": "application/json"
                  },
                  body: JSON.stringify(seat)
              })
              .then(() => {
                  confirmationMessage.textContent = `Booking confirmed! ${name}, you have booked a seat on Route ${routeId}.`;
                  bookingForm.reset();
                  bookingConfirmation.classList.remove("hidden");
                  fetchSeatAvailability();
              })
              .catch(error => console.error("Error updating seat availability:", error));
          })
          .catch(error => console.error("Error fetching seat availability:", error));
  });

  const closeConfirmation = () => {
      bookingConfirmation.classList.add("hidden");
  };

  
  if (closeButton) {
      closeButton.addEventListener("click", closeConfirmation);
  }

  // Feedback functionalities
  const updateFeedbackList = () => {
      feedbackItemsList.innerHTML = '';
      feedbackData.forEach(feedback => {
          const listItem = document.createElement('li');
          listItem.textContent = feedback.text;
          listItem.dataset.id = feedback.id;
          listItem.addEventListener('click', () => {
              feedbackIdInput.value = feedback.id;
              feedbackTextArea.value = feedback.text;
              isEditing = true;
              toggleFeedbackButtons('edit');
          });
          feedbackItemsList.appendChild(listItem);
      });
  };

  const generateId = () => {
      return '_' + Math.random().toString(36).substr(2, 9);
  };

  const toggleFeedbackButtons = (action) => {
      switch (action) {
          case 'create':
              createFeedbackBtn.classList.add('hidden');
              editFeedbackBtn.classList.remove('hidden');
              submitFeedbackBtn.classList.remove('hidden');
              deleteFeedbackBtn.classList.add('hidden');
              break;
          case 'edit':
              createFeedbackBtn.classList.add('hidden');
              editFeedbackBtn.classList.add('hidden');
              submitFeedbackBtn.classList.remove('hidden');
              deleteFeedbackBtn.classList.remove('hidden');
              break;
          default:
              createFeedbackBtn.classList.remove('hidden');
              editFeedbackBtn.classList.add('hidden');
              submitFeedbackBtn.classList.add('hidden');
              deleteFeedbackBtn.classList.add('hidden');
              break;
      }
  };

  createFeedbackBtn.addEventListener('click', () => {
      feedbackIdInput.value = ''; // Clear feedback ID
      feedbackTextArea.value = ''; // Clear textarea
      toggleFeedbackButtons('create');
  });

  editFeedbackBtn.addEventListener('click', () => {
      if (feedbackIdInput.value) {
          isEditing = true;
          toggleFeedbackButtons('edit');
      }
  });

  submitFeedbackBtn.addEventListener('click', () => {
      const feedbackText = feedbackTextArea.value.trim();
      if (feedbackText === '') {
          alert('Feedback cannot be empty.');
          return;
      }

      if (isEditing) {
          // Update feedback
          const feedbackId = feedbackIdInput.value;
          const index = feedbackData.findIndex(item => item.id === feedbackId);
          if (index !== -1) {
              feedbackData[index].text = feedbackText;
              updateFeedbackList();
          }
      } else {
          // Create new feedback
          const newFeedback = {
              id: generateId(),
              text: feedbackText
          };
          feedbackData.push(newFeedback);
          updateFeedbackList();
      }

      // Clear form and reset state
      feedbackIdInput.value = '';
      feedbackTextArea.value = '';
      isEditing = false;
      toggleFeedbackButtons('default');
  });

  deleteFeedbackBtn.addEventListener('click', () => {
      const feedbackId = feedbackIdInput.value;
      if (feedbackId) {
          // Delete feedback
          feedbackData = feedbackData.filter(item => item.id !== feedbackId);
          updateFeedbackList();

          // Clear form and reset state
          feedbackIdInput.value = '';
          feedbackTextArea.value = '';
          isEditing = false;
          toggleFeedbackButtons('default');
      }
  });

  // Fetch data when page loads
  fetchRoutes();
  fetchSeatAvailability();
  fetchBookingAlerts();
  fetchUserFeedback();

  
  const navLinks = document.querySelectorAll('.nav-links a');
  const sections = document.querySelectorAll('main > div');

  navLinks.forEach(link => {
      link.addEventListener('click', (event) => {
          event.preventDefault();
          const sectionId = link.getAttribute('data-section');

          sections.forEach(section => {
              section.classList.add('hidden');
          });

          document.getElementById(sectionId).classList.remove('hidden');
      });
  });

  
  document.getElementById('home-section').classList.remove('hidden');
});


