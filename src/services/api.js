const API_URL = 'http://localhost:3000/api/v1'; 
 
export const login = async (email, password) => { 
  const response = await fetch(`${API_URL}/login`, { 
    method: 'POST', 
    headers: { 
      'Content-Type': 'application/json', 
}, 
body: JSON.stringify({ email, password }), 
}); 
return response.json(); 
}; 
export const signup = async (fullName, email, password) => { 
const response = await fetch(`${API_URL}/register`, { 
method: 'POST', 
headers: { 
'Content-Type': 'application/json', 
}, 
body: JSON.stringify({ fullName, email, password }), 
}); 
return response.json(); 
};