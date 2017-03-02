var paypalButton = document.querySelector('.paypal-button');

// Create a client.
braintree.client.create({
  authorization: 'sandbox_9dbg82cq_dcpspy2brwdjr3qn' // stolen from braintree-ios
}, function (clientErr, clientInstance) {

  // Stop if there was a problem creating the client.
  // This could happen if there is a network error or if the authorization
  // is invalid.
  if (clientErr) {
    console.error('Error creating client:', clientErr);
    return;
  }

  // Create a PayPal component.
  braintree.paypal.create({
    client: clientInstance
  }, function (paypalErr, paypalInstance) {

    // Stop if there was a problem creating PayPal.
    // This could happen if there was a network error or if it's incorrectly
    // configured.
    if (paypalErr) {
      console.error('Error creating PayPal:', paypalErr);
      return;
    }

    // Enable the button.
    paypalButton.removeAttribute('disabled');

    // When the button is clicked, attempt to tokenize.
    paypalButton.addEventListener('click', function (event) {

      // Because tokenization opens a popup, this has to be called as a result of
      // customer action, like clicking a button—you cannot call this at any time.
      paypalInstance.tokenize({
        flow: 'vault'
      }, function (tokenizeErr, payload) {

        // Stop if there was an error.
        if (tokenizeErr) {
          if (tokenizeErr.type !== 'CUSTOMER') {
            console.error('Error tokenizing:', tokenizeErr);
          }
          return;
        }

        // Tokenization succeeded!
        paypalButton.setAttribute('disabled', true);
        console.log('Got a nonce! Submitting to server...');
        console.log(payload.nonce);

        var url = 'txn';

        var xhr = new XMLHttpRequest();
        xhr.open('POST', url);
        xhr.onreadystatechange = function() {
          if (xhr.readyState > 3 && xhr.status == 200) {
            // success
            console.log(xhr.responseText);
            document.getElementById('transaction-result').innerHTML = xhr.responseText;
            paypalButton.style.display = 'none';
          }
        };

        xhr.setRequestHeader('Content-Type', 'application/json');

        var params = JSON.stringify(payload);
        console.log(params);
        xhr.send(params);

      });

    }, false);

  });

});
