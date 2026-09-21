import Cookies from 'js-cookie';

export const searchUsers = async (query) => {
  try {
    const response = await fetch(`http://localhost:8080/api/v1/user/search?query=${encodeURIComponent(query)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Cookies.get('userTk')}`, // Assuming the token is stored in cookies
      },
    });

    const data = await response.json();
    return data; // Assuming the server returns a list of users
  } catch (error) {
    console.error('Error during user search:', error);
    throw error;
  }
}

export const connectRequest = async (username) => {
  try {
    console.log(`Sending connect request to ${username}...`);
    const response = await fetch(`http://localhost:8080/api/v1/user/connections/request`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Cookies.get('userTk')}`, // Assuming the token is stored in cookies
      },
      body: JSON.stringify({username}),
    });

    const data = await response.json();
    return data; // Assuming the server returns a success message or status
  } catch (error) {
    console.error('Error during connect request:', error);
    throw error;
  }
}

export const getConnectRequests = async () => {
  try {
    const response = await fetch(`http://localhost:8080/api/v1/user/connections/pending_request`, {
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Cookies.get('userTk')}`, // Assuming the token is stored in cookies
      }
    })

    const data = await response.json();
    return data;
  } catch (error) {
    console.log("Error fetching the requests for the user");
    throw error;
  }
}

export const getSentConnectRequests = async () => {
  try {
    const response = await fetch(`http://localhost:8080/api/v1/user/contact/sent-requests`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Cookies.get('userTk')}`, // Assuming the token is stored in cookies
      },
    });

    const data = await response.json();
    return data; // Assuming the server returns a list of sent connect requests
  } catch (error) {
    console.error('Error fetching sent connect requests:', error);
    throw error;
  }
}

export const getChatListItems = async () => {
  try {
    const response = await fetch(`http://localhost:8080/api/v1/user/chat/list`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Cookies.get('userTk')}`, // Assuming the token is stored in cookies
      },
    });

    const data = await response.json();
    console.log(data)
    return data; // Assuming the server returns a list of contacts
  } catch (error) {
    console.error('Error fetching contacts:', error);
    throw error;
  }
}

export const getSearchUserType = async (username) => {
  try {
    const response = await fetch(`http://localhost:8080/api/v1/user/connections/check_connection/${username}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Cookies.get('userTk')}`, // Assuming the token is stored in cookies
      },
    })

    const data = await response.text();
    return data;
  } catch (error) {
    console.log("Error getting search user", error)
    throw error
  }
}

export const acceptUserRequest = async(username) => {
  try {
    const response = await fetch(`http://localhost:8080/api/v1/user/connections/request/accept?id=${encodeURIComponent(username)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Cookies.get('userTk')}`, // Assuming the token is stored in cookies
      },
    })

    const data = await response.json();
    // console.log(data)
    return data;
  } catch (error) {
    console.log("Error accepting the request", error)
    throw error
  }
}

export const updateUnreadMessagesCount = async (username) => {
  try {
    const response = await fetch(`http://localhost:8080/api/v1/user/contact/unread`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Cookies.get('userTk')}`, // Assuming the token is stored in cookies
      },
      body: JSON.stringify({ username }),
    });

    const data = await response.json();
    return data; // Assuming the server returns a success message or updated status
  } catch (error) {
    console.error('Error during updating unread messages count:', error);
    throw error;
  }
}

export const updateUnreadMessagesCountToZero = async (username) => {
  console.log("Updating unread messages count to zero for contact:", username);
  try {
    const response = await fetch(`http://localhost:8080/api/v1/user/contact/unread/zero`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Cookies.get('userTk')}`, // Assuming the token is stored in cookies
      },
      body: JSON.stringify({ username }),
    });

    const data = await response.json();
    return data; // Assuming the server returns a success message or updated status
  } catch (error) {
    console.error('Error during updating unread messages count to zero:', error);
    throw error;
  }
}