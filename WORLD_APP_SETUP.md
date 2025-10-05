# World App (Worldcoin) Setup Guide

This guide explains how to configure World App verification for the Simple Roulette application.

## Overview

The Simple Roulette app now integrates with World App using MiniKit for wallet authentication. Users must verify their World ID before they can spin the roulette.

## Features

✅ **Device-Level Verification**: No Orb verification required
✅ **Persistent Authentication**: Auth data stored in localStorage for 7 days
✅ **Secure Wallet Authentication**: Uses cryptographic signatures
✅ **Seamless Integration**: Verification happens before accessing the roulette

## Setup Instructions

### 1. Get Your World App ID

1. Visit the World App Developer Portal: https://developer.worldcoin.org/
2. Create a new MiniApp project
3. Copy your `APP_ID`

### 2. Configure Environment Variables

1. Open the `.env.local` file in the project root
2. Replace `your_world_app_id_here` with your actual APP_ID:

```bash
REACT_APP_WLD_APP_ID=app_staging_1234567890abcdef
```

### 3. Run the Application

```bash
npm start
```

The app will run on http://localhost:3000

### 4. Testing in World App

To test the full authentication flow:

1. Open World App on your mobile device
2. Navigate to your MiniApp using the URL or QR code
3. The app will prompt you to sign in with World ID
4. After authentication, you can use the roulette

### 5. Development Mode

If `REACT_APP_WLD_APP_ID` is not set:
- The app will log an error in the console
- The app will still load for development purposes
- Authentication will not work until you set the APP_ID

## Architecture

### Components

**Providers.tsx**
- Initializes MiniKit with your APP_ID
- Wraps the entire app
- Shows loading screen while MiniKit initializes

**VerifyGate.tsx**
- Handles authentication flow
- Checks for existing authentication in localStorage
- Displays sign-in UI if not authenticated
- Only renders children after successful authentication

**App.tsx**
- Main roulette application
- Shows "Verified" badge when authenticated
- Reads wallet address from localStorage

### Authentication Flow

1. **Page Load**: VerifyGate checks localStorage for saved authentication
2. **Not Authenticated**: Shows "Sign In with World ID" button
3. **User Clicks Sign In**: Calls `MiniKit.commandsAsync.walletAuth()`
4. **World App Response**: Returns wallet address, message, and signature
5. **Success**: Stores auth data in localStorage and allows access
6. **Error**: Displays error message and allows retry

### localStorage Structure

```json
{
  "wallet_auth": {
    "address": "0x...",
    "message": "Sign in to Simple Roulette",
    "signature": "0x...",
    "timestamp": 1234567890123
  }
}
```

## Security Features

- **Nonce Generation**: Random nonce prevents replay attacks
- **7-Day Expiration**: Authentication tokens expire after 7 days
- **Signature Verification**: Cryptographic signatures ensure authenticity
- **localStorage Persistence**: Reduces authentication friction

## Troubleshooting

### "REACT_APP_WLD_APP_ID is not set" Error
- Make sure `.env.local` exists in project root
- Verify the environment variable name is correct
- Restart the development server after changing .env.local

### "Open in World App" Message
- This message appears when not running inside World App
- For development, you need to test in the actual World App
- Use ngrok or similar tools to expose your local server

### Authentication Not Persisting
- Check browser console for localStorage errors
- Ensure cookies/localStorage are not disabled
- Try clearing localStorage and re-authenticating

### "No response from World App" Error
- Check that APP_ID is correct
- Verify you're running inside World App
- Check World App console for additional errors

## Package Dependencies

```json
{
  "@worldcoin/minikit-js": "^1.9.7"
}
```

## References

- [World App Developer Portal](https://developer.worldcoin.org/)
- [MiniKit Documentation](https://docs.worldcoin.org/minikit)
- [Reference Implementation](https://github.com/HirokiTajima/calculator-miniapp)

## Notes

- The implementation is based on the calculator-miniapp reference project
- Authentication is required before spinning the roulette
- The verification flow uses `commandsAsync.walletAuth()` for async/await pattern
- Responses are in `result.finalPayload`, not top-level result
