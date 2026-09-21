export const signIn = async (username, password) => {
  try {
    const response = await fetch('http://localhost:8080/api/v1/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();
    console.log('Sign-in response:', data);
    return data; // Assuming the server returns user data or a token
  } catch (error) {
    console.error('Error during sign-in:', error);
    throw error;
  }
}

export const signUp = async (username, email, password) => {
  try {
    const response = await fetch('http://localhost:8080/api/v1/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, email, password }),
    });

    const data = await response.json();
    console.log('Sign-up response:', data);
    return data; // Assuming the server returns user data or a token
  } catch (error) {
    console.error('Error during sign-up:', error);
    throw error;
  }
}

export const validateToken = async (token) => {
  try {
    const response = await fetch('http://localhost:8080/api/v1/auth/token/validate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error during token validation:', error);
    throw error;
  }
}
