const http = require('http');
const axios = require('axios');
const PORT = 3000;

// In-memory cache to store fetched numbers
let cachedNumbers = [];

// Fetch numbers from the third-party test server
const fetchNumbersFromServer = async (windowSize) => {
  try {
    const response = await axios.get(`https://api.random.org/json-rpc/2/invoke`, {
      params: {
        apiKey: 'YOUR_API_KEY', // Replace with actual API Key
        n: windowSize,
        min: 1,
        max: 1000
      }
    });
    cachedNumbers = response.data.result.random.data; // Store fetched numbers
  } catch (error) {
    console.error('Error fetching numbers:', error);
  }
};

// Prime number check function
const isPrime = (num) => {
  if (num <= 1) return false;
  for (let i = 2; i <= Math.sqrt(num); i++) {
    if (num % i === 0) return false;
  }
  return true;
};

// Fibonacci function
const fibonacci = (n) => {
  const sequence = [0, 1];
  for (let i = 2; i < n; i++) {
    sequence.push(sequence[i - 1] + sequence[i - 2]);
  }
  return sequence;
};

// Even number filter function
const getEvenNumbers = (numbers) => {
  return numbers.filter(num => num % 2 === 0);
};

// Random number generator from the cached numbers
const getRandomNumber = () => {
  return cachedNumbers[Math.floor(Math.random() * cachedNumbers.length)];
};

// Request handler for the server
const requestHandler = async (req, res) => {
  const start = Date.now();
  const urlParts = req.url.split('?');
  const queryParams = new URLSearchParams(urlParts[1]);
  const windowSize = parseInt(queryParams.get('windowSize') || 10); // Default window size to 10

  res.setHeader('Content-Type', 'application/json');

  // If numbers are not cached, fetch them
  if (cachedNumbers.length === 0) {
    await fetchNumbersFromServer(windowSize);
  }

  // Process based on the query params (p for prime, f for Fibonacci, e for even, r for random)
  if (queryParams.has('p')) {
    // Prime numbers
    const primeNumbers = cachedNumbers.filter(isPrime);
    res.statusCode = 200;
    res.end(JSON.stringify({
      message: 'Prime numbers fetched',
      numbers: primeNumbers,
      responseTime: `${Date.now() - start}ms`
    }));
  } else if (queryParams.has('f')) {
    // Fibonacci numbers
    const fibNumbers = fibonacci(windowSize); // Generate Fibonacci sequence
    res.statusCode = 200;
    res.end(JSON.stringify({
      message: 'Fibonacci numbers fetched',
      numbers: fibNumbers,
      responseTime: `${Date.now() - start}ms`
    }));
  } else if (queryParams.has('e')) {
    // Even numbers
    const evenNumbers = getEvenNumbers(cachedNumbers);
    res.statusCode = 200;
    res.end(JSON.stringify({
      message: 'Even numbers fetched',
      numbers: evenNumbers,
      responseTime: `${Date.now() - start}ms`
    }));
  } else if (queryParams.has('r')) {
    // Random number
    const randomNum = getRandomNumber();
    res.statusCode = 200;
    res.end(JSON.stringify({
      message: 'Random number fetched',
      number: randomNum,
      responseTime: `${Date.now() - start}ms`
    }));
  } else {
    res.statusCode = 400;
    res.end(JSON.stringify({ error: 'Invalid query parameter' }));
  }
};

// Create the server
const server = http.createServer(requestHandler);

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
