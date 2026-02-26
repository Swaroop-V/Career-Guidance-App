# Test Cases

## Authentication Module

### Student Login Page
1. **Verify UI Elements**: Check for Email input, Password input, "Sign In" button, and "Create account" link.
2. **Valid Login**: Enter valid email and password. Click "Sign In". Expect redirection to Dashboard.
3. **Invalid Email Format**: Enter "invalid-email". Click "Sign In". Expect "Invalid email address" error message.
4. **Empty Fields**: Leave fields empty. Click "Sign In". Expect error messages for required fields.
5. **Wrong Password**: Enter valid email but wrong password. Expect "Failed to login" error message (simulated or real).
6. **Navigation**: Click "Create a new account". Expect redirection to Sign Up page.

### Student Sign Up Page
1. **Verify UI Elements**: Check for Name, Email, Password, Confirm Password inputs, and "Sign Up" button.
2. **Valid Sign Up**: Enter valid details. Click "Sign Up". Expect redirection to Dashboard (or Login).
3. **Password Mismatch**: Enter different passwords in Password and Confirm Password fields. Expect "Passwords don't match" error.
4. **Short Password**: Enter password less than 6 characters. Expect "Password must be at least 6 characters" error.
5. **Existing Email**: Enter an email that is already registered. Expect error message (if backend connected).

## General
1. **Responsiveness**: Verify pages look good on Mobile, Tablet, and Desktop.
2. **Logging**: Verify actions (Login attempt, Signup attempt, Errors) are logged to the console.
