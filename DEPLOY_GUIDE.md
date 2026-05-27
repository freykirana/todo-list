# 🚀 Deploy Guide - Docker + Cloudflare Tunnel

## Prerequisites
- **Docker Desktop** (https://www.docker.com/products/docker-desktop)
- **Cloudflare Account** (gratis di https://dash.cloudflare.com)
- **Cloudflared CLI** (https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/downloads/)

---

## 📋 Local Deployment dengan Docker

### 1. **Setup Docker Compose**
```powershell
cd "d:\Kuliah\SEMESTER 6\Backend\tugas_besar"

# Build dan run semua services
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f
```

**Output:**
```
✓ PostgreSQL running on localhost:5432
✓ Backend running on localhost:4000
✓ Frontend running on localhost:5173
```

### 2. **Test Local Setup**
```powershell
# Test Backend
curl http://localhost:4000/

# Test Frontend  
start http://localhost:5173
```

---

## 🌐 Expose ke Internet dengan Cloudflare Tunnel

### 1. **Install Cloudflare Tunnel**
```powershell
# Download & Install cloudflared
# https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/downloads/

# Atau dengan Choco (jika ada):
choco install cloudflared

# Verify installation
cloudflared --version
```

### 2. **Login & Create Tunnel**
```powershell
# Login dengan Cloudflare Account
cloudflared tunnel login

# Create tunnel (ganti 'todo-app' dengan nama apa saja)
cloudflared tunnel create todo-app

# Akan menghasilkan credentials file di ~/.cloudflared/
```

### 3. **Setup Routing Configuration**

Edit file `.cloudflared/config.yml`:
```yaml
tunnel: todo-app
credentials-file: C:\Users\[YOUR_USERNAME]\.cloudflared\[UUID].json

ingress:
  - hostname: api.your-tunnel.cloudflareaccess.com
    service: http://localhost:4000
  
  - hostname: your-tunnel.cloudflareaccess.com
    service: http://localhost:5173
  
  - service: http://localhost:5173
```

**Ganti `[YOUR_USERNAME]` dan dapatkan UUID dari output command create tunnel.**

### 4. **Route Traffic di Cloudflare Dashboard**
```powershell
# Run tunnel
cloudflared tunnel route dns todo-app your-domain.com

# Atau lewat dashboard:
# https://dash.cloudflare.com → Zero Trust → Networks → Tunnels
# Klik tunnel yang baru dibuat → Configure → Public Hostnames
# Tambahkan route untuk API dan Frontend
```

### 5. **Start Tunnel**
```powershell
# Terminal 1: Docker
cd "d:\Kuliah\SEMESTER 6\Backend\tugas_besar"
docker-compose up -d

# Terminal 2: Cloudflare Tunnel
cloudflared tunnel run todo-app

# Output akan menunjukkan:
# 2024-05-27 Registered CNAME dns.example.com
# Tunnel running...
```

---

## 📱 Akses Application

**Local Development:**
- Frontend: http://localhost:5173
- Backend API: http://localhost:4000

**Public via Cloudflare:**
- Frontend: https://your-tunnel-xxxxx.cloudflareaccess.com
- Backend API: https://api.your-tunnel-xxxxx.cloudflareaccess.com

---

## ⚙️ Troubleshooting

### Docker Issues
```powershell
# Stop containers
docker-compose down

# Remove volumes (reset database)
docker-compose down -v

# Rebuild images
docker-compose up -d --build

# View logs
docker-compose logs backend
docker-compose logs frontend
```

### Cloudflare Tunnel Issues
```powershell
# Check tunnel status
cloudflared tunnel list

# Delete tunnel
cloudflared tunnel delete todo-app

# Test connectivity
curl -I https://your-tunnel-xxxxx.cloudflareaccess.com
```

---

## 🔐 Security Tips

1. **JWT Secret** - Change di docker-compose.yml
2. **Database Password** - Change password di docker-compose.yml
3. **Cloudflare Access** - Enable Cloudflare Access untuk restrict akses (https://developers.cloudflare.com/cloudflare-one/identity/users/)

---

## 📦 Deployment Checklist

- [ ] Docker Desktop installed & running
- [ ] docker-compose.yml dikonfigurasi
- [ ] Cloudflared CLI installed
- [ ] Cloudflare Account created
- [ ] Tunnel dibuat
- [ ] Config.yml dikonfigurasi
- [ ] Local testing OK (localhost)
- [ ] Cloudflare Tunnel running
- [ ] Public URL accessible

---

## 🎯 Next Steps

Setelah semua running:
1. **Enable Cloudflare Access** untuk autentikasi extra
2. **Setup SSL/HTTPS** (auto dengan Cloudflare)
3. **Monitor logs** untuk debugging
4. **Backup database** secara regular

**Notes:** Cloudflare Tunnel gratis untuk 1 tunnel + unlimited traffic. Jika ingin domain custom, bisa membeli di Cloudflare atau gunakan subdomain.
