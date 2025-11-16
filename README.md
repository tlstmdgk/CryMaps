😢 CryMaps

CryMaps is a mobile application designed to normalize emotional release and help users find safe, supportive spaces to let their feelings out. We believe that crying is a healthy, natural response to life. CryMaps provides a compassionate community map where you can find quiet sanctuaries for emotional relief, track your own journey, and realize that you are never alone in your feelings.

<p align="center">
<!-- Replace with your actual logo/screenshot path or URL -->
<img src="./assets/images/icon.png" width="150" alt="CryMaps Logo" />
</p>

✨ Features

Find Sanctuary: View safe, quiet, or comforting spots near you where others have found space to release their emotions.

Share Safe Spaces: Gently drop a pin to mark a location where you felt safe to cry, helping others find their own refuge.

Community Validation: See that you aren't alone. Every marker represents a shared human experience and a moment of vulnerability.

Personal Reflection: Create a profile to track your own emotional journey over time.

Secure & Private: Secure email/password login powered by Supabase ensures your data is kept safe.

Calming Design: A soothing, "watery" UI theme designed to be gentle on the eyes and grounding during difficult moments.

🛠 Tech Stack

Frontend: React Native with Expo

Routing: Expo Router (File-based routing)

Backend & Database: Supabase (PostgreSQL)

Maps: react-native-maps

Styling: Native StyleSheet with a custom centralized theme

Fonts: expo-google-fonts (Zain)


📱 Project Structure

crymaps/
├── app/
│   ├── (tabs)/          # Main tab navigator screens
│   │   ├── _layout.tsx  # Tab bar configuration
│   │   ├── map.tsx      # The main map screen
│   │   ├── feed.tsx     # (Coming Soon) Activity feed
│   │   └── profile.tsx  # User profile screen
│   ├── _layout.tsx      # Root stack navigator & Auth protection
│   ├── index.tsx        # Redirects to /(tabs)/map
│   ├── login.tsx        # Login screen
│   └── signup.tsx       # Signup screen
├── lib/
│   ├── auth.ts          # Auth helper functions
│   ├── AuthContext.tsx  # React Context for auth state
│   ├── supabase.ts      # Supabase client configuration
│   └── theme.ts         # Centralized color palette
└── assets/              # Images and icons



🤝 Contributing

Contributions are welcome! Please fork the repository and submit a pull request. We prioritize creating a safe and inclusive environment for all contributors.

📄 License

This project is licensed under the MIT License.
