# 🚀 LunchDrop Deployment Guide

## Overview

LunchDrop has two parts that need to be deployed separately:

1. **Frontend** (React app) → GitHub Pages ✅ Already deployed!
2. **Backend** (Express API) → Render (follow steps below)

---

## 📦 Backend Deployment to Render

### Step 1: Create a MongoDB Atlas Database

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up or log in
3. Create a new **FREE** cluster (M0)
4. Click **Connect** → **Connect your application**
5. Copy your connection string (it looks like):
   ```
   mongodb+srv://username:<password>@cluster0.xxxxx.mongodb.net/lunchdrop?retryWrites=true&w=majority
   ```
6. Replace `<password>` with your actual database password
7. Keep this connection string handy!

### Step 2: Push Backend to GitHub

Your backend needs to be in the same repository. It's already there, so let's commit the deployment files:

```bash
cd "c:\Users\smile\Desktop\New folder\lunchdrop"
git add backend/render.yaml backend/src/server.js
git commit -m "Configure backend for Render deployment"
git push origin master
```

### Step 3: Deploy to Render

1. Go to [Render](https://render.com/) and sign up/login with GitHub
2. Click **New +** → **Web Service**
3. Connect your GitHub repository: `LocQar/lunchdrop`
4. Configure the service:
   - **Name**: `lunchdrop-api`
   - **Region**: Oregon (or closest to you)
   - **Root Directory**: `backend`
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

5. Click **Advanced** → Add Environment Variables:

   | Key | Value |
   |-----|-------|
   | `NODE_ENV` | `production` |
   | `MONGODB_URI` | Your MongoDB Atlas connection string from Step 1 |
   | `JWT_SECRET` | (Click "Generate" for a secure random value) |
   | `JWT_EXPIRE` | `7d` |
   | `FRONTEND_URL` | `https://locqar.github.io/lunchdrop` |

   **Optional** (for email & payments):
   | Key | Value |
   |-----|-------|
   | `STRIPE_SECRET_KEY` | Your Stripe secret key |
   | `STRIPE_PUBLISHABLE_KEY` | Your Stripe publishable key |
   | `EMAIL_USER` | Your Gmail address |
   | `EMAIL_PASSWORD` | Your Gmail app password |

6. Click **Create Web Service**
7. Wait 2-3 minutes for deployment to complete ⏳

### Step 4: Get Your API URL

Once deployed, Render gives you a URL like:
```
https://lunchdrop-api.onrender.com
```

Copy this URL! You'll need it for the frontend.

---

## 🔗 Connect Frontend to Backend

Now update your frontend to use the deployed backend:

1. Create an environment config in your React app
2. Update API calls to use: `https://lunchdrop-api.onrender.com/api`

---

## ✅ Testing Your Deployment

### Test the backend:
1. Visit: `https://lunchdrop-api.onrender.com/api/health`
2. You should see:
   ```json
   {
     "success": true,
     "message": "LunchDrop API is running",
     "timestamp": "2026-03-15T..."
   }
   ```

### Test the frontend:
1. Visit: `https://locqar.github.io/lunchdrop/`
2. The app should load and be able to fetch data from the backend

---

## 🆓 Free Tier Limitations

**Render Free Tier:**
- ⚠️ Service spins down after 15 minutes of inactivity
- First request after spin-down takes ~30 seconds to wake up
- 750 hours/month free (more than enough)

**Solution:** Consider upgrading to paid plan ($7/month) for always-on service

---

## 🔄 Future Deployments

### Update Frontend:
```bash
npm run deploy
```

### Update Backend:
Just push to GitHub - Render auto-deploys:
```bash
git add .
git commit -m "Update backend"
git push origin master
```

---

## 📞 Troubleshooting

**Backend won't start?**
- Check Render logs in dashboard
- Verify MongoDB connection string is correct
- Ensure all required environment variables are set

**CORS errors?**
- Verify `FRONTEND_URL` in Render matches your GitHub Pages URL exactly
- Check browser console for specific error messages

**Database connection failed?**
- Whitelist all IPs in MongoDB Atlas: Network Access → Add IP Address → Allow Access from Anywhere (0.0.0.0/0)

---

## 🎉 You're All Set!

Your LunchDrop app is now fully deployed and accessible worldwide! 🌍
