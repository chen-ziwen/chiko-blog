---
title: Web应用身份认证
date: 2023-01-15
isTimeLine: true
tags:
  - 计算机网络
  - 身份认证
  - 安全
description: Web应用中常见的身份认证方案、实现方式及安全最佳实践
---

# Web应用身份认证

## 认证方案

### Session-Cookie认证

```javascript
// 服务器端设置Session
app.use(
  session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: true,
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000 // 24小时
    }
  })
)

// 登录处理
app.post('/login', (req, res) => {
  const { username, password } = req.body
  // 验证用户
  if (validUser) {
    req.session.userId = user.id
    res.json({ success: true })
  }
})
```

### JWT认证

```javascript
// JWT配置
const jwt = require('jsonwebtoken')
const SECRET_KEY = 'your-secret-key'

// 生成Token
function generateToken(user) {
  return jwt.sign({ id: user.id, role: user.role }, SECRET_KEY, { expiresIn: '24h' })
}

// 验证Token中间件
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) {
    return res.status(401).json({ message: '未提供token' })
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY)
    req.user = decoded
    next()
  } catch (err) {
    res.status(401).json({ message: 'token无效' })
  }
}
```

### OAuth 2.0认证

```javascript
// 使用Passport实现GitHub OAuth认证
const passport = require('passport')
const GitHubStrategy = require('passport-github2').Strategy

passport.use(
  new GitHubStrategy(
    {
      clientID: 'your-client-id',
      clientSecret: 'your-client-secret',
      callbackURL: 'http://localhost:3000/auth/github/callback'
    },
    function (accessToken, refreshToken, profile, done) {
      // 保存用户信息
      User.findOrCreate({ githubId: profile.id }, function (err, user) {
        return done(err, user)
      })
    }
  )
)
```

## 安全最佳实践

### 密码安全

```javascript
// 使用bcrypt加密密码
const bcrypt = require('bcrypt')
const saltRounds = 10

// 加密密码
async function hashPassword(password) {
  const salt = await bcrypt.genSalt(saltRounds)
  return bcrypt.hash(password, salt)
}

// 验证密码
async function verifyPassword(password, hash) {
  return bcrypt.compare(password, hash)
}
```

### 防止XSS攻击

```javascript
// 使用helmet设置安全响应头
const helmet = require('helmet')
app.use(helmet())

// 输入验证
const { body, validationResult } = require('express-validator')

app.post('/api/user', body('username').trim().escape(), body('email').isEmail().normalizeEmail(), (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }
  // 处理请求
})
```

### 防止CSRF攻击

```javascript
// 使用CSRF令牌
const csrf = require('csurf')
app.use(csrf({ cookie: true }))

// 在表单中添加CSRF令牌
app.get('/form', (req, res) => {
  res.render('form', { csrfToken: req.csrfToken() })
})
```

## 权限管理

### 基于角色的访问控制（RBAC）

```javascript
// 角色中间件
const checkRole = (role) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: '未认证' })
    }
    if (req.user.role !== role) {
      return res.status(403).json({ message: '无权限' })
    }
    next()
  }
}

// 使用角色中间件
app.get('/admin', checkRole('admin'), (req, res) => {
  res.json({ message: '管理员页面' })
})
```

### 权限粒度控制

```javascript
// 资源权限检查
const checkPermission = (resource, action) => {
  return async (req, res, next) => {
    try {
      const hasPermission = await Permission.check({
        userId: req.user.id,
        resource,
        action
      })
      if (!hasPermission) {
        return res.status(403).json({ message: '无权限' })
      }
      next()
    } catch (err) {
      next(err)
    }
  }
}
```

## 性能优化

### 缓存策略

```javascript
// Redis缓存用户信息
const Redis = require('ioredis')
const redis = new Redis()

// 缓存用户信息
async function cacheUserInfo(userId, userInfo) {
  await redis.set(`user:${userId}`, JSON.stringify(userInfo), 'EX', 3600)
}

// 获取缓存的用户信息
async function getCachedUserInfo(userId) {
  const cached = await redis.get(`user:${userId}`)
  return cached ? JSON.parse(cached) : null
}
```

### 并发控制

```javascript
// 使用rate-limiter限制登录请求
const rateLimit = require('express-rate-limit')

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分钟
  max: 5, // 限制5次尝试
  message: '登录尝试次数过多，请稍后再试'
})

app.post('/login', loginLimiter, (req, res) => {
  // 登录处理
})
```

## 总结

:::tip
身份认证是Web应用安全的核心组件，选择合适的认证方案并遵循安全最佳实践至关重要。在实现认证系统时，需要平衡安全性、用户体验和系统性能，同时要考虑到系统的可扩展性和维护性。通过合理使用缓存、并发控制等技术，可以在保证安全性的同时提供良好的用户体验。
:::
