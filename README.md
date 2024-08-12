## Setup Development Environment

1. **Add these variables to your `.env` file:**

   ```dotenv
   PORT = 8000
   MONGO_URI = mongodb+srv://zezo:Z0123Z0123@cluster0.vhhi5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
   JWT_SECRET = ThisWebsiteIsMadeByZezO@Friday_9-8-2024
   JWT_EXPIRATION_TIME = 1d

2. **Run the following command twice, once from the backend directory and once from the frontend directory:**

   ```bash
   npm run dev
## Tech Stack

### Backend

```json
"dependencies": {
    "@nestjs/common": "^10.3.10",
    "@nestjs/config": "^3.2.3",
    "@nestjs/core": "^10.0.0",
    "@nestjs/jwt": "^10.2.0",
    "@nestjs/mapped-types": "^2.0.5",
    "@nestjs/mongoose": "^10.0.10",
    "@nestjs/platform-express": "^10.0.0",
    "@types/joi": "^17.2.3",
    "bcryptjs": "^2.4.3",
    "class-transformer": "^0.5.1",
    "class-validator": "^0.14.1",
    "joi": "^17.13.3",
    "jsonwebtoken": "^9.0.2",
    "mongoose": "^8.5.2",
    "reflect-metadata": "^0.2.0",
    "rxjs": "^7.8.1",
    "selenium-webdriver": "^4.23.0"
},
"devDependencies": {
    "@nestjs/cli": "^10.0.0",
    "@nestjs/schematics": "^10.0.0",
    "@nestjs/testing": "^10.0.0",
    "@types/express": "^4.17.17",
    "@types/jest": "^29.5.2",
    "@types/node": "^20.3.1",
    "@types/supertest": "^6.0.0",
    "@typescript-eslint/eslint-plugin": "^7.0.0",
    "@typescript-eslint/parser": "^7.0.0",
    "eslint": "^8.42.0",
    "eslint-config-prettier": "^9.0.0",
    "eslint-plugin-prettier": "^5.0.0",
    "jest": "^29.5.0",
    "prettier": "^3.0.0",
    "source-map-support": "^0.5.21",
    "supertest": "^7.0.0",
    "ts-jest": "^29.1.0",
    "ts-loader": "^9.4.3",
    "ts-node": "^10.9.1",
    "tsconfig-paths": "^4.2.0",
    "typescript": "^5.1.3"
}

###Frontend

```json
"dependencies": {
    "@radix-ui/react-slot": "^1.1.0",
    "@reduxjs/toolkit": "^2.2.7",
    "@types/js-cookie": "^3.0.6",
    "axios": "^1.7.3",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.1",
    "date-fns": "^3.6.0",
    "js-cookie": "^3.0.5",
    "lucide-react": "^0.427.0",
    "next": "14.2.5",
    "react": "^18",
    "react-dom": "^18",
    "react-hot-toast": "^2.4.1",
    "react-redux": "^9.1.2",
    "tailwind-merge": "^2.4.0",
    "tailwindcss-animate": "^1.0.7",
    "zod": "^3.23.8"
  },
  "devDependencies": {
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "eslint": "^8",
    "eslint-config-next": "14.2.5",
    "postcss": "^8",
    "tailwindcss": "^3.4.1",
    "typescript": "^5"
  }