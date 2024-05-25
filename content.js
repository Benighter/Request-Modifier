(function() {
    // Save the original fetch function to call it later
    const originalFetch = window.fetch;
  
    // Override the fetch function
    window.fetch = async function(resource, init) {
      // Check if the request has method and body
      if (init && init.method && init.method.toUpperCase() === "POST" && init.body) {
        try {
          // Specify URL patterns where modifications should be applied
          const urlPatterns = ["example.com", "another-example.com"];
          
          // Check if the request URL matches the specified patterns
          if (urlPatterns.some(pattern => resource.includes(pattern))) {
            // Parse the request body as JSON
            let body = JSON.parse(init.body);
  
            // Modify or delete parameters here
            // Example: Deleting the 'phone' field in the JSON request body
            if (body.user && body.user.phone) {
              console.log('Deleting phone field');
              delete body.user.phone;  // This line deletes the 'phone' field
            }
  
            // If you want to modify a parameter, do it here
            // Example: Changing the value of the 'name' field
            if (body.user && body.user.name) {
              body.user.name = "new name";  // This line modifies the 'name' field
            }
  
            // Stringify the modified body back to JSON
            init.body = JSON.stringify(body);
          }
        } catch (e) {
          console.error('Error modifying request body:', e);
        }
      }
  
      // Call the original fetch function with modified or original parameters
      return originalFetch(resource, init);
    };
  })();
  