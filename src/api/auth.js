const apiHome = process.env.REACT_APP_API_URL;

export const signIn = async (username, password) => {
    try {
        const response = await fetch(`${apiHome}/api/v1/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password }),
        });

        const data = await response.json();
        if (data.status === 404) {
            throw new Error("Invalid Credentials");
        }
        console.log("Sign-in response:", data);
        return data; // Assuming the server returns user data or a token
    } catch (error) {
        console.error("Error during sign-in:", error);
        throw error;
    }
};

export const signUp = async (form) => {
    try {
        const jsonBlob = new Blob([JSON.stringify({
            username: form.username,
            name: form.name,
            password: form.password,
            email: form.email,
        })], {
            type: "application/json",
        });

        const formData = new FormData();
        formData.append("image", form.image);
        formData.append("user", jsonBlob)
        const response = await fetch(`${apiHome}/api/v1/auth/register`, {
            method: "POST",
            body: formData,
        });

        if(response.status === 200) {
            const data = await response.text();
            console.log("Sign-up response:", data);
            return data; // Assuming the server returns user data or a token
        } else {
            throw new Error("Internal Service error..")
        }
    } catch (error) {
        console.error("Error during sign-up:", error);
        throw error;
    }
};

export const validateToken = async (token) => {
    try {
        const response = await fetch(`${apiHome}/api/v1/auth/token/validate`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error during token validation:", error);
        throw error;
    }
};

export const checkUsernameAvailability = async (username) => {
    try {
        const response = await fetch(`${apiHome}/api/v1/auth/username/${username}/available`, {
            method: 'GET',
        })
        if(response.status === 200 ) {
            const data = await response.text();
            return data === 'true' ? true : false;
        }
    } catch (error) {
        console.error("Error checking username availability")
    }
}