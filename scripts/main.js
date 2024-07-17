// Fetch routes data
fetch('http://localhost:3000/routes')
  .then(response => response.json())
  .then(routes => {
    // Fetch seat availability data
    fetch('http://localhost:3000/seatAvailability')
      .then(response => response.json())
      .then(seatAvailability => {
        // Create a map of seat availability for quick lookup
        const availabilityMap = {};
        seatAvailability.forEach(item => {
          availabilityMap[item.routeId] = item.seatsAvailable;
        });

        // Display route information with seat availability
        routes.forEach(route => {
          const routeId = route.id;
          const routeName = route.name;
          const stops = route.stops;
          const schedule = route.schedule;

          // Find seat availability for this route
          const seatsAvailable = availabilityMap[routeId] || 'Not Available';

          // Display route information with seat availability
          console.log(`Route: ${routeName}`);
          console.log(`Stops: ${stops.join(', ')}`);
          console.log(`Schedule: ${schedule}`);
          console.log(`Seats Available: ${seatsAvailable}`);
          console.log('--------------------------');
        });
      })
      .catch(error => console.error('Error fetching seat availability:', error));
  })
  .catch(error => console.error('Error fetching routes:', error));
